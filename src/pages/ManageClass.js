/* eslint-disable no-unused-expressions */
import React, { useEffect, useState, useRef } from 'react';
import { IoSearch } from "react-icons/io5";
import { API_URL, APP_PREFIX_PATH } from "../config/AppConfig";
import Breadcrumbs from "../components/Breadcrumbs";
import { HiChevronLeft } from "react-icons/hi";
import { HiChevronRight } from "react-icons/hi";
import { IoMdAdd } from "react-icons/io";
import { Modal } from 'react-bootstrap';
// import table from "../assets/images/table.jpg";
import '../assets/css/variables.scss';
// import SearchBar from '../components/SearchBar';
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ManageClass = () => {

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  // const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [category_data, setCategoryData] = useState([])
  const [searchQuery, setSearchQuery] = React.useState('');

  const [className, setClassName] = useState('');
  const [catgeoryNameError, setClassNameError] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [classToDelete, setCategoryDelete] = useState('');


  const [editclassNameError, setEditclassNameError] = useState('');
  const [EditclassName, setEditclassName] = useState('');

  const [deleteError, setDeleteError] = useState(''); 

  var token = sessionStorage.getItem('token');
  var navigate = useNavigate();

  const handleClick = (index) => {
    setSelectedIndex(index === selectedIndex ? null : index);
  };

  const handleClose = () => {
    // setAnchorEl(null);
    setSelectedIndex(null);
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

  const usersPerPage = 8;

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  var fatchCategoryData = async () => {
    axios
      .get(`${API_URL}/get_admin_classes?user_id=1`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        setCategoryData(response.data.class_arr || []);
      })
      .catch((error) => {
        console.log('Error  : ', error);
      });
  };

  useEffect(() => {
    fatchCategoryData();
  }, []);


  const handleShowModal = () => setShowModal(true);
  // eslint-disable-next-line no-sequences
  const handleCloseModal = () => { setShowModal(false); setClassName(''); setClassNameError('') };

  const handleEditModal = () => setShowEditModal(true);
  const handleEditCloseModal = () => {
    setShowEditModal(false);
    setEditclassName('');
    setEditclassNameError('');
  };

  const filteredUsers = category_data.filter((user) => {
    const lowercasedTerm = searchQuery.toLowerCase();
    const classNameMatch =user.class_name ? String(user.class_name).toLowerCase().includes(lowercasedTerm) : false;
    const dateMatch = user.createtime ? String(user.createtime).toLowerCase().includes(lowercasedTerm) : false;
    return classNameMatch || dateMatch;
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const breadcrumbItems = [
    { label: "Manage Classes", path: `/${APP_PREFIX_PATH}/dashboard` },
    { label: "Classes", path: `/${APP_PREFIX_PATH}/users` },
  ];


  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;
    console.log('className : ', className);

    if (!className) {
      setClassNameError('Please Enter Class Name');
      hasError = true;
    } else {
      setClassNameError('');
    }
    if (hasError) {
      return;
    }

    axios
      .post(`${API_URL}/add_class`, { class_name: className }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        if (response.data.key === 'authenticateFailed') {
          sessionStorage.clear();
          navigate(APP_PREFIX_PATH + '/');
        }
        else if (response.data.key === 'classExists') {
          setClassNameError('Class Already Exists');
        } else {
          setShowModal(false);
          setClassName('');
          setClassNameError('');
          fatchCategoryData();
        }
      })
      .catch((error) => {
        console.error('Error adding class:', error);
      });
  };

  const deleteCategory = () => {
    setDeleteError(''); // Clear any previous error messages
    axios
      .post(`${API_URL}/delete_class`, { class_id: classToDelete }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        if (response.data.key === 'authenticateFailed') {
          sessionStorage.clear();
          navigate(APP_PREFIX_PATH + '/');
        }
        else if (response.data.success) {
          fatchCategoryData();
          setShowDeleteModal(false);
          setCategoryDelete('');
        } else {
          // Show backend error message in the modal
          setDeleteError(response.data.msg || 'Failed to delete class');
        }
      })
      .catch((error) => {
        // Show error message in the modal
        setDeleteError(error.response?.data?.msg || 'An error occurred while deleting the class');
        console.error('Error deleting class:', error);
      });
  };



  const handleAction = (action, category) => {
    console.log("action  : ", category);

    if (action === 'Edit') {
      setSelectedIndex(null);
      setCategoryDelete(category.class_id );
      setEditclassName(category.class_name);
      setShowEditModal(true);
    } else if (action === 'Delete') {
      setSelectedIndex(null);
      setCategoryDelete(category.class_id );
      setShowDeleteModal(true);
    }
  };


  const handleEdit = (e) => {
    e.preventDefault();

    let hasError = false;

    if (!EditclassName.trim()) {
      setEditclassNameError('Please Enter Class Name');
      hasError = true;
    } else {
      setEditclassNameError('');
    }

    if (hasError) return;

    axios
      .post(`${API_URL}/edit_class`, {
        class_id: classToDelete,
        class_name: EditclassName
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        if (response.data.key === 'authenticateFailed') {
          sessionStorage.clear();
          navigate(APP_PREFIX_PATH + '/');
        }
        else if (response.data.key === 'classExists') {
          setEditclassNameError('Class Already Exists');
        } else {
          setShowEditModal(false);
          setEditclassName('');
          fatchCategoryData();
        }
      })
      .catch((error) => {
        console.error('Error updating class:', error);
      });
  };



  return (
    <div className="container mt-5">
      <Breadcrumbs title=" Manage Classes" items={breadcrumbItems} />
      <div className="mc-card">
        <div className="row mb-4 mt-2 flex-wrap">
          <div className="col-lg-3">
            <form className="header-search">
              <IoSearch className="ms-3" />
              <input type="text" placeholder="Search Here..." onChange={handleSearch} />
            </form>
          </div>
                      <div className="col-lg-9" style={{ textAlign: 'right' }}>
            <div >
              <button className='send-btn btn-primary' onClick={handleShowModal}><IoMdAdd style={{ fontSize: '20px', marginRight: '3px' }} />Add Class</button>
            </div>
          </div>
        </div>

        <div className="mc-table-responsive">
          <table className="table">
            <thead className='table-head'>
              <tr>
                <th>S No.</th>
                <th>Action</th>
                <th>Class Name</th>
                <th>Create Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? <> {currentUsers.map((user, index) => (
                <tr key={user.s_no}>
                  <td>{index + 1}</td>
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
                          <button className="dropdown-item" onClick={() => handleAction('Edit', user)}>
                            <MdModeEdit className="mr-2" /> Edit
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => handleAction('Delete', user)}
                          >
                            <MdDelete className="mr-2" /> Delete
                          </button>
                        </li>
                      </ul>
                    </div>
                  </td>

                  <td>{user.class_name}</td>
                  <td>{user.createtime}</td>
                </tr>
              ))}</> : <>
                <tr>
                  <td colSpan="5">
                    No Data Found
                  </td>
                </tr>
              </>}

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
      {/* add category Modal  */}
      <Modal show={showModal} onHide={handleCloseModal} style={{ zIndex: '99999', width: '100%' }}>
        <Modal.Header closeButton style={{ width: '100%' }}>
          <Modal.Title style={{ fontSize: '17px' }}>Add Class</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ width: '100%' }}>
          {/* Add your form fields here */}
          <form>
            <div className="mb-3">
              <label htmlFor="className" className="form-label">
                Class Name
              </label>
              <input value={className} type="text" className="form-control" id="className" placeholder="Enter Class Name" onChange={(e) => {
                setClassName(e.target.value);
                setClassNameError('');
              }} />
              {catgeoryNameError && <span style={{ fontSize: "10px" }} className="text-danger">{catgeoryNameError}</span>}
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          {/* <button variant="secondary" className='btn  btn-secondary' onClick={handleCloseModal}>
            Close
          </button> */}
          <button variant="primary" className=' btn-primary ' onClick={handleSubmit}>
            Add Class
          </button>
        </Modal.Footer>
      </Modal>
      {/* edit modal start here */}

      <Modal show={showEditModal} onHide={handleEditCloseModal} style={{ zIndex: '99999', width: '100%' }}>
        <Modal.Header closeButton style={{ width: '100%' }}>
          <Modal.Title style={{ fontSize: '17px' }}>Edit Class</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ width: '100%' }}>
          <form>
            <div className="mb-3">
              <label htmlFor="editclassName" className="form-label">
                Class Name
              </label>
              <input
                value={EditclassName}
                type="text"
                className="form-control"
                id="editclassName"
                placeholder="Enter Class Name"
                onChange={(e) => {
                  setEditclassName(e.target.value);
                  setEditclassNameError('');
                }}
              />
              {editclassNameError && (
                <span style={{ fontSize: '10px' }} className="text-danger">
                  {editclassNameError}
                </span>
              )}
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button variant="primary" className="btn-primary" onClick={handleEdit}>
            Edit Class
          </button>
        </Modal.Footer>
      </Modal>

      {/* edit modal end*/}

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Body>
          <div className="text-center">
            <div className="mb-3">
              <i className="fas fa-exclamation-triangle text-warning" style={{ fontSize: '3rem' }}></i>
            </div>
            <h6>Are you sure you want to delete this class?</h6>
            {/* Display backend error message if exists */}
            {deleteError && (
              <div className="mt-3" style={{color : "red"}}>
                {deleteError}
               </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button 
            className="btn btn-outline-secondary me-2" 
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </button>
          <button 
            className="btn btn-danger px-4" 
            onClick={deleteCategory}
          >
            Delete Class
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageClass;
