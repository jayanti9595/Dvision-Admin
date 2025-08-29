/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-sequences */
import React, { useState, useRef, useEffect } from 'react';
import { API_URL, APP_PREFIX_PATH, IMAGE_PATH } from "../config/AppConfig";
import Breadcrumbs from "../components/Breadcrumbs";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { IoMdAdd } from "react-icons/io";
import { Modal } from 'react-bootstrap';
// import profileImages from "../assets/images/profile-img.jpg";
import '../assets/css/variables.scss';
// import SearchBar from '../components/SearchBar';
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
// import table from "../assets/images/table.jpg";
import axios from 'axios';
import { IoSearch } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const ManageSubject = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [subject_data, setAllSubjectData] = React.useState([]);
  const [class_data, setAllClassData] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [subjectToDelete, setSubjectDelete] = useState('');

  const [selectedClass, setSelectedClass] = React.useState('');
  const [selectedClassError, setSelectedClassError] = React.useState('');
  const [selectedCourseType, setSelectedCourseType] = React.useState('');
  const [selectedCourseTypeError, setSelectedCourseTypeError] = React.useState('');
  const [subject_name, setSubjectName] = useState('');
  const [subjectNameError, setSubjectNameError] = useState('');
  const [subjectImage, setSubjectImage] = useState(null);
const [subjectImageError, setSubjectImageError] = useState('');


  var token = sessionStorage.getItem('token');
  var navigate = useNavigate();

  const dropdownRefs = useRef([]);


  const handleAddSubject = (e) => {
    e.preventDefault();

    let hasError = false;

    if (!subject_name) {
      setSubjectNameError('Please Enter Subject Name');
      hasError = true;
    } else {
      setSubjectNameError('');
    }

    if (!selectedClass) {
      setSelectedClassError('Please Select Class');
      hasError = true;
    } else {
      setSelectedClassError('');
    }

    if (!selectedCourseType) {
      setSelectedCourseTypeError('Please Select Course Type');
      hasError = true;
    } else {
      setSelectedCourseTypeError('');
    }

    if (!subjectImage) {
      setSubjectImageError('Please Upload Image');
      hasError = true;
    } else {
      setSubjectImageError('');
    }

    if (hasError) {
      return;
    }

    const data = new FormData();
    data.append('subject_name', subject_name);
    data.append('class_id', selectedClass);
    data.append('course_type', selectedCourseType);
    data.append('subject_image', subjectImage);

    axios
      .post(`${API_URL}/add_subject`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        if (response.data.key === 'authenticateFailed') {
          sessionStorage.clear();
          navigate(APP_PREFIX_PATH + '/');
        }
        else if (response.data.key === 'subjectExists') {
          setSubjectNameError('Subject Already Exists');
        } else {
          fetchData();
          setShowModal(false);
          setSubjectNameError('');
          setSubjectName('');
          setSelectedClass('');
          setSelectedClassError('');
          setSelectedCourseType('');
          setSelectedCourseTypeError('');
        }
      })
      .catch((error) => {
        console.error('Error adding subject:', error);
      });
  };


  const handleClick = (index) => {
    setSelectedIndex(index === selectedIndex ? null : index);
  };

  var fetchData = () => {
    axios
      .get(`${API_URL}/get_subjects`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        if (response.data.key === 'authenticateFailed') {
          sessionStorage.clear();
          navigate(APP_PREFIX_PATH + '/');
        } else {
          setAllSubjectData(response.data.subject_arr || []);
        }
      })
      .catch((error) => {
        console.error('Error fetching subjects:', error);
      });
  };

  var fetchClassData = () => {
    axios
      .get(`${API_URL}/get_admin_classes?user_id=1`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        if (response.data.key === 'authenticateFailed') {
          sessionStorage.clear();
          navigate(APP_PREFIX_PATH + '/');
        } else {
          setAllClassData(response.data.class_arr || []);
        }
      })
      .catch((error) => {
        console.error('Error fetching classes:', error);
      });
  };

  const handleEdit = (e) => {
    e.preventDefault();

    let hasError = false;

    if (!subject_name) {
      setSubjectNameError('Please Enter Subject Name');
      hasError = true;
    } else {
      setSubjectNameError('');
    }

    if (!selectedClass) {
      setSelectedClassError('Please Select Class');
      hasError = true;
    } else {
      setSelectedClassError('');
    }

    if (!selectedCourseType) {
      setSelectedCourseTypeError('Please Select Course Type');
      hasError = true;
    } else {
      setSelectedCourseTypeError('');
    }

    if (!subjectImage) {
      setSubjectImageError('Please Upload Image');
      hasError = true;
    } else {
      setSubjectImageError('');
    }

    if (hasError) {
      return;
    }

    const data = new FormData();
    data.append('subject_id', subjectToDelete);
    data.append('subject_name', subject_name);
    data.append('class_id', selectedClass);
    data.append('course_type', selectedCourseType);
    data.append('subject_image', subjectImage);

    axios
      .post(`${API_URL}/edit_subject`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        if (response.data.key === 'authenticateFailed') {
          sessionStorage.clear();
          navigate(APP_PREFIX_PATH + '/');
        }
        else if (response.data.key === 'subjectExists') {
          setSubjectNameError('Subject Already Exists');
        } else if (response.data.success) {
          fetchData();
          setShowEditModal(false);
          setSubjectName('');
          setSubjectNameError('');
          setSelectedClass('');
          setSelectedClassError('');
          setSelectedCourseType('');
          setSelectedCourseTypeError('');
        } else {
          console.log('Subject Updated Unsuccessfully');
        }
      })
      .catch((error) => {
        console.error('Error updating subject:', error);
      });
  };

  React.useEffect(() => {
    fetchData();
    fetchClassData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const usersPerPage = 8;

  const handleAction = (action, data) => {
    if (action === 'Edit') {
      setShowEditModal(true);
      setSelectedIndex(null);
      setSelectedClass(data.class_id);
      setSelectedCourseType(data.course_type);
      setSubjectName(data.subject_name);
      setSubjectDelete(data.subject_id);
    } else if (action === 'Delete') {
      setSelectedIndex(null);
      setShowDeleteModal(true);
      setSubjectDelete(data.subject_id);
    }
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setSubjectName('');
    setSubjectNameError('');
    setSelectedClass('');
    setSelectedClassError('');
    setSelectedCourseType('');
    setSelectedCourseTypeError('');
  };

  const handleEditModal = (user) => { 
    setSelectedIndex(null);
    setShowEditModal(true); 
    setSelectedClass(user.class_id); 
    setSelectedCourseType(user.course_type); 
    setSubjectName(user.subject_name); 
    setSubjectDelete(user.subject_id);
    setSubjectImage(user.image);  
  };
  const handleEditCloseModal = () => { 
    setShowEditModal(false); 
    setSelectedClass(''); 
    setSubjectName(""); 
    setSubjectNameError(""); 
    setSelectedClassError(''); 
    setSelectedCourseType('');
    setSelectedCourseTypeError('');
  };


  const breadcrumbItems = [
    { label: "Manage Subject", path: `/${APP_PREFIX_PATH}/dashboard` },
    { label: "Subject", path: `/${APP_PREFIX_PATH}/ManageSubject` },
  ];

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredSubjects = subject_data.filter((subject) => {
    const lowercasedTerm = searchQuery.toLowerCase();
    const subjectNameMatch = subject.subject_name ? String(subject.subject_name).toLowerCase().includes(lowercasedTerm) : false;
    const classNameMatch = subject.class_name ? String(subject.class_name).toLowerCase().includes(lowercasedTerm) : false;
    const courseTypeMatch = subject.course_type_label ? String(subject.course_type_label).toLowerCase().includes(lowercasedTerm) : false;
    const dateMatch = subject.createtime ? String(subject.createtime).toLowerCase().includes(lowercasedTerm) : false;
    return subjectNameMatch || classNameMatch || courseTypeMatch || dateMatch;
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredSubjects.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredSubjects.length / usersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const deleteSubject = () => {
    axios
      .post(`${API_URL}/delete_subject`, { subject_id: subjectToDelete }, {
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
          fetchData();
          setShowDeleteModal(false);
          setSubjectDelete('');
        } else {
          console.error('Error deleting subject:', response.data.message);
        }
      })
      .catch((error) => {
        console.error('Error deleting subject:', error);
      });
  };


  return (
    <div className="container mt-5">
      <Breadcrumbs title="Manage Subject" items={breadcrumbItems} />
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
              <button className='send-btn btn-primary' onClick={handleShowModal}><IoMdAdd style={{ fontSize: '20px', marginRight: '3px' }} />Add Subject</button>
            </div>
          </div>
        </div>

        <div className="mc-table-responsive">
          <table className="table">
            <thead className='table-head'>
              <tr>
                <th>S No.</th>
                <th>Action</th>
                <th>Image</th>
                <th>Subject Name</th>
                <th>Class</th>
                <th>Course Type</th>
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
                        id="long-menu"
                        style={{
                          display: selectedIndex === index ? 'block' : 'none',
                          position: 'absolute',
                          zIndex: 9999,
                          left: 0,
                          top: '100%',
                        }}
                      >
                        <li><a className="dropdown-item" href="#" onClick={() => { handleEditModal(user) }}><MdModeEdit className='me-2' /> Edit</a></li>
                        <li><button className="dropdown-item" onClick={(e) => { handleAction("Delete", user) }}>  <MdDelete className='me-2' />Delete</button></li>
                      </ul>
                    </div>
                  </td>
                  <td><img alt="subject image" src={user.image != null
                      ? `${IMAGE_PATH}${user.image}`
                      : `${IMAGE_PATH}placeholderVillage.png`} style={{ width: '60px', height: '60px', borderRadius: '50%' }} /></td>
                   
                  <td>{user.subject_name}</td>
                  <td>{user.class_name}</td>
                  <td>{user.course_type_label}</td>
                  <td>{user.createtime}</td>
                </tr>
              ))}</> :<>
              <tr>
              <td colSpan="6">
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

      <Modal show={showModal} onHide={handleCloseModal} style={{ zIndex: '99999', width: '100%' }}>
        <Modal.Header closeButton style={{ width: '100%' }}>
          <Modal.Title style={{ fontSize: '17px' }}>Add Subject</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ width: '100%' }}>
          <form>
            <div className="mb-3">
              <label htmlFor="className" className="form-label">
                Select Class
              </label>
              <select
                id="className"
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  setSelectedClassError('');
                }}
                className="form-control"
              >
                <option value="" disabled>
                  Select Class
                </option>
                {class_data.map((result) => (
                  <option key={result.class_id} value={result.class_id}>
                    {result.class_name}
                  </option>
                ))}
              </select>
              {selectedClassError && <p style={{ color: 'red' }}>{selectedClassError}</p>}
            </div>
            <div className="mb-3">
              <label htmlFor="courseType" className="form-label">
                Select Course Type
              </label>
              <select
                id="courseType"
                value={selectedCourseType}
                onChange={(e) => {
                  setSelectedCourseType(e.target.value);
                  setSelectedCourseTypeError('');
                }}
                className="form-control"
              >
                <option value="" disabled>
                  Select Course Type
                </option>
                <option value="1">RBSE</option>
                <option value="2">CBSE</option>
              </select>
              {selectedCourseTypeError && <p style={{ color: 'red' }}>{selectedCourseTypeError}</p>}
            </div>
            <div className="mb-3">
              <label htmlFor="subjectName" className="form-label">
                Subject Name
              </label>
              <input 
                type="text" 
                className="form-control" 
                id="subjectName" 
                placeholder="Enter Subject Name" 
                value={subject_name}
                onChange={(e) => {
                  setSubjectName(e.target.value);
                  setSubjectNameError('');
                }} 
              />
              {subjectNameError && <p style={{ color: 'red' }}>{subjectNameError}</p>}
            </div>
            <div className="mb-3">
  <label htmlFor="subjectImage" className="form-label">Subject Image</label>
  <input 
    type="file" 
    className="form-control" 
    id="subjectImage" 
    accept="image/*"
    onChange={(e) => {
      setSubjectImage(e.target.files[0]);
      setSubjectImageError('');
    }} 
  />
  {subjectImageError && <p style={{ color: 'red' }}>{subjectImageError}</p>}
</div>

          </form>
        </Modal.Body>
        <Modal.Footer>
          {/* <button variant="secondary" className='btn btn-outline-secondary' onClick={handleCloseModal}>
            Cancel
          </button> */}
          <button variant="primary" className='btn btn-danger ' onClick={handleAddSubject}>
            Add Subject
          </button>
        </Modal.Footer>
      </Modal>
      {/* edit modal start here */}

      <Modal show={showEditModal} onHide={handleEditCloseModal} style={{ zIndex: '99999', width: '100%' }}>
        <Modal.Header closeButton style={{ width: '100%' }}>
          <Modal.Title style={{ fontSize: '17px' }}>Edit Subject</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ width: '100%' }}>
          <form>
            <div className="mb-3">
              <label htmlFor="className" className="form-label">
                Select Class
              </label>
              <select
                id="className"
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  setSelectedClassError('');
                }}
                className="form-control"
              >
                <option value="" disabled>
                  Select Class
                </option>
                {class_data.map((result) => (
                  <option key={result.class_id} value={result.class_id}>
                    {result.class_name}
                  </option>
                ))}
              </select>
              {selectedClassError && <p style={{ color: 'red' }}>{selectedClassError}</p>}
            </div>
            <div className="mb-3">
              <label htmlFor="courseType" className="form-label">
                Select Course Type
              </label>
              <select
                id="courseType"
                value={selectedCourseType}
                onChange={(e) => {
                  setSelectedCourseType(e.target.value);
                  setSelectedCourseTypeError('');
                }}
                className="form-control"
              >
                <option value="" disabled>
                  Select Course Type
                </option>
                <option value="1">RBSE</option>
                <option value="2">CBSE</option>
              </select>
              {selectedCourseTypeError && <p style={{ color: 'red' }}>{selectedCourseTypeError}</p>}
            </div>
            <div className="mb-3">
              <label htmlFor="subjectName" className="form-label">
                Subject Name
              </label>
              <input 
                type="text" 
                className="form-control" 
                id="subjectName" 
                placeholder="Enter Subject Name" 
                value={subject_name}
                onChange={(e) => {
                  setSubjectName(e.target.value);
                  setSubjectNameError('');
                }} 
              />
              {subjectNameError && <p style={{ color: 'red' }}>{subjectNameError}</p>}
            </div>
            <div className="mb-3">
  <label htmlFor="subjectImage" className="form-label">Subject Image</label>
  <input 
    type="file" 
    className="form-control" 
    id="subjectImage" 
    accept="image/*"
    onChange={(e) => {
      setSubjectImage(e.target.files[0]);
      setSubjectImageError('');
    }} 
  />
  {subjectImageError && <p style={{ color: 'red' }}>{subjectImageError}</p>}
</div>

          </form>
        </Modal.Body>
        <Modal.Footer>
          {/* <button variant="secondary" className='btn btn-outline-secondary' onClick={handleEditCloseModal}>
            Cancel
          </button> */}
          <button variant="primary" className='btn btn-danger' onClick={handleEdit}>
            Update Subject
          </button>
        </Modal.Footer>
      </Modal>


      {/* edit modal end*/}

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
      <Modal.Header closeButton style={{ width: '100%' }}>
          <Modal.Title style={{ fontSize: '17px' }}>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <div className="mb-3">
              <i className="fas fa-exclamation-triangle text-warning" style={{ fontSize: '3rem' }}></i>
            </div>
            <h6>Are you sure you want to delete this subject?</h6>
            <p className="text-muted mb-0">This action cannot be undone.</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          {/* <button 
            className="btn btn-outline-secondary me-2" 
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </button> */}
          <button 
            className="btn btn-danger px-4" 
            onClick={deleteSubject}
          >
            <MdDelete className="me-2" />
            Delete Subject
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageSubject;
