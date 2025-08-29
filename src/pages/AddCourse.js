import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL, APP_PREFIX_PATH } from '../config/AppConfig';
import Breadcrumbs from '../components/Breadcrumbs';

const AddCourse = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');

  const [formData, setFormData] = useState({
    classId: '',
    subjectId: '',
    title: '',
    description: '', // Added description state
    image: null,
    
  });

  const [errors, setErrors] = useState({
    classId: '',
    subjectId: '',
    title: '',
    description: '', // Added error state for description
    image: ''
  });

  const [classOptions, setClassOptions] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [formError, setFormError] = useState('');

  const courseTypeOptions = [
    { id: 1, name: 'RBSE' },
    { id: 2, name: 'CBSE' }
  ];
  const [courseType, setCourseType] = useState('');

  // Fetch class options on component mount
  useEffect(() => {
    const fetchClassOptions = async () => {
      try {
        // Fetch classes
        const classRes = await axios.get(`${API_URL}/get_admin_classes?user_id=1`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setClassOptions(classRes.data.class_arr || []);
      } catch (error) {
        setFormError('Failed to load options');
      }
    };
    fetchClassOptions();
  }, [token]);

  // Update subject fetch to use both courseType and classId
  const fetchSubjectOptions = async (typeId, classId) => {
    if (!typeId || !classId) {
      setSubjectOptions([]);
      return;
    }
    try {
      const subjectRes = await axios.get(`${API_URL}/get_subjects_by_type_and_class?type_id=${typeId}&class_id=${classId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubjectOptions(subjectRes.data.subject_arr || []);
    } catch (error) {
      setSubjectOptions([]);
      setFormError('Failed to load subjects');
    }
  };

  const handleCourseTypeChange = async (e) => {
    const value = e.target.value;
    setCourseType(value);
    setFormData(prev => ({
      ...prev,
      subjectId: ''
    }));
    setSubjectOptions([]);
    if (value && formData.classId) {
      await fetchSubjectOptions(value, formData.classId);
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    if (name === 'classId') {
      setFormData(prev => ({
        ...prev,
        classId: value,
        subjectId: ''
      }));
      setSubjectOptions([]);
      if (courseType && value) {
        await fetchSubjectOptions(courseType, value);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    // Clear error when field changes
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        image: e.target.files[0]
      }));
      setErrors(prev => ({
        ...prev,
        image: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.classId) {
      newErrors.classId = 'Please select a class';
      isValid = false;
    }

    if (!formData.subjectId) {
      newErrors.subjectId = 'Please select a subject';
      isValid = false;
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Please enter a title';
      isValid = false;
    }

    if (!formData.description.trim()) { // Validate description
      newErrors.description = 'Please enter a description';
      isValid = false;
    }

    if (!formData.image) {
      newErrors.image = 'Please select an image';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!validateForm()) return;

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('class_id', formData.classId);
      formDataToSend.append('subject_id', formData.subjectId);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description); // Append description
      formDataToSend.append('image', formData.image);
      formDataToSend.append('pdf_upload_by', 0);
      formDataToSend.append('user_id', 0);
      formDataToSend.append('course_type', courseType);

      const response = await axios.post(`${API_URL}/add_courses`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        navigate(`/${APP_PREFIX_PATH}/manage-course`);
      } else {
        setFormError(response.data.msg || 'Failed to add course');
      }
    } catch (error) {
      setFormError('Error occurred while adding course');
      console.error('Error adding course:', error);
    }
  };

  const breadcrumbItems = [
    { label: 'Dashboard', path: `${APP_PREFIX_PATH}/dashboard` },
    { label: 'Add Course', path: `${APP_PREFIX_PATH}/add-course` }
  ];

  return (
    <div className="container mt-4">
      <Breadcrumbs title="Add Course" items={breadcrumbItems} />
      
      {formError && (
        <div className="alert alert-danger mb-4">
          {formError}
        </div>
      )}

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Course Type</label>
              <select
                className="form-select"
                value={courseType}
                onChange={handleCourseTypeChange}
              >
                <option value="">Select Course Type</option>
                {courseTypeOptions.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Class </label>
              <select
                className={`form-select ${errors.classId ? 'is-invalid' : ''}`}
                name="classId"
                value={formData.classId}
                onChange={handleChange}
              >
                <option value="">Select Class</option>
                {classOptions.map(cls => (
                  <option key={cls.class_id} value={cls.class_id}>
                    {cls.class_name}
                  </option>
                ))}
              </select>
              {errors.classId && <div className="invalid-feedback">{errors.classId}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Subject </label>
              <select
                className={`form-select ${errors.subjectId ? 'is-invalid' : ''}`}
                name="subjectId"
                value={formData.subjectId}
                onChange={handleChange}
                disabled={!courseType || !formData.classId || subjectOptions.length === 0}
              >
                <option value="">Select Subject</option>
                {subjectOptions.map(sub => (
                  <option key={sub.subject_id} value={sub.subject_id}>
                    {sub.subject_name}
                  </option>
                ))}
              </select>
              {errors.subjectId && <div className="invalid-feedback">{errors.subjectId}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Title </label>
              <input
                type="text"
                className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter course title"
              />
              {errors.title && <div className="invalid-feedback">{errors.title}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Description </label>
              <textarea
                className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter course description"
              />
              {errors.description && <div className="invalid-feedback">{errors.description}</div>}
            </div>

            <div className="mb-4">
              <label className="form-label">Image </label>
              <input
                type="file"
                className={`form-control ${errors.image ? 'is-invalid' : ''}`}
                accept="image/*"
                onChange={handleImageChange}
              />
              {errors.image && <div className="invalid-feedback">{errors.image}</div>}
            </div>

            <div className="d-flex justify-content-end">
              <button type="submit" className="btn btn-danger">
                Add Course
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
