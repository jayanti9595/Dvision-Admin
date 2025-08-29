/* eslint-disable eqeqeq */
import React, { useEffect, useState, useRef } from "react";
import { API_URL, APP_PREFIX_PATH, IMAGE_PATH } from "../config/AppConfig";
import "../assets/css/profile.scss";
import Breadcrumbs from "../components/Breadcrumbs";
import { RiEyeFill, RiEyeOffFill, RiVerifiedBadgeFill } from "react-icons/ri";
import axios from "axios";
import { Button, Modal } from "react-bootstrap";
const Swal = require('sweetalert2')

const Profile = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editName, setAdminEditName] = useState("");
  const [editNameError, setEditNameError] = useState("");
  const [editEmail, setAdminEditEmail] = useState("");
  const [editEmailError, setEditEmailError] = useState("");
  const [editImage, setEditImage] = useState(null);
  const [editImageError, setEditImageError] = useState("");
  const [admin, setAllAdminData] = useState([]);
  const [modalMessage, setModalMessage] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalShow1, setmodalShow1] = useState(false);
  const [oldpassword, setOldPassword] = useState("");
  const [oldPasswordError, setOldPasswordError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confiremPassword, setConfirmPassword] = useState("");
  const [confiremPasswordError, setConfirmPasswordError] = useState("");

  const togglePasswordVisibility = (setVisibility) => {
    setVisibility((prevVisibility) => !prevVisibility);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const breadcrumbItems = [
    { label: "Home", path: `/${APP_PREFIX_PATH}/dashboard` },
    { label: "Profile", path: `/${APP_PREFIX_PATH}/profile` },
  ];

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/get_admin_data`);
      const adminData = response.data.info[0];
      setAllAdminData(adminData);
      setAdminEditName(adminData.username);
      setAdminEditEmail(adminData.email);
      setEditImage(adminData.image);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type;
      if (fileType.startsWith("image/")) {
        setEditImage(file);
        setEditImageError("");
      } else {
        setEditImageError("Please upload valid image format");
        e.target.value = null;
      }
    }
  };

  const handleAdminData = async (e) => {
    e.preventDefault();
    let hasError = false;

    if (!editName) {
      setEditNameError("Please Enter Name");
      hasError = true;
    } else {
      setEditNameError("");
    }
    if (!editEmail) {
      setEditEmailError("Please Enter Email");
      hasError = true;
    } else {
      setEditEmailError("");
    }

    if (!editImage) {
      setEditImageError("Please Select Image");
      hasError = true;
    } else {
      setEditImageError("");
    }

    if (hasError) {
      return;
    }

    const data = new FormData();
    data.append("name", editName);
    data.append("email", editEmail);

    if (editImage) {
      data.append("image", editImage);
    }

    try {
      const res = await axios.post(`${API_URL}/edit_admin_profile`, data);
      if (res.data.success) {

        Swal.fire({
          text: "Profile updated successfully",
          icon: "success"
        });

        setModalTitle("Update");
        setModalMessage("Profile updated successfully");
        fetchData();
      }
    } catch (error) {
      setModalMessage("Error updating profile");
      setmodalShow1(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;

    if (!oldpassword) {
      setOldPasswordError("Please Enter Old Password");
      hasError = true;
    } else {
      setOldPasswordError("");
    }

    if (!newPassword) {
      setNewPasswordError("Please Enter New Password");
      hasError = true;
    } else {
      setNewPasswordError("");
    }

    if (!confiremPassword) {
      setConfirmPasswordError("Please Enter Confirm Password");
      hasError = true;
    } else {
      setConfirmPasswordError("");
    }
    if (confiremPassword) {
      if (newPassword !== confiremPassword) {
        setConfirmPasswordError(
          "New password and confirm password fields must be equal"
        );
        hasError = true;
      } else {
        setConfirmPasswordError("");
      }
    }

    if (hasError) {
      return;
    }

    const data = { oldpassword, newPassword };

    try {
      const res = await axios.post(`${API_URL}/update_admin_password`, data);
      if (res.data.success === false) {
        setOldPasswordError("Current Password is not correct");
      } else if (res.data.key == "samePassword") {
        setNewPasswordError("New Password cannot same as Old Password");
      } else {
        Swal.fire({
          text: "Password updated successfully",
          icon: "success"
        });
        setmodalShow1(true);
        setModalMessage("Password updated successfully");
        setModalTitle("Change Password");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setOldPasswordError("");
        setNewPasswordError("");
        setConfirmPasswordError("");
        setTimeout(() => {
          setmodalShow1(false);
        }, 2000);
      }
    } catch (error) {
      setModalMessage("Error updating password");
      setmodalShow1(true);
    }
  };

  return (
    <div className="container mt-5">
      <Breadcrumbs title="Profile" items={breadcrumbItems} />

      <div className="row">
        <div className="col-lg-12">
          <div className="mc-card">
            <div className="profile-container">
              <div className="profile-tabs">
                <button
                  className={`tab ${activeTab === "profile" ? "active" : ""}`}
                  onClick={() => { handleTabChange("profile"); setEditImageError(''); setEditEmailError(''); setEditNameError(''); setOldPasswordError(''); setNewPasswordError(''); setConfirmPasswordError('') }}
                >
                  Edit profile
                </button>

                <button
                  className={`tab ${activeTab === "changepwd" ? "active" : ""}`}
                  onClick={() => { handleTabChange("changepwd"); setEditImageError(''); setEditEmailError(''); setEditNameError(''); setOldPasswordError(''); setNewPasswordError(''); setConfirmPasswordError('') }}
                >
                  Change Password
                </button>
              </div>

              {/* Tab Content */}
              <div className="tab-content">
                {activeTab === "profile" && (
                  <div className="row">
                    <div className="col-lg-4 mt-4">
                      <div className="mc-user-avatar-upload">
                        <div
                          className="mc-user-avatar"
                          onClick={() => setIsModalOpen(true)}
                          style={{ cursor: "pointer" }}
                        >
                          <img
                            src={
                              admin.image
                                ? `${IMAGE_PATH}${admin.image}`
                                : `${IMAGE_PATH}placeholder.png`
                            }
                            alt="profile"
                          />
                        </div>
                        <div className="mt-4">
                          <h3 className="user-name">{admin.username}</h3>
                          <p className="email">{admin.email}</p>
                        </div>
                      </div>
                    </div>
                    {/* form profile */}
                    <div className="col-lg-8">
                      <form onSubmit={handleAdminData}>
                        <div className="form-group mb-2">
                          <label htmlFor="name">Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="name"
                            value={editName}
                            onChange={(e) => { setAdminEditName(e.target.value); setEditNameError("") }}
                            placeholder="Enter Your Name"
                          />
                          {editNameError && (
                            <span className="text-danger" style={{ fontSize: "13px" }}>{editNameError}</span>
                          )}
                        </div>
                        <div className="form-group mb-2">
                          <label htmlFor="email">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            value={editEmail}
                            onChange={(e) => { setAdminEditEmail(e.target.value); setEditEmailError("") }}
                            placeholder="Enter Your Email"
                          />
                          {editEmailError && (
                            <span className="text-danger" style={{ fontSize: "13px" }}>
                              {editEmailError}
                            </span>
                          )}
                        </div>

                        <div className="form-group mb-2">
                          <label htmlFor="email">Image</label>
                          <input
                            type="file"
                            className="form-control"
                            id="email"
                            onChange={handleFileChange}
                          />
                          {editImageError && (
                            <span className="text-danger" style={{ fontSize: "13px" }}>
                              {editImageError}
                            </span>
                          )}
                        </div>

                        <button type="submit" className="btn mt-3 send-btn">
                          <RiVerifiedBadgeFill style={{ fontSize: "20px" }} />{" "}
                          Save Changes
                        </button>
                      </form>
                    </div>
                    {/* form profile end */}
                  </div>
                )}

                {activeTab === "changepwd" && (
                  <div className="row">
                    <div className="col-lg-12">
                      <form onSubmit={handleSubmit}>
                        <div className="row">
                          <div className="form-group mb-2 col-lg-6">
                            <label htmlFor="oldPassword">Old Password</label>
                            <div className="input-group">
                              <input
                                type={showOldPassword ? "text" : "password"}
                                className="form-control"
                                id="oldPassword"
                                placeholder="Enter Your Old Password"
                                value={oldpassword}
                                onChange={(e) => {
                                  setOldPassword(e.target.value);
                                  setOldPasswordError("");
                                }}
                              />
                              <span
                                className="input-group-text"
                                onClick={() =>
                                  togglePasswordVisibility(setShowOldPassword)
                                }
                                style={{ cursor: "pointer" }}
                              >
                                {showOldPassword ? (
                                  <RiEyeFill />
                                ) : (
                                  <RiEyeOffFill />
                                )}
                              </span>
                            </div>
                            {oldPasswordError && (
                              <span className="text-danger" style={{ fontSize: "13px" }}>
                                {oldPasswordError}
                              </span>
                            )}
                          </div>

                          <div className="form-group mb-2 col-lg-6">
                            <label htmlFor="newPassword">New Password</label>
                            <div className="input-group">
                              <input
                                type={showNewPassword ? "text" : "password"}
                                className="form-control"
                                id="newPassword"
                                placeholder="Enter Your New Password"
                                value={newPassword}
                                onChange={(e) => {
                                  setNewPassword(e.target.value);
                                  setNewPasswordError("");
                                }}
                              />
                              <span
                                className="input-group-text"
                                onClick={() =>
                                  togglePasswordVisibility(setShowNewPassword)
                                }
                                style={{ cursor: "pointer" }}
                              >
                                {showNewPassword ? (
                                  <RiEyeFill />
                                ) : (
                                  <RiEyeOffFill />
                                )}
                              </span>
                            </div>
                            {newPasswordError && (
                              <span className="text-danger" style={{ fontSize: "13px" }}>
                                {newPasswordError}
                              </span>
                            )}
                          </div>

                          <div className="form-group mb-2 col-lg-12">
                            <label htmlFor="confirmPassword">
                              Confirm Password
                            </label>
                            <div className="input-group">
                              <input
                                type={showConfirmPassword ? "text" : "password"}
                                className="form-control"
                                id="confirmPassword"
                                placeholder="Enter Confirm New Password"
                                value={confiremPassword}
                                onChange={(e) => {
                                  setConfirmPassword(e.target.value);
                                  setConfirmPasswordError("");
                                }}
                              />
                              <span
                                className="input-group-text"
                                onClick={() =>
                                  togglePasswordVisibility(
                                    setShowConfirmPassword
                                  )
                                }
                                style={{ cursor: "pointer" }}
                              >
                                {showConfirmPassword ? (
                                  <RiEyeFill />
                                ) : (
                                  <RiEyeOffFill />
                                )}
                              </span>
                            </div>
                            {confiremPasswordError && (
                              <span className="text-danger" style={{ fontSize: "13px" }}>
                                {confiremPasswordError}
                              </span>
                            )}
                          </div>

                          <div className="col-lg-3">
                            <button type="submit" className="btn mt-3 send-btn">
                              <RiVerifiedBadgeFill
                                style={{ fontSize: "20px" }}
                              />{" "}
                              Save Changes
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Image Preview */}
      {isModalOpen && (
  <>
    <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button 
          className="modal-close"
          onClick={() => setIsModalOpen(false)}
          aria-label="Close modal"
        >
          &times;
        </button>
        <img
          src={
            admin.image
              ? `${IMAGE_PATH}${admin.image}`
              : `${IMAGE_PATH}placeholder.png`
          }
          alt="Profile Preview"
          className="modal-image"
        />
      </div>
    </div>
    
    <Modal show={modalShow1} onHide={() => setmodalShow1(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{modalMessage}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setmodalShow1(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
    
    <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{modalMessage}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setModalShow(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  </>
)}
    </div>
  );
};

export default Profile;
