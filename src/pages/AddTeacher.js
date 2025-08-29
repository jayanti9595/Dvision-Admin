import React, { useState, useEffect } from "react";
import { API_URL, APP_PREFIX_PATH } from "../config/AppConfig";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Breadcrumbs from "../components/Breadcrumbs";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AddTeacher = () => {
  const breadcrumbItems = [
    { label: "Dashboard", path: `/${APP_PREFIX_PATH}/dashboard` },
    { label: "Add Teacher", path: `/${APP_PREFIX_PATH}/add-teacher` },
  ];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [selectedSubjectName, setSelectedSubjectName] = useState(""); // ✅ NEW
  const [boardType, setBoardType] = useState("");
  const [image, setImage] = useState(null);
  const [classOptions, setClassOptions] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [phoneCode, setPhoneCode] = useState("+91");
  const [mobileNumber, setMobileNumber] = useState("");

  // Error state
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [classError, setClassError] = useState("");
  const [subjectError, setSubjectError] = useState("");
  const [boardError, setBoardError] = useState("");
  const [formError, setFormError] = useState("");
  const [phoneCodeError, setPhoneCodeError] = useState("");
  const [mobileNumberError, setMobileNumberError] = useState("");

  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  // Fetch classes
  useEffect(() => {
    axios
      .get(`${API_URL}/get_admin_classes?user_id=1`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setClassOptions(res.data.class_arr || []);
      })
      .catch(() => {
        setFormError("Failed to load class options");
      });
  }, [token]);

  // Fetch subjects
  useEffect(() => {
    const fetchSubjectsByClassAndBoard = async () => {

      try {
        const response = await axios.get(
          `${API_URL}/get_teacher_subjects`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSubjectOptions(response.data.subject_arr || []);
      } catch (error) {
        setSubjectOptions([]);
        setSubjectId("");
        setFormError("Failed to load subject options");
      }
    };

    fetchSubjectsByClassAndBoard();
  }, [classId, boardType, token]);

  const handleImageChange = (e) => {
    if (e.target.files[0]) setImage(e.target.files[0]);
  };

  const handleSubjectChange = (e) => {
    const selectedId = e.target.value;
    setSubjectId(selectedId);
    setSubjectError("");
  
    const selectedSubject = subjectOptions.find(
      (sub) => sub.subject_id === parseInt(selectedId)
    );
  
    if (selectedSubject) {
      setSelectedSubjectName(selectedSubject.subject_name);
    } else {
      setSelectedSubjectName("");
    }
  };
  

  const validateForm = () => {
    let hasError = false;
    setFormError("");

    if (!name.trim()) {
      setNameError("Please enter teacher name");
      hasError = true;
    } else {
      setNameError("");
    }

    if (!email.trim()) {
      setEmailError("Please enter email");
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email");
      hasError = true;
    } else {
      setEmailError("");
    }

    if (!phoneCode.trim()) {
      setPhoneCodeError("Please select phone code");
      hasError = true;
    } else if (!/^\+\d{1,4}$/.test(phoneCode)) {
      setPhoneCodeError("Invalid phone code format");
      hasError = true;
    } else {
      setPhoneCodeError("");
    }

    if (!mobileNumber.trim()) {
      setMobileNumberError("Please enter mobile number");
      hasError = true;
    } else if (!/^\d{10}$/.test(mobileNumber)) {
      setMobileNumberError("Please enter a valid 10-digit mobile number");
      hasError = true;
    } else {
      setMobileNumberError("");
    }

    if (!password) {
      setPasswordError("Please enter password");
      hasError = true;
    } else if (password.length < 4) {
      setPasswordError("Password must be at least 4 characters");
      hasError = true;
    } else {
      setPasswordError("");
    }

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

    if (!boardType) {
      setBoardError("Please select board type");
      hasError = true;
    } else {
      setBoardError("");
    }

    return !hasError;
  };

  const handlePhoneCodeChange = (e) => {
    const value = e.target.value;
    if (/^\+?\d*$/.test(value)) {
      setPhoneCode(value);
      setPhoneCodeError("");
    }
  };

  const handleMobileNumberChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value)) {
      setMobileNumber(value);
      setMobileNumberError("");
    }
  };

  const handleClassChange = (e) => {
    setClassId(e.target.value);
    setClassError("");
    setSubjectId("");
    setSelectedSubjectName("");
  };

  const handleBoardChange = (e) => {
    setBoardType(e.target.value);
    setBoardError("");
    setSubjectId("");
    setSelectedSubjectName("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("mobile", mobileNumber);
    formData.append("phone_code", phoneCode);
    formData.append("mobile_number", mobileNumber);
    formData.append("password", password);
    formData.append("class_id", classId);
    formData.append("subject_id", subjectId);
    formData.append("subject_name", selectedSubjectName); // ✅ Send subject name
    formData.append("course_type", boardType);
    if (image) formData.append("image", image);

    axios
      .post(`${API_URL}/add_teacher`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data.key === "duplicate") {
          if (res.data.msg.includes("Email already exists")) {
            setEmailError("Email already registered");
          } else if (res.data.msg.includes("Mobile number already registered")) {
            setMobileNumberError("Mobile number already registered");
          }
        } else if (res.data.success) {
          navigate(`/${APP_PREFIX_PATH}/manage-teacher`);
        } else {
          setFormError(res.data.msg?.join(", ") || "Failed to add teacher");
        }
      })
      .catch((err) => {
        if (err.response?.data?.key === "duplicate") {
          if (err.response.data.msg.includes("Email already exists")) {
            setEmailError("Email already registered");
          } else if (err.response.data.msg.includes("Mobile number already registered")) {
            setMobileNumberError("Mobile number already registered");
          }
        } else {
          setFormError(err.response?.data?.message || "An error occurred");
        }
      });
  };
  return (
    <div className="container mt-4">
      <Breadcrumbs title="Add Teacher" items={breadcrumbItems} />

      {formError && (
        <div className="alert alert-danger mb-4">
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="card p-4">
          <div className="mb-3">
            <label className="form-label">Name *</label>
            <input
              className={`form-control ${nameError ? "is-invalid" : ""}`}
              value={name}
              onChange={(e) => { setName(e.target.value); setNameError("") }}
              placeholder="Enter teacher name"
            />
            {nameError && <div className="invalid-feedback">{nameError}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Email *</label>
            <input
              className={`form-control ${emailError ? "is-invalid" : ""}`}
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError("") }}
              placeholder="Enter email address"
            />
            {emailError && <div className="invalid-feedback">{emailError}</div>}
          </div>

          <div className="row">
            <div className="col-md-3 mb-3">
              <label className="form-label">Phone Code *</label>
              <input
                className={`form-control ${phoneCodeError ? "is-invalid" : ""}`}
                value={phoneCode}
                onChange={handlePhoneCodeChange}
                placeholder="+91"
                maxLength="5"
              />
              {phoneCodeError && <div className="invalid-feedback">{phoneCodeError}</div>}
            </div>
            <div className="col-md-9 mb-3">
              <label className="form-label">Mobile Number *</label>
              <input
                className={`form-control ${mobileNumberError ? "is-invalid" : ""}`}
                value={mobileNumber}
                onChange={handleMobileNumberChange}
                placeholder="Enter 10-digit mobile number"
                maxLength="10"
              />
              {mobileNumberError && <div className="invalid-feedback">{mobileNumberError}</div>}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Password *</label>
            <div className="input-group">
              <input
                className={`form-control ${passwordError ? "is-invalid" : ""}`}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPasswordError("") }}
                placeholder="Enter password"
              />
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {passwordError && <div className="invalid-feedback">{passwordError}</div>}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Class *</label>
            <select
              className={`form-select ${classError ? "is-invalid" : ""}`}
              value={classId}
              onChange={handleClassChange}
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
            <label className="form-label">Board Type *</label>
            <select
              className={`form-select ${boardError ? "is-invalid" : ""}`}
              value={boardType}
              onChange={handleBoardChange}
            >
              <option value="">Select Board</option>
              <option value="1">RBSE</option>
              <option value="2">CBSE</option>
            </select>
            {boardError && <div className="invalid-feedback">{boardError}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Subject *</label>
            <select
              className={`form-select ${subjectError ? "is-invalid" : ""}`}
              value={subjectId}
              onChange={handleSubjectChange}
            >
              <option value="">Select Subject</option>
              {subjectOptions.map((subject) => (
                <option key={subject.subject_id} value={subject.subject_id}>
                  {subject.subject_name}
                </option>
              ))}
            </select>
            {subjectError && <div className="invalid-feedback">{subjectError}</div>}
          </div>
          <div className="mb-4">
            <label className="form-label">Profile Image</label>
            <input
              className="form-control"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            <div className="form-text">Optional field</div>
          </div>

          <div className="text-end">
            <button className="btn btn-primary px-4" type="submit">
              Add Teacher
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddTeacher;