import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL, APP_PREFIX_PATH } from "../config/AppConfig";
import Breadcrumbs from "../components/Breadcrumbs";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import Swal from 'sweetalert2'
import Select from "react-select";
const ManageBroadcast = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [userData, setUserData] = useState([]); // Available users
  const [selectedUsers, setSelectedUsers] = useState([]); // Selected users
  var [title, setTitle] = useState('');
  var [titleError, setTitleError] = useState("");
  var [message, setMessage] = useState('');
  var [messageError, setMessageError] = useState('');
  const [selectedUsersError, setSelectedUsersError] = useState('')

  useEffect(() => {
    axios
      .get(`${API_URL}/get_broadcast_user`)
      .then((response) => {
        const userOptions = response.data.user_data.map((user) => ({
          value: user.user_id,
          label: `${user.name} (${user.mobile})`,
          // mobile : user.mobile
        }));
        setUserData(userOptions);
      })
      .catch((error) => {
        console.log("Error fetching users:", error);
      });
  }, []);

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const breadcrumbItems = [
    { label: "Home", path: `/${APP_PREFIX_PATH}/dashboard` },
    { label: "Broadcast", path: `/${APP_PREFIX_PATH}/profile` },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;

    if (!title) {
      setTitleError('Please Enter Title');
      hasError = true;
    } else {
      setTitleError('');
    }
    if (!title) {
      setMessageError('Please Enter Message');
      hasError = true;
    } else {
      setMessageError('');
    }
    if (hasError) {
      return;
    }
    axios.post(API_URL + "/sent_broadcast_message_all_user", {title_user : title, message_user : message }).then((response) => {
      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Broadcast message sent successfully",
          showConfirmButton: false,
          timer: 1500
        });
        setTitle('');
        setTitleError("");
        setMessage("");
        setMessageError('');
      } else {
        Swal.fire({
          icon: "success",
          title: "Broadcast message sent UnSuccessfully",
          showConfirmButton: false,
          timer: 1500
        });
      }
    }).catch((error) => {
      console.log("Error : ", error);
    })

  }

  const handleSubmitBroadcast = async (e) => {
    e.preventDefault();
    let hasError = false;

    if (!title) {
      setTitleError('Please Enter Title');
      hasError = true;
    } else {
      setTitleError('');
    }
    if (!title) {
      setMessageError('Please Enter Message');
      hasError = true;
    } else {
      setMessageError('');
    }
    if (!selectedUsers.length > 0) {
      setSelectedUsersError("Please Select Users")
    } else {
      setSelectedUsersError('')
    }
    if (hasError) {
      return;
    }
    axios.post(API_URL + "/sent_broadcast_message_selected_user", {title_user : title,message_user : message, selectedUsers }).then((response) => {
      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Broadcast message sent successfully",
          showConfirmButton: false,
          timer: 1500
        });
        setTitle('');
        setSelectedUsers('');
        setSelectedUsersError('')
        setTitleError("");
        setMessage("");
        setMessageError('');
      } else {
        Swal.fire({
          icon: "success",
          title: "Broadcast message sent UnSuccessfully",
          showConfirmButton: false,
          timer: 1500
        });
      }
    }).catch((error) => {
      console.log("Error : ", error);
    })

  }

  return (
    <div className="container mt-5">
      <Breadcrumbs title="Broadcast" items={breadcrumbItems} />

      <div className="row">
        <div className="col-lg-12">
          <div className="mc-card">
            <div className="profile-container">
              <div className="profile-tabs">
                <button
                  className={`tab ${activeTab === "profile" ? "active" : ""}`}
                  onClick={() => { handleTabChange("profile"); setTitle(''); setTitleError(''); setMessage(''); setMessageError(''); setSelectedUsers(''); setSelectedUsersError('') }}
                >
                  All Users
                </button>

                <button
                  className={`tab ${activeTab === "changepwd" ? "active" : ""}`}
                  onClick={() => { handleTabChange("changepwd"); setTitle(''); setTitleError(''); setMessage(''); setMessageError(''); setSelectedUsers(''); setSelectedUsersError('') }}
                >
                  Select Users
                </button>
              </div>

              <div className="tab-content">
                {activeTab === "profile" && (
                  <div className="col-lg-12">
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="form-group mb-2 col-lg-12">
                          <label>Title</label>
                          <input type="text" value={title} className="form-control" placeholder="Enter Title" onChange={(e) => {
                            setTitle(e.target.value);
                            setTitleError("");
                          }} />
                          {titleError && <span style={{ fontSize: "13px" }} className="text-danger">{titleError}</span>}

                        </div>

                        <div className="form-group mb-2 col-lg-12">
                          <label>Message</label>
                          <textarea value={message} className="form-control" placeholder="Enter Message" rows="4" onChange={(e) => {
                            setMessage(e.target.value);
                            setMessageError("");
                          }}></textarea>
                          {messageError && <span style={{ fontSize: "13px" }} className="text-danger">{messageError}</span>}

                        </div>

                        <div className="col-lg-3">
                          <button type="submit" className="btn mt-3 send-btn">
                            <RiVerifiedBadgeFill style={{ fontSize: "20px" }} /> Send
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}

                {activeTab === "changepwd" && (
                  <div className="row">
                    <div className="col-lg-12">
                      <form onSubmit={handleSubmitBroadcast}>
                        <div className="row">
                          <div className="form-group mb-2 col-lg-12">
                            <label>Select Users</label>
                            <Select
                              isMulti
                              options={userData}
                              value={selectedUsers}
                              onChange={setSelectedUsers}
                              className="basic-multi-select"
                              classNamePrefix="select"
                            />
                            {selectedUsersError && <span style={{ fontSize: "13px" }} className="text-danger">{selectedUsersError}</span>}

                          </div>
                          <div className="form-group mb-2 col-lg-12">
                            <label>Title</label>
                            <input type="text" value={title} className="form-control" placeholder="Enter Title" onChange={(e) => {
                              setTitle(e.target.value);
                              setTitleError("");
                            }} />
                            {titleError && <span style={{ fontSize: "13px" }} className="text-danger">{titleError}</span>}
                          </div>

                          <div className="form-group mb-2 col-lg-12">
                            <label>Message</label>
                            <textarea value={message} className="form-control" placeholder="Enter Message" rows="4" onChange={(e) => {
                              setMessage(e.target.value);
                              setMessageError("");
                            }}></textarea>
                            {messageError && <span style={{ fontSize: "13px" }} className="text-danger">{messageError}</span>}
                          </div>

                          <div className="col-lg-3">
                            <button type="submit" className="btn mt-3 send-btn">
                              <RiVerifiedBadgeFill style={{ fontSize: "20px" }} /> Send
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

      {/* Styling for selected users */}
      <style>
        {`
          .selected-users {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 10px;
          }
          .user-tag {
            background-color: #007bff;
            color: white;
            padding: 5px 10px;
            border-radius: 15px;
            display: flex;
            align-items: center;
            font-size: 14px;
          }
          .remove-btn {
            background: none;
            border: none;
            color: white;
            font-size: 16px;
            margin-left: 5px;
            cursor: pointer;
          }
        `}
      </style>
    </div>
  );
};

export default ManageBroadcast;
