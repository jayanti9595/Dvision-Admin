/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-sequences */
import React, { useState, useRef, useEffect } from 'react';
import { API_URL, APP_PREFIX_PATH } from "../config/AppConfig";
import Breadcrumbs from "../components/Breadcrumbs";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { IoMdAdd } from "react-icons/io";
import { Modal } from 'react-bootstrap';
import '../assets/css/variables.scss';
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import axios from 'axios';
import { IoSearch } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import { encode as base64_encode } from 'base-64';

const ManageTimetable = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [timetable_data, setAllTimetableData] = React.useState([]);
  const [class_data, setAllClassData] = React.useState([]);
  const [subject_data, setAllSubjectData] = React.useState([]);
  const [teacher_data, setAllTeacherData] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAllDeleteModal, setAllShowDeleteModal] = useState(false);
  const [timetableToDelete, setTimetableDelete] = useState('');

  const [selectedClass, setSelectedClass] = React.useState('');
  const [selectedClassError, setSelectedClassError] = React.useState('');
  const [selectedSubject, setSelectedSubject] = React.useState('');
  const [selectedSubjectError, setSelectedSubjectError] = React.useState('');
  const [selectedTeacher, setSelectedTeacher] = React.useState('');
  const [selectedTeacherError, setSelectedTeacherError] = React.useState('');
  const [start_time, setStartTime] = useState('');
  const [startTimeError, setStartTimeError] = useState('');
  const [end_time, setEndTime] = useState('');
  const [endTimeError, setEndTimeError] = useState('');
  const [courseType, setCourseType] = React.useState('');
  const [courseTypeError, setCourseTypeError] = React.useState('');
  const [courseTypes, setCourseTypes] = React.useState([
    { id: 1, name: 'RBSE' },
    { id: 2, name: 'CBSE' }
  ]);

  var token = sessionStorage.getItem('token');
  var navigate = useNavigate();

  const handleAddTimetable = (e) => {
    e.preventDefault();

    let hasError = false;

    if (!start_time) {
      setStartTimeError('Please Enter Start Time');
      hasError = true;
    } else {
      setStartTimeError('');
    }

    if (!end_time) {
      setEndTimeError('Please Enter End Time');
      hasError = true;
    } else {
      setEndTimeError('');
    }

    if (!selectedClass) {
      setSelectedClassError('Please Select Class');
      hasError = true;
    } else {
      setSelectedClassError('');
    }

    if (!courseType) {
      setCourseTypeError('Please Select Course Type');
      hasError = true;
    } else {
      setCourseTypeError('');
    }

    if (!selectedSubject) {
      setSelectedSubjectError('Please Select Subject');
      hasError = true;
    } else {
      setSelectedSubjectError('');
    }

    if (!selectedTeacher) {
      setSelectedTeacherError('Please Select Teacher');
      hasError = true;
    } else {
      setSelectedTeacherError('');
    }

    if (hasError) {
      return;
    }

    const data = new FormData();
    data.append('start_time', start_time);
    data.append('end_time', end_time);
    data.append('class_id', selectedClass);
    data.append('type_id', courseType);
    data.append('subject_id', selectedSubject);
    data.append('teacher_id', selectedTeacher);

    axios
      .post(`${API_URL}/add_timetable`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        if (response.data.key === 'authenticateFailed') {
          sessionStorage.clear();
          navigate(APP_PREFIX_PATH + '/');
        }
        else if (response.data.key === 'timetableExists') {
          setStartTimeError('Time slot already exists for this class');
        } else {
          fetchData();
          setShowModal(false);
          setStartTime('');
          setEndTime('');
          setSelectedClass('');
          setCourseType('');
          setSelectedSubject('');
          setSelectedTeacher('');
          setSelectedClassError('');
          setCourseTypeError('');
          setSelectedSubjectError('');
          setSelectedTeacherError('');
        }
      })
      .catch((error) => {
        console.error('Error adding timetable:', error);
      });
  };

  const handleClick = (index) => {
    setSelectedIndex(index === selectedIndex ? null : index);
  };

  var fetchData = () => {
    axios
      .get(`${API_URL}/get_timetable`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        if (response.data.key === 'authenticateFailed') {
          sessionStorage.clear();
          navigate(APP_PREFIX_PATH + '/');
        } else {
          setAllTimetableData(response.data.timetable_arr || []);
        }
      })
      .catch((error) => {
        console.error('Error fetching timetable:', error);
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

  const fetchSubjectDataByClassAndType = async (classId, typeId) => {
    if (!classId || !typeId) {
      setAllSubjectData([]);
      setSelectedSubject('');
      return;
    }
    try {
      const response = await axios.get(`${API_URL}/get_subjects_by_type_and_class?type_id=${typeId}&class_id=${classId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllSubjectData(response.data.subject_arr || []);
    } catch (error) {
      setAllSubjectData([]);
      setSelectedSubject('');
      console.error('Error fetching subjects:', error);
    }
  };

  var fetchTeacherData = () => {
    axios
      .get(`${API_URL}/get_teacher`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        if (response.data.key === 'authenticateFailed') {
          sessionStorage.clear();
          navigate(APP_PREFIX_PATH + '/');
        } else {
          setAllTeacherData(response.data.teacher_arr || []);
        }
      })
      .catch((error) => {
        console.error('Error fetching teachers:', error);
      });
  };

  const handleEdit = (e) => {
    e.preventDefault();

    let hasError = false;

    if (!start_time) {
      setStartTimeError('Please Enter Start Time');
      hasError = true;
    } else {
      setStartTimeError('');
    }

    if (!end_time) {
      setEndTimeError('Please Enter End Time');
      hasError = true;
    } else {
      setEndTimeError('');
    }

    if (!selectedClass) {
      setSelectedClassError('Please Select Class');
      hasError = true;
    } else {
      setSelectedClassError('');
    }

    if (!courseType) {
      setCourseTypeError('Please Select Course Type');
      hasError = true;
    } else {
      setCourseTypeError('');
    }

    if (!selectedSubject) {
      setSelectedSubjectError('Please Select Subject');
      hasError = true;
    } else {
      setSelectedSubjectError('');
    }

    if (!selectedTeacher) {
      setSelectedTeacherError('Please Select Teacher');
      hasError = true;
    } else {
      setSelectedTeacherError('');
    }

    if (hasError) {
      return;
    }

    const data = new FormData();
    data.append('timetable_id', timetableToDelete);
    data.append('start_time', start_time);
    data.append('end_time', end_time);
    data.append('class_id', selectedClass);
    data.append('type_id', courseType);
    data.append('subject_id', selectedSubject);
    data.append('teacher_id', selectedTeacher);

    axios
      .post(`${API_URL}/edit_timetable`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        if (response.data.key === 'authenticateFailed') {
          sessionStorage.clear();
          navigate(APP_PREFIX_PATH + '/');
        }
        else if (response.data.key === 'timetableExists') {
          setStartTimeError('Time slot already exists for this class');
        } else if (response.data.success) {
          fetchData();
          setShowEditModal(false);
          setStartTime('');
          setEndTime('');
          setSelectedClass('');
          setCourseType('');
          setSelectedSubject('');
          setSelectedTeacher('');
          setSelectedClassError('');
          setCourseTypeError('');
          setSelectedSubjectError('');
          setSelectedTeacherError('');
        } else {
          console.log('Timetable Updated Unsuccessfully');
        }
      })
      .catch((error) => {
        console.error('Error updating timetable:', error);
      });
  };

  React.useEffect(() => {
    fetchData();
    fetchClassData();
    fetchTeacherData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const usersPerPage = 8;

  const handleAction = async (action, data) => {
    if (action === 'Edit') {
      console.log("data : ", data);

      setShowEditModal(true);
      setSelectedIndex(null);
      setSelectedClass(data.class_id);
      setCourseType(data.course_type);
      setSelectedSubject(data.subject_id);
      setSelectedTeacher(data.teacher_id);
      setStartTime(data.start_time);
      setEndTime(data.end_time);
      setTimetableDelete(data.time_table_id);
      await fetchSubjectDataByClassAndType(data.class_id, data.course_type);
    } else if (action === 'Delete') {
      setSelectedIndex(null);
      setShowDeleteModal(true);
      setTimetableDelete(data.time_table_id);
    }
    else if (action === 'DeleteAllTimetable') {
      setSelectedIndex(null);
      setAllShowDeleteModal(true);
    }
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setStartTime('');
    setEndTime('');
    setSelectedClass('');
    setCourseType('');
    setSelectedSubject('');
    setSelectedTeacher('');
    setSelectedClassError('');
    setCourseTypeError('');
    setSelectedSubjectError('');
    setSelectedTeacherError('');
  };

  const handleEditModal = (item) => {
    setSelectedIndex(null);
    setShowEditModal(true);
    setSelectedClass(item.class_id);
    setCourseType(item.course_type);
    setSelectedSubject(item.subject_id);
    setSelectedTeacher(item.teacher_id);
    setStartTime(item.start_time);
    setEndTime(item.end_time);
    setTimetableDelete(item.time_table_id);
    fetchSubjectDataByClassAndType(item.class_id, item.course_type);
  };

  const handleEditCloseModal = () => {
    setShowEditModal(false);
    setSelectedClass('');
    setCourseType('');
    setSelectedSubject('');
    setSelectedTeacher('');
    setStartTime("");
    setEndTime("");
    setStartTimeError("");
    setEndTimeError("");
    setSelectedClassError('');
    setCourseTypeError('');
    setSelectedSubjectError('');
    setSelectedTeacherError('');
  };

  const breadcrumbItems = [
    { label: "Manage Timetable", path: `/${APP_PREFIX_PATH}/dashboard` },
    { label: "Timetable", path: `/${APP_PREFIX_PATH}/manage-timetable` },
  ];

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredTimetable = timetable_data.filter((item) => {
    const lowercasedTerm = searchQuery.toLowerCase();
    const classNameMatch = item.class_name ? String(item.class_name).toLowerCase().includes(lowercasedTerm) : false;
    const subjectNameMatch = item.subject_name ? String(item.subject_name).toLowerCase().includes(lowercasedTerm) : false;
    const teacherNameMatch = item.teacher_name ? String(item.teacher_name).toLowerCase().includes(lowercasedTerm) : false;
    const startTimeMatch = item.start_time_formate ? String(item.start_time_formate).toLowerCase().includes(lowercasedTerm) : false;
    const endTimeMatch = item.end_time ? String(item.end_time).toLowerCase().includes(lowercasedTerm) : false;
    return classNameMatch || subjectNameMatch || teacherNameMatch || startTimeMatch || endTimeMatch;
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredTimetable.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredTimetable.length / usersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const deleteTimetable = () => {
    axios
      .post(`${API_URL}/delete_timetable`, { timetable_id: timetableToDelete }, {
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
          setTimetableDelete('');
        } else {
          console.error('Error deleting timetable:', response.data.message);
        }
      })
      .catch((error) => {
        console.error('Error deleting timetable:', error);
      });
  };
  const deleteAllTimetable = () => {
    axios.post(`${API_URL}/delete_all_timetable`, {}, {
      headers: {
        Authorization: `Bearer ${token}` 
      }
    })
    .then(response => {
      console.log('Delete Response:', response.data);
      setAllShowDeleteModal(false);
      fetchData();
    })
    .catch(error => {
      console.error('Error:', error);
    });
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
    <div className="container mt-5">
      <Breadcrumbs title="Manage Time Table" items={breadcrumbItems} />
      <div className="mc-card">
        <div className="row mb-4 mt-2 flex-wrap">
          <div className="col-lg-3">
            <form className="header-search">
              <IoSearch className="ms-3" />
              <input type="text" placeholder="Search Here..." onChange={handleSearch} />
            </form>
          </div>
          <div className="col-lg-9" style={{ textAlign: 'right', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button className='send-btn btn-primary' onClick={handleShowModal}>
              <IoMdAdd style={{ fontSize: '20px', marginRight: '3px' }} />
              Add Timetable
            </button>

            <button className='send-btn btn-primary' onClick={(e) =>{ handleAction('DeleteAllTimetable')}}>
              <IoMdAdd style={{ fontSize: '20px', marginRight: '3px' }} />
              Delete All Timetable
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
                {/* <th>Course Type</th> */}
                <th>Subject</th>
                <th>Teacher</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Today Live Join user Count</th>
                <th>Create Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? <> {currentUsers.map((item, index) => (
                <tr key={item.s_no}>
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
                        <li>
                          <Link className="dropdown-item" to={`/${APP_PREFIX_PATH}/view-timetable/${item.channel_name}`}>
                            <FaEye className='me-2' /> View Join User
                          </Link>
                        </li>
                        <li><a className="dropdown-item" href="#" onClick={() => { handleEditModal(item) }}><MdModeEdit className='me-2' /> Edit</a></li>
                        <li><button className="dropdown-item" onClick={(e) => { handleAction("Delete", item) }}>  <MdDelete className='me-2' />Delete</button></li>
                      </ul>
                    </div>
                  </td>
                  <td>{item.class_name}</td>
                  {/* <td>{item.type_name}</td> */}
                  <td>{item.subject_name}</td>
                  <td>{item.teacher_name}</td>
                  <td>{item.start_time_formate}</td>
                  <td>{item.end_time_formate}</td>
                  <td>{item.total_count}</td>
                  <td>{item.createtime}</td>
                </tr>
              ))}</> : <>
                <tr>
                  <td colSpan="9">
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
          <Modal.Title style={{ fontSize: '17px' }}>Add Timetable</Modal.Title>
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
                onChange={async (e) => {
                  setSelectedClass(e.target.value);
                  setSelectedClassError('');
                  setSelectedSubject('');
                  setAllSubjectData([]);
                  if (courseType && e.target.value) {
                    await fetchSubjectDataByClassAndType(e.target.value, courseType);
                  }
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
                value={courseType}
                onChange={async (e) => {
                  setCourseType(e.target.value);
                  setCourseTypeError('');
                  setSelectedSubject('');
                  setAllSubjectData([]);
                  if (selectedClass && e.target.value) {
                    await fetchSubjectDataByClassAndType(selectedClass, e.target.value);
                  }
                }}
                className="form-control"
              >
                <option value="" disabled>
                  Select Course Type
                </option>
                {courseTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              {courseTypeError && <p style={{ color: 'red' }}>{courseTypeError}</p>}
            </div>
            <div className="mb-3">
              <label htmlFor="subjectName" className="form-label">
                Select Subject
              </label>
              <select
                id="subjectName"
                value={selectedSubject}
                onChange={(e) => {
                  setSelectedSubject(e.target.value);
                  setSelectedSubjectError('');
                }}
                className="form-control"
                disabled={!selectedClass || !courseType || subject_data.length === 0}
              >
                <option value="" disabled>
                  Select Subject
                </option>
                {subject_data.map((result) => (
                  <option key={result.subject_id} value={result.subject_id}>
                    {result.subject_name}
                  </option>
                ))}
              </select>
              {selectedSubjectError && <p style={{ color: 'red' }}>{selectedSubjectError}</p>}
            </div>
            <div className="mb-3">
              <label htmlFor="teacherName" className="form-label">
                Select Teacher
              </label>
              <select
                id="teacherName"
                value={selectedTeacher}
                onChange={(e) => {
                  setSelectedTeacher(e.target.value);
                  setSelectedTeacherError('');
                }}
                className="form-control"
              >
                <option value="" disabled>
                  Select Teacher
                </option>
                {teacher_data.map((result) => (
                  <option key={result.user_id} value={result.user_id}>
                    {result.name}
                  </option>
                ))}
              </select>
              {selectedTeacherError && <p style={{ color: 'red' }}>{selectedTeacherError}</p>}
            </div>
            <div className="mb-3">
              <label htmlFor="startTime" className="form-label">
                Start Time
              </label>
              <input
                type="time"
                className="form-control"
                id="startTime"
                value={start_time}
                onChange={(e) => {
                  setStartTime(e.target.value);
                  setStartTimeError('');
                }}
              />
              {startTimeError && <p style={{ color: 'red' }}>{startTimeError}</p>}
            </div>
            <div className="mb-3">
              <label htmlFor="endTime" className="form-label">
                End Time
              </label>
              <input
                type="time"
                className="form-control"
                id="endTime"
                value={end_time}
                onChange={(e) => {
                  setEndTime(e.target.value);
                  setEndTimeError('');
                }}
              />
              {endTimeError && <p style={{ color: 'red' }}>{endTimeError}</p>}
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button variant="primary" className='btn btn-danger ' onClick={handleAddTimetable}>
            Add Timetable
          </button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={handleEditCloseModal} style={{ zIndex: '99999', width: '100%' }}>
        <Modal.Header closeButton style={{ width: '100%' }}>
          <Modal.Title style={{ fontSize: '17px' }}>Edit Timetable</Modal.Title>
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
                onChange={async (e) => {
                  setSelectedClass(e.target.value);
                  setSelectedClassError('');
                  setSelectedSubject('');
                  setAllSubjectData([]);
                  if (courseType && e.target.value) {
                    await fetchSubjectDataByClassAndType(e.target.value, courseType);
                  }
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
                value={courseType}
                onChange={async (e) => {
                  setCourseType(e.target.value);
                  setCourseTypeError('');
                  setSelectedSubject('');
                  setAllSubjectData([]);
                  if (selectedClass && e.target.value) {
                    await fetchSubjectDataByClassAndType(selectedClass, e.target.value);
                  }
                }}
                className="form-control"
              >
                <option value="" disabled>
                  Select Course Type
                </option>
                {courseTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              {courseTypeError && <p style={{ color: 'red' }}>{courseTypeError}</p>}
            </div>
            <div className="mb-3">
              <label htmlFor="subjectName" className="form-label">
                Select Subject
              </label>
              <select
                id="subjectName"
                value={selectedSubject}
                onChange={(e) => {
                  setSelectedSubject(e.target.value);
                  setSelectedSubjectError('');
                }}
                className="form-control"
                disabled={!selectedClass || !courseType || subject_data.length === 0}
              >
                <option value="" disabled>
                  Select Subject
                </option>
                {subject_data.map((result) => (
                  <option key={result.subject_id} value={result.subject_id}>
                    {result.subject_name}
                  </option>
                ))}
              </select>
              {selectedSubjectError && <p style={{ color: 'red' }}>{selectedSubjectError}</p>}
            </div>
            <div className="mb-3">
              <label htmlFor="teacherName" className="form-label">
                Select Teacher
              </label>
              <select
                id="teacherName"
                value={selectedTeacher}
                onChange={(e) => {
                  setSelectedTeacher(e.target.value);
                  setSelectedTeacherError('');
                }}
                className="form-control"
              >
                <option value="" disabled>
                  Select Teacher
                </option>
                {teacher_data.map((result) => (
                  <option key={result.user_id} value={result.user_id}>
                    {result.name}
                  </option>
                ))}
              </select>
              {selectedTeacherError && <p style={{ color: 'red' }}>{selectedTeacherError}</p>}
            </div>
            <div className="mb-3">
              <label htmlFor="startTime" className="form-label">
                Start Time
              </label>
              <input
                type="time"
                className="form-control"
                id="startTime"
                value={start_time}
                onChange={(e) => {
                  setStartTime(e.target.value);
                  setStartTimeError('');
                }}
              />
              {startTimeError && <p style={{ color: 'red' }}>{startTimeError}</p>}
            </div>
            <div className="mb-3">
              <label htmlFor="endTime" className="form-label">
                End Time
              </label>
              <input
                type="time"
                className="form-control"
                id="endTime"
                value={end_time}
                onChange={(e) => {
                  setEndTime(e.target.value);
                  setEndTimeError('');
                }}
              />
              {endTimeError && <p style={{ color: 'red' }}>{endTimeError}</p>}
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button variant="primary" className='btn btn-danger' onClick={handleEdit}>
            Update Timetable
          </button>
        </Modal.Footer>
      </Modal>

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
            <h6>Are you sure you want to delete this timetable entry?</h6>
            <p className="text-muted mb-0">This action cannot be undone.</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-danger px-4"
            onClick={deleteTimetable}
          >
            <MdDelete className="me-2" />
            Delete Timetable
          </button>
        </Modal.Footer>
      </Modal>

      <Modal show={showAllDeleteModal} onHide={() => setAllShowDeleteModal(false)} centered>
        <Modal.Header closeButton style={{ width: '100%' }}>
          <Modal.Title style={{ fontSize: '17px' }}>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <div className="mb-3">
              <i className="fas fa-exclamation-triangle text-warning" style={{ fontSize: '3rem' }}></i>
            </div>
            <h6>Are you sure you want to delete All Timetables?</h6>
            <p className="text-muted mb-0">This action cannot be undone.</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-danger px-4"
            onClick={deleteAllTimetable}
          >
            <MdDelete className="me-2" />
            Delete All Timetable
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageTimetable;