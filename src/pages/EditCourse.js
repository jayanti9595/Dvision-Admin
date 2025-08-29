import React, { useState, useEffect } from "react";
import { API_URL, APP_PREFIX_PATH } from "../config/AppConfig";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Breadcrumbs from "../components/Breadcrumbs";

const EditCourse = () => {
  const { courseId } = useParams();
  const course_id = atob(courseId);
  console.log(courseId,"courseId", "");
  
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  const breadcrumbItems = [
    { label: "Dashboard", path: `/${APP_PREFIX_PATH}/dashboard` },
    { label: "Edit Course", path: `/${APP_PREFIX_PATH}/edit-course/${course_id}` },
  ];

  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [classOptions, setClassOptions] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const courseTypeOptions = [
    { id: 1, name: 'RBSE' },
    { id: 2, name: 'CBSE' }
  ];
  const [courseType, setCourseType] = useState("");

  const [classError, setClassError] = useState("");
  const [subjectError, setSubjectError] = useState("");
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchClassOptions();
    fetchCourseData();
  }, []);

  const fetchClassOptions = async () => {
    try {
      const res = await axios.get(`${API_URL}/get_admin_classes?user_id=1`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClassOptions(res.data.class_arr || []);
    } catch (error) {
      setFormError("Failed to load class options");
    }
  };

  // Fetch subjects for a given course type and class
  const fetchSubjectOptions = async (typeId, class_id) => {
    if (!typeId || !class_id) {
      setSubjectOptions([]);
      return;
    }
    try {
      const res = await axios.get(`${API_URL}/get_subjects_by_type_and_class?type_id=${typeId}&class_id=${class_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubjectOptions(res.data.subject_arr || []);
    } catch (error) {
      setSubjectOptions([]);
      setFormError("Failed to load subject options");
    }
  };

  const fetchCourseData = async () => {
    try {
      const res = await axios.get(`${API_URL}/get_course_detail?course_id=${course_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const course = res.data.course_arr;
      setClassId(course.class_id);
      setTitle(course.title);
      setDescription(course.description);
      setImage(course.image);
      setCourseType(course.course_type || "");
      // Fetch subjects for the course's type and class and set subjectId after subjects are loaded
      await fetchSubjectOptions(course.course_type, course.class_id);
      setSubjectId(course.subject_id);
    } catch (error) {
      setFormError("Failed to load course data");
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const validateForm = () => {
    let hasError = false;
    setFormError("");

    if (!classId) {
      setClassError("Please select a class");
      hasError = true;
    } else {
      setClassError("");
    }

    if (!subjectId) {
      setSubjectError("Please select a subject");
      hasError = true;
    } else {
      setSubjectError("");
    }

    if (!title) {
      setTitleError("Please enter a title");
      hasError = true;
    } else {
      setTitleError("");
    }

    if (!description) {
      setDescriptionError("Please enter a description");
      hasError = true;
    } else {
      setDescriptionError("");
    }

    return !hasError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("course_id", course_id)
    formData.append("class_id", classId);
    formData.append("subject_id", subjectId);
    formData.append("title", title);
    formData.append("description", description);
    formData.append('pdf_upload_by', 0);
    formData.append('user_id', 0);
    formData.append("course_type", courseType);
    if (image) formData.append("image", image);
    
    try {
      const response = await axios.post(`${API_URL}/edit_courses`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        navigate(`/${APP_PREFIX_PATH}/manage-course`);
      } else {
        setFormError(response.data.msg || "Failed to update course");
      }
    } catch (error) {
      setFormError("An error occurred while updating the course");
    }
  };

  return (
    <div className="container mt-4">
      <Breadcrumbs title="Edit Course" items={breadcrumbItems} />

      {formError && (
        <div className="alert alert-danger mb-4">
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="card p-4">
          <div className="mb-3">
            <label className="form-label">Course Type *</label>
            <select
              className="form-select"
              value={courseType}
              onChange={async (e) => {
                setCourseType(e.target.value);
                setSubjectId("");
                setSubjectOptions([]);
                if (e.target.value && classId) {
                  await fetchSubjectOptions(e.target.value, classId);
                }
              }}
            >
              <option value="">Select Course Type</option>
              {courseTypeOptions.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Class *</label>
            <select
              className={`form-select ${classError ? "is-invalid" : ""}`}
              value={classId}
              onChange={async (e) => {
                setClassId(e.target.value);
                setClassError("");
                setSubjectId(""); // reset subject
                setSubjectOptions([]); // reset subject list
                if (courseType && e.target.value) {
                  await fetchSubjectOptions(courseType, e.target.value);
                }
              }}
            >
              <option value="">Select Class</option>
              {classOptions.map((cls) => (
                <option key={cls.class_id} value={cls.class_id}>
                  {cls.class_name}
                </option>
              ))}
            </select>
            {classError && <div className="invalid-feedback">{classError}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Subject *</label>
            <select
              className={`form-select ${subjectError ? "is-invalid" : ""}`}
              value={subjectId}
              onChange={(e) => { setSubjectId(e.target.value); setSubjectError(""); }}
              disabled={!courseType || !classId || subjectOptions.length === 0}
            >
              <option value="">Select Subject</option>
              {subjectOptions.map((sub) => (
                <option key={sub.subject_id} value={sub.subject_id}>
                  {sub.subject_name}
                </option>
              ))}
            </select>
            {subjectError && <div className="invalid-feedback">{subjectError}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Title *</label>
            <input
              className={`form-control ${titleError ? "is-invalid" : ""}`}
              value={title}
              onChange={(e) => { setTitle(e.target.value); setTitleError(""); }}
              placeholder="Enter Course Title"
            />
            {titleError && <div className="invalid-feedback">{titleError}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Description *</label>
            <textarea
              className={`form-control ${descriptionError ? "is-invalid" : ""}`}
              value={description}
              onChange={(e) => { setDescription(e.target.value); setDescriptionError(""); }}
              placeholder="Enter Course Description"
            />
            {descriptionError && <div className="invalid-feedback">{descriptionError}</div>}
          </div>

          <div className="mb-4">
            <label className="form-label">Image</label>
            <input
              className="form-control"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          <div className="text-end">
            <button className="btn btn-danger px-4" type="submit">
              Update Course
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditCourse;
