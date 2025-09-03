import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./ShowSchools.css";

const ShowSchools = () => {
  const [schools, setSchools] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const location = useLocation();
  const API_URL = "http://localhost:5000/api/showschool";

  // ✅ Show toast if redirected with success message
  useEffect(() => {
    if (location.state?.success) {
      setSuccess(location.state.success);

      // Clear toast after 3 seconds
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  // ✅ Fetch schools
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const res = await axios.get(API_URL, { withCredentials: true });
        setSchools(Array.isArray(res.data.schools) ? res.data.schools : []);
      } catch (err) {
        setError(err?.response?.data?.error || "Failed to fetch schools");
      }
    };

    fetchSchools();
  }, []);

  return (
    <div className="flipkart-page">
      <h1>Schools Marketplace</h1>

      {/* ✅ Toast Messages */}
      {success && <div className="toast success">{success}</div>}
      {error && <div className="toast error">{error}</div>}

      {/* ✅ School Grid */}
      {schools.length === 0 ? (
        <p>No schools found.</p>
      ) : (
        <div className="flipkart-grid">
          {schools.map((school) => (
            <div key={school.id} className="flipkart-card">
              {school.image && (
                <img
                  src={`http://localhost:5000${school.image}`}
                  alt={school.name}
                  className="flipkart-image"
                />
              )}
              <div className="flipkart-details">
                <h3 className="flipkart-title">{school.name}</h3>
                <p>
                  <strong>Address:</strong> {school.address}, {school.city},{" "}
                  {school.state}
                </p>
                <p>
                  <strong>Contact:</strong> {school.contact} |{" "}
                  <strong>Email:</strong> {school.email_id}
                </p>
                <button className="flipkart-btn">View Details</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShowSchools;
