import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddSchool.css";

const AddSchool = () => {
  const navigate = useNavigate();

  // ✅ Enhanced API Configuration
  const API_CONFIG = {
    baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api",
    endpoints: {
      addSchool: "/addschool",
      showSchools: "/showschool",
    },
    timeout: parseInt(process.env.REACT_APP_API_TIMEOUT) || 30000, // 30 seconds
    withCredentials: true,
  };

  // ✅ Build full API URL
  const API_URL = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.addSchool}`;

  // ✅ Enhanced axios instance with better configuration
  const apiClient = axios.create({
    baseURL: API_CONFIG.baseURL,
    timeout: API_CONFIG.timeout,
    withCredentials: API_CONFIG.withCredentials,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  // ✅ Request interceptor for debugging and auth
  apiClient.interceptors.request.use(
    (config) => {
      console.log(`Making ${config.method.toUpperCase()} request to:`, config.url);
      
      // Add timestamp to avoid caching issues
      if (!config.params) config.params = {};
      config.params._t = Date.now();
      
      // Add auth token if available
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      return config;
    },
    (error) => {
      console.error('Request interceptor error:', error);
      return Promise.reject(error);
    }
  );

  // ✅ Response interceptor for better error handling
  apiClient.interceptors.response.use(
    (response) => {
      console.log('API Response:', response.status, response.data);
      return response;
    },
    (error) => {
      console.error('API Error:', error.response || error.message);
      
      // Handle different error types
      if (error.code === 'ECONNREFUSED') {
        setError('Server is not running. Please start the server and try again.');
      } else if (error.response?.status === 401) {
        setError('Unauthorized access. Please login again.');
        // Optionally redirect to login
        // navigate('/login');
      } else if (error.response?.status === 404) {
        setError('API endpoint not found. Please check server configuration.');
      } else if (error.response?.status >= 500) {
        setError('Server error. Please try again later.');
      }
      
      return Promise.reject(error);
    }
  );

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    contact: "",
    email_id: "",
  });
  
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Enhanced validation
  const validateForm = () => {
    const errors = [];
    
    // Name validation
    if (!formData.name?.trim() || formData.name.trim().length < 2) {
      errors.push("School name must be at least 2 characters");
    }
    
    // Address validation
    if (!formData.address?.trim() || formData.address.trim().length < 10) {
      errors.push("Address must be at least 10 characters");
    }
    
    // City validation
    if (!formData.city?.trim() || formData.city.trim().length < 2) {
      errors.push("City must be at least 2 characters");
    }
    
    // State validation
    if (!formData.state?.trim() || formData.state.trim().length < 2) {
      errors.push("State must be at least 2 characters");
    }
    
    // Contact validation - Indian mobile number
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!formData.contact || !phoneRegex.test(formData.contact)) {
      errors.push("Contact must be a valid 10-digit Indian mobile number");
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email_id || !emailRegex.test(formData.email_id)) {
      errors.push("Please provide a valid email address");
    }
    
    // Image validation
    if (!image) {
      errors.push("Please upload a school image");
    }
    
    return errors;
  };

  // ✅ Enhanced form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value.trim() 
    }));
    
    // Clear errors when user starts typing
    if (error) setError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Enhanced image validation
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!validTypes.includes(file.type)) {
        setError("Please upload a valid image file (JPEG, PNG, GIF)");
        return;
      }
      
      if (file.size > maxSize) {
        setError("Image size must be less than 5MB");
        return;
      }
      
      setImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
      
      // Clear any previous errors
      setError("");
    } else {
      setImage(null);
      setPreview(null);
    }
  };

  // ✅ Enhanced form submission with better error handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      // Client-side validation
      const validationErrors = validateForm();
      if (validationErrors.length > 0) {
        setError(validationErrors.join(". "));
        return;
      }

      // Prepare form data
      const data = new FormData();
      data.append("image", image);
      
      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value.trim());
      });

      // Log form data for debugging
      console.log("Submitting form data:");
      for (let [key, value] of data.entries()) {
        console.log(`${key}:`, value);
      }

      // Make API request using enhanced axios client
      const response = await apiClient.post(API_CONFIG.endpoints.addSchool, data);

      // Success handling
      const successMessage = response.data.message || "School added successfully!";
      setMessage(successMessage);
      
      // Show success message briefly before navigation
      setTimeout(() => {
        navigate("/showschools", {
          state: { 
            success: successMessage,
            schoolData: response.data.data 
          },
        });
      }, 1500);

    } catch (err) {
      console.error("Form submission error:", err);
      
      // Enhanced error handling
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.message.includes('Network Error')) {
        setError("Network error. Please check your internet connection and try again.");
      } else if (err.code === 'ECONNABORTED') {
        setError("Request timeout. Please try again.");
      } else {
        setError(`Failed to add school: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Environment info for debugging (remove in production)
  const showDebugInfo = process.env.NODE_ENV === 'development';

  return (
    <div className="add-school-container">
      <h2>Add New School</h2>

      {showDebugInfo && (
        <div className="debug-info" style={{ 
          background: '#f0f0f0', 
          padding: '10px', 
          marginBottom: '20px',
          fontSize: '12px',
          borderRadius: '4px'
        }}>
          <strong>Debug Info:</strong><br />
          Environment: {process.env.NODE_ENV}<br />
          API Base URL: {API_CONFIG.baseURL}<br />
          Full API URL: {API_URL}<br />
          Timeout: {API_CONFIG.timeout}ms
        </div>
      )}

      {/* Toast Messages */}
      {message && (
        <div className="toast success" style={{ marginBottom: '20px' }}>
          {message}
        </div>
      )}
      
      {error && (
        <div className="toast error" style={{ marginBottom: '20px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Form fields with enhanced validation */}
        {[
          { field: "name", type: "text", placeholder: "School Name *", required: true },
          { field: "address", type: "text", placeholder: "Complete Address *", required: true },
          { field: "city", type: "text", placeholder: "City *", required: true },
          { field: "state", type: "text", placeholder: "State *", required: true },
          { field: "contact", type: "tel", placeholder: "Contact Number (10 digits) *", required: true },
          { field: "email_id", type: "email", placeholder: "Email Address *", required: true }
        ].map(({ field, type, placeholder, required }) => (
          <input
            key={field}
            type={type}
            name={field}
            placeholder={placeholder}
            value={formData[field]}
            onChange={handleChange}
            required={required}
            disabled={loading}
            className={error.includes(field) ? 'error' : ''}
          />
        ))}

        {/* Image upload with preview */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
          disabled={loading}
        />

        {preview && (
          <div className="image-preview" style={{ margin: '10px 0' }}>
            <img 
              src={preview} 
              alt="Preview" 
              style={{ 
                maxWidth: '200px', 
                maxHeight: '200px', 
                objectFit: 'cover',
                borderRadius: '4px'
              }} 
            />
          </div>
        )}

        <button 
          type="submit" 
          className="btn-submit"
          disabled={loading}
          style={{ 
            opacity: loading ? 0.6 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Adding School...' : 'Add School'}
        </button>
      </form>
    </div>
  );
};

export default AddSchool;