import React, { useEffect, useState, useRef } from 'react';
import { API_URL, APP_PREFIX_PATH } from "../config/AppConfig";
import Breadcrumbs from "../components/Breadcrumbs";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { Modal, Form } from 'react-bootstrap';
import { IoSearch } from "react-icons/io5";
import '../assets/css/variables.scss';
import { FaReply } from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ManageContact = () => {
  const [showViewModal, setShowViewModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [title, setTitle] = useState('');  // Added state for title
  const [titleError, setTitleError] = useState('');  // Added error state for title
  const [message, setMessage] = useState('');  // Added state for message
  const [msgError, setMsgError] = useState('');  // Added error state for message
  const [currentPage, setCurrentPage] = useState(1);
  const [contact_data, setContactData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(null);
  const dropdownRefs = useRef([]);

  var token = sessionStorage.getItem('token');
  var navigate = useNavigate();

  const fetchContactData = async () => {
    try {
      const response = await axios.get(`${API_URL}/get_contact_us`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.key === 'authenticateFailed') {
        sessionStorage.clear();
        navigate(APP_PREFIX_PATH + '/');
      } else {
      setContactData(response.data.contact_arr);
      }
    } catch (error) {
      console.log('Error fetching contact data:', error);
    }
  };

  useEffect(() => {
    fetchContactData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectedIndex !== null) {
        const ref = dropdownRefs.current[selectedIndex];
        if (ref && !ref.contains(event.target)) {
          setSelectedIndex(null);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedIndex]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleClick = (index) => {
    setSelectedIndex(index === selectedIndex ? null : index);
  };

  const filteredContact = contact_data.filter((user) => {
    const lowercasedTerm = searchQuery.toLowerCase();
    return (
      user.name?.toLowerCase().includes(lowercasedTerm) ||
      user.subject?.toLowerCase().includes(lowercasedTerm) ||
      user.email?.toLowerCase().includes(lowercasedTerm) ||
      user.message?.toLowerCase().includes(lowercasedTerm) ||
      user.status_lable_filter?.toLowerCase().includes(lowercasedTerm) ||
      user.createtime?.toLowerCase().includes(lowercasedTerm) ||
      user.reply_datetime?.toLowerCase().includes(lowercasedTerm)
    );
  });

  const handleShowViewModal = (user) => {
    setSelectedIndex(null)
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedUser('');
  };

  const handleShowReplyModal = (user) => {
    setSelectedIndex(null)
    setSelectedUser(user);
    setShowReplyModal(true);
  };

  const handleCloseReplyModal = () => {
    setShowReplyModal(false);
    setReplyMessage('');
    setTitle('');
    setMessage('');
    setTitleError('');
    setMsgError('');
  };

  const handleReply = () => {
    let hasError = false;
    if (!title) {
      setTitleError('Please enter title');
      hasError = true;
    }
    if (!message) {
      setMsgError('Please enter message');
      hasError = true;
    }
    if (hasError) {
      return;
    }

    if (selectedUser && selectedUser.email) {
      const { email, contact_id, name } = selectedUser;
      axios
        .post(API_URL + '/send_mail', { user_email: email, user_name: name, message, title }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((response) => {
          if (response.data.key === 'authenticateFailed') {
            sessionStorage.clear();
            navigate(APP_PREFIX_PATH + '/');
          } else {
          axios
              .post(API_URL + '/update_status', { contact_id, message }, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              })
              .then((updateResponse) => {
                if (updateResponse.data.key === 'authenticateFailed') {
                  sessionStorage.clear();
                  navigate(APP_PREFIX_PATH + '/');
                } else {
              fetchContactData();
              setShowReplyModal(false);
              handleCloseReplyModal();
                }
            })
            .catch((error) => {
              console.log('Error updating user status:', error);
            });
          }
        })
        .catch((error) => {
          console.log('Error sending email:', error.message);
        });
    } else {
      console.log("No user selected or user's email is invalid");
    }
  };

  const indexOfLastUser = currentPage * 50;
  const indexOfFirstUser = indexOfLastUser - 50;
  const currentUsers = filteredContact.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredContact.length / 50);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const breadcrumbItems = [
    { label: "Manage Contact", path: `/${APP_PREFIX_PATH}/dashboard` },
    { label: "Contact", path: `/${APP_PREFIX_PATH}/manage-contact` },
  ];

  return (
    <div className="container mt-5">
      <Breadcrumbs title="Manage Contact" items={breadcrumbItems} />
      <div className="mc-card">
        <div className="row mb-4 mt-2 flex-wrap">
          <div className="col-lg-3">
            <form className="header-search">
              <IoSearch className="ms-3" />
              <input type="text" placeholder="Search Here..." onChange={handleSearch} />
            </form>
          </div>
        </div>

        <div className="mc-table-responsive">
          <table className="table">
            <thead className="table-head">
              <tr>
                <th>S No.</th>
                <th>Action</th>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Reply Date & Time</th>
                <th>Create Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? <>{currentUsers.map((user, index) => (
                <tr key={user.sn}>
                  <td>{user.s_no}</td>
                  <td>
                    <div
                      className="dropdown custom-dropup"
                      style={{ position: 'relative' }}
                      ref={el => dropdownRefs.current[index] = el}
                    >
                      <button
                        className="btn-primary dropdown-toggle"
                        type="button"
                        onClick={() => handleClick(index)}
                      >
                        Action
                      </button>
                      <ul
                        className="dropdown-menu"
                        style={{
                          display: selectedIndex === index ? 'block' : 'none',
                          position: 'absolute',
                          zIndex: 9999,
                          left: 0,
                          top: '100%',
                        }}
                      >
                        <li>
                          <a className="dropdown-item" href="#" onClick={() => handleShowViewModal(user)}>
                            <FaReply className="me-2" /> View
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="#" onClick={() => handleShowReplyModal(user)}>
                            <FaReply className="me-2" /> Reply
                          </a>
                        </li>
                      </ul>
                    </div>
                  </td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  {/* <td>
                    <button style={{background : (user.status == 0) ?  : }} className="pending">{user.status_lable_filter}</button>
                  </td> */}
                  <td>
                    <button
                      style={{
                        background: user.status === 0 ? '#f4d02b' : '#4caf50', 
                        color: user.status === 0 ? '#fff' : '#fff', 
                      }}
                      className="pending"
                    >
                      {user.status_lable_filter}
                    </button>
                  </td>

                  <td>{user.reply_datetime}</td>
                  <td>{user.createtime}</td>
                </tr>
              ))}</> : <>
              <tr>
                  <td colSpan="7">
                    No Data Found
                  </td>
                </tr>
              </>}
              
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <HiChevronLeft style={{ fontSize: '20px' }} />
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={currentPage === index + 1 ? 'active' : ''}
            >
              {index + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <HiChevronRight style={{ fontSize: '20px' }} />
          </button>
        </div>
      </div>

      {/* View Modal */}
      <Modal show={showViewModal} onHide={handleCloseViewModal} style={{ zIndex: '99999', width: '100%' }}>
        <Modal.Header closeButton style={{ width: '100%' }}>
          <Modal.Title style={{ fontSize: '17px' }}>Message From {selectedUser.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ width: '100%' }}>
          {selectedUser && (
            <div>
              <p><strong>Message:</strong> {selectedUser.message}</p>
              <p><strong>Reply:</strong> {selectedUser.reply || "No Message Sent"}</p>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Reply Modal */}
      <Modal show={showReplyModal} onHide={handleCloseReplyModal} style={{ zIndex: '99999', width: '100%' }}>
        <Modal.Header closeButton style={{ width: '100%' }}>
          <Modal.Title style={{ fontSize: '17px' }}>Reply to {selectedUser?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ width: '100%' }}>
          {/* {selectedUser && (
            <div>
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
            </div>
          )} */}
          <Form.Group className="mb-3" controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {titleError && <p style={{ color: 'red' }}>{titleError}</p>}
          </Form.Group>
          <div className="mb-3">
            <label htmlFor="replyMessage" className="form-label">
              Reply Message
            </label>
            <textarea
              id="replyMessage"
              className="form-control"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your reply"
            />
            {msgError && <p style={{ color: 'red' }}>{msgError}</p>}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button variant="secondary" className='btn btn-secondary' onClick={handleCloseReplyModal}>
            Close
          </button>
          <button variant="primary" className='btn btn-primary' onClick={handleReply}>
            Send Reply
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageContact;
