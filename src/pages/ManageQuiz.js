import React, { useState, useEffect, useRef } from 'react';
import { API_URL, APP_PREFIX_PATH } from "../config/AppConfig";
import Breadcrumbs from "../components/Breadcrumbs";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { IoMdAdd } from "react-icons/io";
import { MdModeEdit, MdDelete } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { Modal } from 'react-bootstrap';
import { encode as base64_encode } from 'base-64';
import { BsEyeFill } from "react-icons/bs";
const ManageQuiz = () => {
  const [quizData, setQuizData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(null);

  const token = sessionStorage.getItem('token');
  const navigate = useNavigate();
  const usersPerPage = 8;

  const fetchQuizData = () => {
    axios.get(`${API_URL}/get_quiz`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => {
        if (response.data.key === 'authenticateFailed') {
          sessionStorage.clear();
          navigate(APP_PREFIX_PATH + '/');
        } else {
          setQuizData(response.data.quiz_arr || []);
        }
      })
      .catch((error) => {
        console.error('Error fetching quiz:', error);
      });
  };

  useEffect(() => {
    fetchQuizData();
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredQuiz = quizData.filter((item) => {
    const lowercasedTerm = searchQuery.toLowerCase();
    const classNameMatch = item.class_name ? String(item.class_name).toLowerCase().includes(lowercasedTerm) : false;
    // const option1Match = item.option1 ? String(item.option1).toLowerCase().includes(lowercasedTerm) : false;
    // const option2Match = item.option2 ? String(item.option2).toLowerCase().includes(lowercasedTerm) : false;
    // const option3Match = item.option3 ? String(item.option3).toLowerCase().includes(lowercasedTerm) : false;
    // const option4Match = item.option4 ? String(item.option4).toLowerCase().includes(lowercasedTerm) : false;
    const subjectNameMatch = item.subject_name ? String(item.subject_name).toLowerCase().includes(lowercasedTerm) : false;
    const questionMatch = item.question ? String(item.question).toLowerCase().includes(lowercasedTerm) : false;
    return classNameMatch || subjectNameMatch || questionMatch;
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredQuiz.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredQuiz.length / usersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = (quizId) => {
    setQuizToDelete(quizId);
    setShowDeleteModal(true);
    setSelectedIndex(null);
  };

  const handleClick = (index) => {
    setSelectedIndex(index === selectedIndex ? null : index);
  };

  const confirmDelete = () => {
    axios.post(`${API_URL}/delete_quiz`, { quiz_id: quizToDelete }, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => {
        if (response.data.key === 'authenticateFailed') {
          sessionStorage.clear();
          navigate(APP_PREFIX_PATH + '/');
        } else if (response.data.success) {
          fetchQuizData();
          setShowDeleteModal(false);
        } else {
          console.error('Error deleting quiz:', response.data.message);
        }
      })
      .catch((error) => {
        console.error('Error deleting quiz:', error);
      });
  };

  const breadcrumbItems = [
    { label: "Dashboard", path: `/${APP_PREFIX_PATH}/dashboard` },
    { label: "Manage Quiz", path: `/${APP_PREFIX_PATH}/quiz` },
  ];

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
    <div className="container mt-5">
      <Breadcrumbs title="Manage Quiz" items={breadcrumbItems} />

      <div className="mc-card">
        <div className="row mb-4 mt-2 flex-wrap">
          <div className="col-lg-3">
            <form className="header-search">
              <IoSearch className="ms-3" />
              <input
                type="text"
                placeholder="Search Here..."
                value={searchQuery}
                onChange={handleSearch}
              />
            </form>
          </div>
          <div className="col-lg-9" style={{ textAlign: 'right' }}>
            <div>
              <Link to={`/${APP_PREFIX_PATH}/add-quiz`} className='send-btn btn-primary'>
                <IoMdAdd style={{ fontSize: '20px', marginRight: '3px' }} />
                Add Quiz
              </Link>
            </div>
          </div>
        </div>

        <div className="mc-table-responsive">
          <table className="table">
            <thead className='table-head'>
              <tr>
                <th>S No.</th>
                <th>Action</th>
                <th>Class</th>
                <th>Subject Name</th>
                <th>Create Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? currentUsers.map((item, index) => (
                <tr key={item.quiz_id}>
                  <td>{index + 1}</td>
                  <td>
                    {/* <div className="dropdown custom-dropup">
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
                        style={{ display: selectedIndex === index ? 'block' : 'none' }}
                      >
                        <li>
                          <Link
                            className="dropdown-item"
                            to={`/${APP_PREFIX_PATH}/view-quiz/${base64_encode(item.quiz_id)}`}
                          >
                            <BsEyeFill className='me-2' /> view
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item"
                            to={`/${APP_PREFIX_PATH}/edit-quiz/${base64_encode(item.quiz_id)}`}
                          >
                            <MdModeEdit className='me-2' /> Edit
                          </Link>
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => handleDelete(item.quiz_id)}
                          >
                            <MdDelete className='me-2' />Delete
                          </button>
                        </li>

                      </ul>
                    </div> */}
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
                       <li>
                          <Link
                            className="dropdown-item"
                            to={`/${APP_PREFIX_PATH}/view-quiz/${base64_encode(item.quiz_id)}`}
                          >
                            <BsEyeFill className='me-2' /> view
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item"
                            to={`/${APP_PREFIX_PATH}/view-result/${base64_encode(item.quiz_id)}`}
                          >
                            <BsEyeFill className='me-2' /> View Result
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item"
                            to={`/${APP_PREFIX_PATH}/edit-quiz/${base64_encode(item.quiz_id)}`}
                          >
                            <MdModeEdit className='me-2' /> Edit
                          </Link>
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => handleDelete(item.quiz_id)}
                          >
                            <MdDelete className='me-2' />Delete
                          </button>
                        </li>
                      </ul>
                    </div>
                  </td>
                  <td>{item.class_name}</td>
                  <td>{item.subject_name || "NA"}</td>
                  <td>{item.createtime}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="9">No Data Found</td>
                </tr>
              )}
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

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton style={{ width: '100%' }}>
          <Modal.Title style={{ fontSize: '17px' }}>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <div className="mb-3">
              <i className="fas fa-exclamation-triangle text-warning" style={{ fontSize: '3rem' }}></i>
            </div>
            <h6>Are you sure you want to delete this quiz question?</h6>
            <p className="text-muted mb-0">This action cannot be undone.</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-danger px-4"
            onClick={confirmDelete}
          >
            <MdDelete className="me-2" />
            Delete Question
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageQuiz;