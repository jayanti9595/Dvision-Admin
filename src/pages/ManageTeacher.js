import React, { useEffect, useState, useRef } from 'react';
import '../assets/css/users.scss';
import { API_URL, APP_PREFIX_PATH, IMAGE_PATH } from "../config/AppConfig";
import Breadcrumbs from "../components/Breadcrumbs";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { BsEyeFill } from "react-icons/bs";
import { BiSolidToggleLeft } from "react-icons/bi";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoSearch } from "react-icons/io5";
import { Modal, Button } from "react-bootstrap";
import { encode as base64_encode } from 'base-64';
const ManageTeacher = () => {
  const [userData, setTotalUser] = useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showActiveModal, setShowActiveModal] = React.useState(false);
  const [msg, setmsg] = React.useState('');
  const [activemodalUserid, setactivemodalUserid] = React.useState(null);


  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleDropdownClick = (index) => {
    setSelectedIndex(index === selectedIndex ? null : index);
  };

  const handleView = (event) => {
    event.preventDefault();
    navigate(`/view-user`);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedIndex(null);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = userData.filter((user) => {
    const lowercasedTerm = searchQuery.toLowerCase();
    const userNameMatch = user.name?.toLowerCase().includes(lowercasedTerm);
    const classNameMatch = user.class_name?.toLowerCase().includes(lowercasedTerm);
    const activeFlagLableMatch = user.active_flag_lable?.toLowerCase().includes(lowercasedTerm);
    const emailMatch = user.email?.toLowerCase().includes(lowercasedTerm);
    const dateMatch = user.createtime ? String(user.createtime).toLowerCase().includes(lowercasedTerm) : false;
    const mobile = user.mobile ? String(user.mobile).toLowerCase().includes(lowercasedTerm) : false;
    return userNameMatch || dateMatch || emailMatch || mobile || activeFlagLableMatch || classNameMatch;
  });

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const breadcrumbItems = [
    { label: "Dashboard", path: `/${APP_PREFIX_PATH}/dashboard` },
    { label: "View Teacher", path: `/${APP_PREFIX_PATH}/view-user` },
  ];

  const handleActivateDeactivate = () => {
    if (activemodalUserid) {
      const newStatus = activemodalUserid.status === 1 ? 0 : 1;
      axios
        .post(`${API_URL}/activate_deactivate_user`, { user_id: activemodalUserid.user_id, newStatus })
        .then((res) => {
          // if (res.data.success) {
            fetchUser();
            setShowActiveModal(false);
          // }
          handleClose();
        })
        .catch((error) => {
          console.log('Error updating user status:', error);
          setShowActiveModal(false); 
        });
    }
  };

  function fetchUser() {
    const token = sessionStorage.getItem('token');
    axios.get(API_URL + "/get_teacher", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response) => {
      if (response.data.success) {
        setTotalUser(response.data.teacher_arr);
      } else {
        setTotalUser([])
      }
    }).catch((error) => {
      console.log("error : ", error);
    })
  }

  useEffect(() => {
    fetchUser();
  }, [])

  const handleActionChange = (action, user) => {
    if (action === 'Activate/Deactivate') {
      setShowActiveModal(true);
      setmsg(user.active_flag);
      setactivemodalUserid({ user_id: user.user_id, status: user.active_flag });
      setSelectedIndex(null); // Close dropdown when modal opens
    }
  };

  const dropdownRefs = useRef([]);

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

  return (
    <><div className="container mt-5">
      <Breadcrumbs title="Manage Teacher" items={breadcrumbItems} />
      <div className="mc-card">
        <div className="row mb-4 mt-2">
          <div className="col-lg-3">
            <form className="header-search">
              <IoSearch className="ms-3" />
              <input type="text" placeholder="Search Here..." onChange={handleSearch} />
            </form>
          </div>
          <div className="col-lg-9" style={{ textAlign: 'right' }}>
            <div>
              <Link
                to={`/${APP_PREFIX_PATH}/add-teacher`}
                className="send-btn btn-primary"
              >
                Add Teacher
              </Link>
            </div>
          </div>
        </div>

        <div className="mc-table-responsive" >
          <table className="table">
            <thead className='table-head'>
              <tr>
                <th>S No.</th>
                <th>Action</th>
                <th>Image</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>class</th>
                <th>Status</th>
                <th>Create Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? <> {currentUsers.map((user, index) => (
                <tr key={user.sn}>
                  <td>{index + 1}.</td>
                  <td>
                    <div
                      className="dropdown custom-dropup"
                      style={{ position: 'relative' }}
                      ref={el => dropdownRefs.current[index] = el}
                    >
                      <button
                        className="btn-primary dropdown-toggle"
                        type="button"
                        onClick={() => handleDropdownClick(index)}
                      >
                        Action
                      </button>
                      <ul
                        className="dropdown-menu"
                        id="long-menu"
                        style={{
                          display: selectedIndex === index ? "block" : "none",
                          position: 'absolute',
                          zIndex: 9999,
                          left: 0,
                          top: '100%',
                        }}
                      >
                        <li>
                          <Link
                            className="dropdown-item"
                            to={`/${APP_PREFIX_PATH}/view-user/${base64_encode(user.user_id)}`}
                          >
                            <BsEyeFill className="me-2" />
                            View
                          </Link>
                        </li>
                        <li>
                          <button className="dropdown-item" onClick={(e) => { handleActionChange("Activate/Deactivate", user) }}>
                            <BiSolidToggleLeft className="me-2" />
                            Activate/Deactivate
                          </button>
                        </li>
                      </ul>
                    </div>
                  </td>
                  <td><img src={user.image != null
                    ? `${IMAGE_PATH}${user.image}`
                    : `${IMAGE_PATH}placeholder.png`} style={{ width: '60px', height: '60px', borderRadius: '50%' }} /></td>
                  <td>{user.name || "NA"}</td>
                  <td>{user.email || "NA"}</td>
                  <td>{user.mobile || "NA"}</td>
                  <td>{user.class_name || "NA"}</td>
                  <td><p className='active-btn'style={{background : user.active_flag == 1 ? "green" : "red"}}>{user.active_flag_lable}</p></td>
                  <td>{user.createtime || "NA"}</td>
                </tr>
              ))}</> : <><tr>
              <td colSpan="8">
                No Data Found
              </td>
            </tr></>}
             
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
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

    </div>
      {/* import {Modal, Button} from "react-bootstrap"; */}

      <Modal
        show={showActiveModal}
        onHide={() => setShowActiveModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Activate/Deactivate User</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p className="fs-5">
            Are you sure you want to {msg === 1 ? "Deactivate" : "Activate"} this user?
          </p>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="secondary" onClick={() => setShowActiveModal(false)}>
            Cancel
          </Button>
          <Button variant={msg === 1 ? "danger" : "success"} onClick={handleActivateDeactivate}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ManageTeacher;
