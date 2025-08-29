import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL, APP_LOGO, APP_PREFIX_PATH } from "../config/AppConfig";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { Modal } from "react-bootstrap";
const ResetPassword = () => {
  const navigate = useNavigate();
  // const { id } = useParams();
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [errors, setErrors] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;

    // Password validation
    if (!password) {
      setPasswordError("Please enter a new password");
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      hasError = true;
    } else {
      setPasswordError("");
    }

    // Confirm Password validation
    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      hasError = true;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match");
      hasError = true;
    } else {
      setConfirmPasswordError("");
    }

    if (hasError) {
      return;
    }

    console.log("New Password:", password);

    try {
      const response = await axios.post(`${API_URL}/admin_forget_new_password`, {
        newPassword: password,
      });

      if (response.data.success) {
        setSuccess("Password has been reset successfully!");
        setErrors("");
        setModalShow(true);
        setTimeout(() => {
          setModalShow(false);
          navigate(`/${APP_PREFIX_PATH}/`);
        }, 2000);
      } else {
        setErrors("Error updating password");
        setSuccess("");
      }
    } catch (error) {
      console.log(error);
      setErrors("Error updating password");
      setSuccess("");
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center">
      <div className="card" style={{ width: "450px", borderRadius: "16px" }}>
        <div className="card-body">
          <h5 className="card-title text-center">
            <img src={APP_LOGO} alt="Login" style={{ width: "150px", height: "120px" }} className="mb-4 mt-4" />
            <br />
            Create New Password
          </h5>
          <form onSubmit={handleSubmit} className="login-form">
            {/* Password Field */}
            <div className="mb-3">
              <label htmlFor="password" className="form-label">New Password</label>
              <div className="input-group">
                <input
                  placeholder="Enter Password"
                  type={showPassword ? "text" : "password"}
                  className={`form-control ${passwordError ? "is-invalid" : ""}`}
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError("");
                  }}
                />
                <span className="input-group-text" onClick={() => setShowPassword(!showPassword)} style={{ cursor: "pointer" }}>
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
              {passwordError && <div style={{ color: "red" }}>{passwordError}</div>}
            </div>

            {/* Confirm Password Field */}
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <div className="input-group">
                <input
                placeholder="Enter Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  className={`form-control ${confirmPasswordError ? "is-invalid" : ""}`}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setConfirmPasswordError("");
                  }}
                />
                <span className="input-group-text" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ cursor: "pointer" }}>
                  {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
              {confirmPasswordError && <div style={{ color: "red" }}>{confirmPasswordError}</div>}
            </div>

            {errors && <p style={{ color: "red" }}>{errors}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}

            <button type="submit" className="btn w-100" style={{background : "#f47b1e",color : "white"}}>
              Update Password
            </button>
          </form>

          <div className="mt-3 text-center">
            <Link to={`/${APP_PREFIX_PATH}/forgot-password`}>Forgot Password?</Link>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Modal show={modalShow} onHide={() => setModalShow(false)} style={{marginTop : "120px"}}>
        <Modal.Header closeButton>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>Password has been changed successfully</Modal.Body>
      </Modal>
    </div>
  );
};

export default ResetPassword;
