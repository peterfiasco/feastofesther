import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./EventForm.css";

const EventForm = ({ onSubmit, initialData = {}, isEdit = false }) => {
  // Form state
  const [formData, setFormData] = useState({
    title: initialData.title || "",
    theme: initialData.theme || "",
    date: initialData.date || "",
    venue: initialData.venue || "",
    eventBanner: null
  });

  // UI states
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  // Set preview if we have an initial banner
  useEffect(() => {
    if (initialData.eventBanner) {
      setPreview(initialData.eventBanner);
    }
  }, [initialData.eventBanner]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }

    if (name === "eventBanner" && files.length > 0) {
      const file = files[0];
      setFormData({ ...formData, eventBanner: file });
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!formData.theme.trim()) {
      newErrors.theme = "Theme is required";
    }
    
    if (!formData.date) {
      newErrors.date = "Date is required";
    }
    
    if (!formData.venue.trim()) {
      newErrors.venue = "Venue is required";
    }
    
    if (!isEdit && !formData.eventBanner) {
      newErrors.eventBanner = "Event banner is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("theme", formData.theme);
      payload.append("date", formData.date);
      payload.append("venue", formData.venue);
      
      if (formData.eventBanner) {
        payload.append("eventBanner", formData.eventBanner);
      }
      
      await onSubmit(payload);
      // Reset form if not editing
      if (!isEdit) {
        setFormData({
          title: "",
          theme: "",
          date: "",
          venue: "",
          eventBanner: null
        });
        setPreview(null);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="event-form-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="event-form"
      >
        <div className="form-header">
          <h2>{isEdit ? "Update Event" : "Create New Event"}</h2>
          <div className="form-header-underline"></div>
        </div>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="form-grid">
            <div className="form-group">
              <motion.div
                animate={{ 
                  y: focusedField === 'title' || formData.title ? -25 : 0,
                  scale: focusedField === 'title' || formData.title ? 0.8 : 1,
                  color: focusedField === 'title' ? '#c80e91' : errors.title ? '#e74c3c' : '#666'
                }}
                className="floating-label"
              >
                Event Title
              </motion.div>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                onFocus={() => setFocusedField('title')}
                onBlur={() => setFocusedField(null)}
                className={errors.title ? 'error' : ''}
              />
              <AnimatePresence>
                {errors.title && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="error-message"
                  >
                    {errors.title}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="form-group">
              <motion.div
                animate={{ 
                  y: focusedField === 'theme' || formData.theme ? -25 : 0,
                  scale: focusedField === 'theme' || formData.theme ? 0.8 : 1,
                  color: focusedField === 'theme' ? '#c80e91' : errors.theme ? '#e74c3c' : '#666'
                }}
                className="floating-label"
              >
                Event Theme
              </motion.div>
              <textarea
                name="theme"
                value={formData.theme}
                onChange={handleChange}
                onFocus={() => setFocusedField('theme')}
                onBlur={() => setFocusedField(null)}
                className={errors.theme ? 'error' : ''}
              />
              <AnimatePresence>
                {errors.theme && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="error-message"
                  >
                    {errors.theme}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="form-group">
              <motion.div
                animate={{ 
                  y: focusedField === 'date' || formData.date ? -25 : 0,
                  scale: focusedField === 'date' || formData.date ? 0.8 : 1,
                  color: focusedField === 'date' ? '#c80e91' : errors.date ? '#e74c3c' : '#666'
                }}
                className="floating-label"
              >
                Event Date
              </motion.div>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                onFocus={() => setFocusedField('date')}
                onBlur={() => setFocusedField(null)}
                className={errors.date ? 'error' : ''}
              />
              <AnimatePresence>
                {errors.date && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="error-message"
                  >
                    {errors.date}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="form-group">
              <motion.div
                animate={{ 
                  y: focusedField === 'venue' || formData.venue ? -25 : 0,
                  scale: focusedField === 'venue' || formData.venue ? 0.8 : 1,
                  color: focusedField === 'venue' ? '#c80e91' : errors.venue ? '#e74c3c' : '#666'
                }}
                className="floating-label"
              >
                Event Venue
              </motion.div>
              <textarea
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                onFocus={() => setFocusedField('venue')}
                onBlur={() => setFocusedField(null)}
                className={errors.venue ? 'error' : ''}
              />
              <AnimatePresence>
                {errors.venue && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="error-message"
                  >
                    {errors.venue}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="form-group file-upload-group">
              <div className="file-upload-label">Event Banner</div>
              <div 
                className={`file-upload-container ${errors.eventBanner ? 'error' : ''}`}
                onClick={triggerFileInput}
              >
                <input
                  type="file"
                  name="eventBanner"
                  ref={fileInputRef}
                  onChange={handleChange}
                  accept="image/*"
                  className="file-input"
                />
                
                {preview ? (
                  <div className="file-preview">
                    <img src={preview} alt="Event banner preview" />
                    <div className="preview-overlay">
                      <span>Change Image</span>
                    </div>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <div className="upload-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                      </svg>
                    </div>
                    <span>Click to upload event banner</span>
                    <span className="upload-hint">JPG, PNG or GIF, max 5MB</span>
                  </div>
                )}
              </div>
              <AnimatePresence>
                {errors.eventBanner && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="error-message"
                  >
                    {errors.eventBanner}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <motion.button
            type="submit"
            className="submit-button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="loading-spinner"></div>
            ) : isEdit ? (
              "Update Event"
            ) : (
              "Create Event"
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default EventForm;
