import React, { useState, useEffect, useRef } from 'react';
import { API_URL, APP_PREFIX_PATH } from "../config/AppConfig";
import Breadcrumbs from "../components/Breadcrumbs";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { IoMdAdd } from "react-icons/io";
import { Modal } from 'react-bootstrap';
import { MdModeEdit, MdDelete } from "react-icons/md";
import axios from 'axios';
import { IoSearch } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import { BsEyeFill } from "react-icons/bs";
import { encode as base64_encode } from 'base-64';
const ManageCourse = () => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseData, setCourseData] = useState([]);
  const [courseToDelete, setCourseToDelete] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(null);
  const dropdownRefs = useRef([]);
  const token = sessionStorage.getItem('token');
  const navigate = useNavigate();

  // Fetch courses data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        selectedIndex !== null &&
        dropdownRefs.current[selectedIndex] &&
        !dropdownRefs.current[selectedIndex].contains(event.target)
      ) {
        setSelectedIndex(null);
      }
    };
    if (selectedIndex !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedIndex]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/get_courses_admin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.key === 'authenticateFailed') {
        sessionStorage.clear();
        navigate(APP_PREFIX_PATH + '/');
      } else {
        setCourseData(response.data.course_arr || []);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredCourses = courseData.filter((course) => {
    const lowercasedTerm = searchQuery.toLowerCase();
    return (
      (course.class_name?.toLowerCase().includes(lowercasedTerm)) ||
      (course.subject_name?.toLowerCase().includes(lowercasedTerm)) ||
      (course.title?.toLowerCase().includes(lowercasedTerm)) ||
      (course.createtime?.toLowerCase().includes(lowercasedTerm))
    );
  });

  const indexOfLastUser  = currentPage * 8;
  const indexOfFirstUser  = indexOfLastUser  - 8;
  const currentUsers = filteredCourses.slice(indexOfFirstUser , indexOfLastUser );
  const totalPages = Math.ceil(filteredCourses.length / 8);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDeleteCourse = () => {
    axios.post(`${API_URL}/delete_courses`, { course_id: courseToDelete }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((response) => {
      if (response.data.key === 'authenticateFailed') {
        sessionStorage.clear();
        navigate(APP_PREFIX_PATH + '/');
      } else if (response.data.success) {
        fetchData();
        setShowDeleteModal(false);
      }
    })
    .catch(console.error);
  };

  const handleClick = (index) => {
    setSelectedIndex(selectedIndex === index ? null : index);
  };

  return (
    <div className="container mt-5">
      <Breadcrumbs title="Manage Course" items={[{ label: "Dashboard", path: `/${APP_PREFIX_PATH}/dashboard` }, { label: "Manage Course", path: `/${APP_PREFIX_PATH}/manage-course` }]} />
      <div className="mc-card">
        <div className="row mb-4 mt-2 flex-wrap">
          <div className="col-lg-3">
            <form className="header-search">
              <IoSearch className="ms-3" />
              <input type="text" placeholder="Search Here..." onChange={handleSearch} />
            </form>
          </div>
          <div className="col-lg-9 text-end">
            <button className='send-btn btn-primary' onClick={() => navigate(`/${APP_PREFIX_PATH}/add-course`)}>
              <IoMdAdd style={{ fontSize: '20px', marginRight: '3px' }} />Add Course
            </button>
          </div>
        </div>

        <div className="mc-table-responsive">
          <table className="table">
            <thead className='table-head'>
              <tr>
                <th>S No.</th>
                <th>Action</th>
                <th>Class</th>
                <th>Subject</th>
                <th>Title</th>
                <th>Create Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? 
                currentUsers.map((course, index) => (
                  <tr key={course.course_id}>
                    <td>{indexOfFirstUser  + index + 1}</td>
                    <td>
                      <div className="dropdown custom-dropup" ref={el => dropdownRefs.current[index] = el}>
                        <button
                          className="btn-primary dropdown-toggle"
                          type="button"
                          onClick={() => handleClick(index)}
                        >
                          Action
                        </button>
                        <ul className={`dropdown-menu ${selectedIndex === index ? 'show' : ''}`}>
                          <li>
                            <Link className="dropdown-item" to={`/${APP_PREFIX_PATH}/view-course/${btoa(String(course.course_id))}`}>
                              <BsEyeFill className="me-2" /> View
                            </Link>
                          </li>
                          <li>
                            <Link className="dropdown-item" to={`/${APP_PREFIX_PATH}/edit-course/${btoa(String(course.course_id))}`}>
                              <MdModeEdit className='me-2' /> Edit
                            </Link>
                          </li>
                          <li>
                            <button className="dropdown-item" onClick={() => { setCourseToDelete(course.course_id); setShowDeleteModal(true); }}>
                              <MdDelete className='me-2' /> Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td>
                    <td>{course.class_name}</td>
                    <td>{course.subject_name}</td>
                    <td>{course.title}</td>
                    <td>{course.createtime}</td>
                  </tr>
                )) : 
                <tr>
                  <td colSpan="6" className="text-center">No Data Found</td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
            <HiChevronLeft style={{ fontSize: '20px' }} />
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button key={index + 1} onClick={() => handlePageChange(index + 1)} className={currentPage === index + 1 ? 'active' : ''}>
              {index + 1}
            </button>
          ))}
          <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
            <HiChevronRight style={{ fontSize: '20px' }} />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <h6>Are you sure you want to delete this course?</h6>
            <p className="text-muted mb-0">This action cannot be undone.</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-danger" onClick={handleDeleteCourse}>
            Delete Course
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageCourse;
