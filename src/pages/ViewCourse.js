import React, { useEffect, useState, useRef } from 'react';
import '../assets/css/users.scss';
import { API_URL, APP_PREFIX_PATH, IMAGE_PATH } from "../config/AppConfig";
import Breadcrumbs from "../components/Breadcrumbs";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { decode as base64_decode } from "base-64";
import { HiChevronRight, HiChevronLeft } from "react-icons/hi";
import { IoSearch } from "react-icons/io5";
import { MdDelete, MdEdit } from "react-icons/md";
import './rating.css'
import { Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';

const ViewCourse = () => {
    const [course_details, setCourseDetails] = useState({});
    const [PDF_Data, setPDFData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [editPDFId, setEditPDFId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editFile, setEditFile] = useState(null);
    const [editTitleError, setEditTitleError] = useState('');
    const [editError, setEditError] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [pdfToDelete, setPdfToDelete] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [addTitle, setAddTitle] = useState('');
    const [addFile, setAddFile] = useState(null);
    const [addTitleError, setAddTitleError] = useState('');
    const [addError, setAddError] = useState('');

    // Dropdown management
    const dropdownRefs = useRef([]);
    const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

    // Handle clicks outside dropdowns
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (openDropdownIndex !== null) {
                const ref = dropdownRefs.current[openDropdownIndex];
                if (ref && !ref.contains(event.target)) {
                    setOpenDropdownIndex(null);
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openDropdownIndex]);

    // Close dropdown when page changes
    useEffect(() => {
        setOpenDropdownIndex(null);
    }, [currentPage]);

    const { course_id } = useParams();
    const breadcrumbItems = [
        { label: "Dashboard", path: `/${APP_PREFIX_PATH}/dashboard` },
        { label: "View Course Detail", path: `/${APP_PREFIX_PATH}/view-course/${course_id}` },
    ];

    const usersPerPage = 8;
    const filteredOrder = PDF_Data.filter((user) => {
        const lowercasedTerm = searchQuery.toLowerCase();
        const titleMatch = user.title?.toLowerCase().includes(lowercasedTerm);
        const dateMatch = user.createtime ? String(user.createtime).toLowerCase().includes(lowercasedTerm) : false;
        return titleMatch || dateMatch;
    });

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredOrder.slice(indexOfFirstUser, indexOfLastUser);

    const totalPages = Math.ceil(filteredOrder.length / usersPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const token = sessionStorage.getItem('token');

    const fetchCourseDetails = () => {
        const decode_course_id = base64_decode(course_id);
        axios.get(API_URL + `/get_course_detail?course_id=${decode_course_id}`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then((res) => {
            setCourseDetails(res.data.course_arr || {})
        }).catch((error) => {
            console.log("error : ", error);
        })
    }

    const fetchCoursePDFDetails = () => {
        const decode_course_id = base64_decode(course_id);
        axios.get(API_URL + `/get_pdf?course_id=${decode_course_id}`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then((res) => {
            setPDFData(res.data.pdf_arr || [])
        }).catch((error) => {
            console.log("error : ", error);
        })
    }

    const handleDeletePDF = async (pdfId) => {
        try {
            const formData = new FormData();
            formData.append('course_pdf_id', pdfId);
            const res = await axios.post(`${API_URL}/delete_pdf`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.data.success) {
                setPDFData(PDF_Data.filter(pdf => pdf.course_pdf_id !== pdfId));
                Swal.fire({
                    icon: 'success',
                    title: 'PDF deleted successfully',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
            } else {
                Swal.fire('Error', res.data.msg || 'Failed to delete PDF', 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'Error deleting PDF', 'error');
        }
    };

    const openEditModal = (pdf) => {
        setEditPDFId(pdf.course_pdf_id);
        setEditTitle(pdf.title || '');
        setEditFile(null);
        setEditTitleError('');
        setEditError('');
        setShowEditModal(true);
        setOpenDropdownIndex(null);
    };

    const handleEditPDF = async (e) => {
        e.preventDefault();
        let isValid = true;

        if (!editTitle.trim()) {
            setEditTitleError('Title is required');
            isValid = false;
        }

        if (editFile && editFile.type !== 'application/pdf') {
            setEditTitleError('Only PDF files are allowed');
            isValid = false;
        }

        if (!isValid) return;

        const formData = new FormData();
        formData.append('course_pdf_id', editPDFId);
        formData.append('title', editTitle);
        if (editFile) formData.append('pdf', editFile);

        try {
            const res = await axios.post(`${API_URL}/edit_pdf`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.data.success) {
                setPDFData(PDF_Data.map(pdf =>
                    pdf.course_pdf_id === editPDFId
                        ? { ...pdf, title: editTitle, pdf: editFile ? editFile.name : pdf.pdf }
                        : pdf
                ));
                setShowEditModal(false)
                Swal.fire({
                    icon: 'success',
                    title: 'PDF updated successfully',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false
                }).then(() => {
                    setShowEditModal(false);
                });
            } else {
                setEditError(res.data.msg || 'Failed to update PDF');
            }
        } catch (error) {
            setEditError('Error updating PDF');
        }
    };

    const openDeleteModal = (pdfId) => {
        setPdfToDelete(pdfId);
        setShowDeleteModal(true);
        setOpenDropdownIndex(null);
    };

    const confirmDeletePDF = async () => {
        await handleDeletePDF(pdfToDelete);
        setShowDeleteModal(false);
        setPdfToDelete(null);
    };

    const openAddModal = () => {
        setAddTitle('');
        setAddFile(null);
        setAddTitleError('');
        setAddError('');
        setShowAddModal(true);
    };

    const handleAddPDF = async (e) => {
        e.preventDefault();
        let isValid = true;

        if (!addTitle.trim()) {
            setAddTitleError('Title is required');
            isValid = false;
        }

        if (!addFile) {
            setAddTitleError('PDF file is required');
            isValid = false;
        } else if (addFile.type !== 'application/pdf') {
            setAddTitleError('Only PDF files are allowed');
            isValid = false;
        }

        if (!isValid) return;

        const formData = new FormData();
        formData.append('course_id', base64_decode(course_id));
        formData.append('title', addTitle);
        formData.append('pdf', addFile);

        try {
            const res = await axios.post(`${API_URL}/add_pdf`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.data.success) {
                setPDFData([{
                    course_pdf_id: res.data.course_pdf_id,
                    title: addTitle,
                    pdf: addFile.name,
                    createtime: new Date().toLocaleString()
                }, ...PDF_Data]);
                setShowAddModal(false);
                fetchCoursePDFDetails()
                Swal.fire({
                    icon: 'success',
                    title: 'PDF added successfully',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false
                }).then(() => {
                    setShowAddModal(false);
                });
            } else {
                setAddError(res.data.msg || 'Failed to add PDF');
            }
        } catch (error) {
            setAddError('Error adding PDF');
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    useEffect(() => {
        fetchCourseDetails();
        fetchCoursePDFDetails();
    }, [course_id])

    return (
        <div className="container mt-5">
            <Breadcrumbs title="Manage Course Detail" items={breadcrumbItems} />
            <div className="mc-card">
                <h4>Course Detail</h4>
                <div className="row mt-4 mb-4">
                    <div className="col-lg-5">
                        <div className="mb-3">
                            {course_details.image ? (
                                <img
                                    src={`${IMAGE_PATH}${course_details.image}`}
                                    alt={course_details.title || 'Course Image'}
                                    className="img-fluid rounded" // Added rounded class for better aesthetics
                                    style={{ maxHeight: '150px', objectFit: 'cover' }}
                                />
                            ) : (
                                <p className='text-muted'>No image available</p>
                            )}
                        </div>
                    </div>
                    <div className="col-lg-7">
                        <div className="row">
                            <div className="col-lg-4">
                                <h6 className='mb-2'>Course Name:</h6>
                            </div>
                            <div className="col-lg-8">
                                <p className='mb-2'>{course_details.title || 'NA'}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-4">
                                <h6 className='mb-2'>Class Name:</h6>
                            </div>
                            <div className="col-lg-8">
                                <p className='mb-2'>{course_details.class_name || 'NA'}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-4">
                                <h6 className='mb-2'>Subject Name:</h6>
                            </div>
                            <div className="col-lg-8">
                                <p className='mb-2'>{course_details.subject_name || 'NA'}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-4">
                                <h6 className='mb-2'>Description:</h6>
                            </div>
                            <div className="col-lg-8">
                                <p className='mb-2'>{course_details.description || 'NA'}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-4">
                                <h6 className='mb-2'>Create Date & Time:</h6>
                            </div>
                            <div className="col-lg-8">
                                <p className='mb-2'>{course_details.createtime || 'NA'}</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div className="mc-card p-3">
                <div className="row align-items-center mb-3">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <form className="header-search">
                            <IoSearch className="ms-3" />
                            <input type="text" placeholder="Search Here..." onChange={handleSearch} />
                        </form>

                    </div>

                    <div className="col-lg-6 col-md-6 col-sm-12 text-end">
                        <button className="btn btn-danger" onClick={openAddModal}>
                            + Add PDF
                        </button>
                    </div>
                </div>
            </div>

            <div className="mc-table-responsive">
                <table className="table">
                    <thead className='table-head'>
                        <tr>
                            <th>S No.</th>
                            <th>Action</th>
                            <th>PDF</th>
                            <th>Title</th>
                            <th>Create Date & Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map((pdf, index) => (
                            <tr key={pdf.course_pdf_id}>
                                <td>{indexOfFirstUser + index + 1}.</td>
                                <td>
                                    <div
                                        className="dropdown custom-dropup"
                                        ref={el => dropdownRefs.current[index] = el}
                                    >
                                        <button
                                            className="btn-primary dropdown-toggle"
                                            type="button"
                                            onClick={() => setOpenDropdownIndex(openDropdownIndex === index ? null : index)}
                                        >
                                            Action
                                        </button>
                                        <ul
                                            className={`dropdown-menu ${openDropdownIndex === index ? 'show' : ''}`}
                                        >
                                            <li>
                                                <button
                                                    className="dropdown-item"
                                                    onClick={() => openEditModal(pdf)}
                                                >
                                                    <MdEdit className='me-2' />Edit
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    className="dropdown-item text-danger"
                                                    onClick={() => openDeleteModal(pdf.course_pdf_id)}
                                                >
                                                    <MdDelete className='me-2' />Delete
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </td>
                                <td>
                                    {pdf.pdf ? (
                                        <a
                                            href={`${IMAGE_PATH}${pdf.pdf}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-link p-0"
                                        >
                                            View PDF
                                        </a>
                                    ) : (
                                        'NA'
                                    )}
                                </td>
                                <td>{pdf.title || "NA"}</td>
                                <td>{pdf.createtime || "NA"}</td>
                            </tr>
                        ))}
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
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    <HiChevronRight style={{ fontSize: '20px' }} />
                </button>
            </div>

            {/* Edit PDF Modal */}
            <Modal
                show={showEditModal}
                onHide={() => setShowEditModal(false)}
                centered
                style={{ zIndex: '99999' }}
            >
                <Modal.Header closeButton style={{ width: '100%' }}>
                    <Modal.Title style={{ fontSize: '17px' }}>Edit PDF</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ width: '100%' }}>
                    <form onSubmit={handleEditPDF} encType="multipart/form-data">
                        <div className="mb-3">
                            <label className="form-label">
                                Title *
                            </label>
                            <input
                                className={`form-control ${editTitleError ? 'is-invalid' : ''}`}
                                value={editTitle}
                                onChange={e => {
                                    setEditTitle(e.target.value);
                                    setEditTitleError('');
                                }}
                                placeholder="Enter Title"
                            />
                            {editTitleError && <p style={{ color: 'red', marginTop: '5px', marginBottom: '0' }}>{editTitleError}</p>}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">
                                PDF File
                            </label>
                            <input
                                className="form-control"
                                type="file"
                                accept="application/pdf"
                                onChange={e => {
                                    setEditFile(e.target.files[0]);
                                    setEditTitleError('');
                                }}
                            />
                            <small className="text-muted">Leave blank to keep current file</small>
                        </div>

                        {editError && (
                            <div className="alert alert-danger mt-2" style={{ fontSize: '14px' }}>
                                {editError}
                            </div>
                        )}
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        className="btn btn-outline-secondary"
                        onClick={() => setShowEditModal(false)}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn btn-danger"
                        onClick={handleEditPDF}
                    >
                        Update PDF
                    </button>
                </Modal.Footer>
            </Modal>
            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton style={{ width: '100%' }}>
                    <Modal.Title style={{ fontSize: '17px' }}>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="text-center">
                        <div className="mb-3">
                            <i className="fas fa-exclamation-triangle text-warning" style={{ fontSize: '3rem' }}></i>
                        </div>
                        <h6>Are you sure you want to delete this PDF?</h6>
                        <p className="text-muted mb-0">This action cannot be undone.</p>
                    </div>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-end gap-2">
                    <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </button>
                    <button className="btn btn-danger" onClick={confirmDeletePDF}>
                        Delete
                    </button>
                </Modal.Footer>
            </Modal>

            {/* Add PDF Modal */}
            <Modal
                show={showAddModal}
                onHide={() => setShowAddModal(false)}
                centered
                style={{ zIndex: '99999' }}
            >
                <Modal.Header closeButton style={{ width: '100%' }}>
                    <Modal.Title style={{ fontSize: '17px' }}>Add PDF</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ width: '100%' }}>
                    <form onSubmit={handleAddPDF} encType="multipart/form-data">
                        {/* Title Field */}
                        <div className="mb-3">
                            <label className="form-label">Title *</label>
                            <input
                                type="text"
                                className={`form-control ${addTitleError ? 'is-invalid' : ''}`}
                                value={addTitle}
                                onChange={(e) => {
                                    setAddTitle(e.target.value);
                                    setAddTitleError('');
                                }}
                                placeholder="Enter Title"
                            />
                            {addTitleError && (
                                <p style={{ color: 'red', marginTop: '5px', marginBottom: '0' }}>{addTitleError}</p>
                            )}
                        </div>

                        {/* PDF File Field */}
                        <div className="mb-3">
                            <label className="form-label">PDF File *</label>
                            <input
                                type="file"
                                className={`form-control ${addTitleError && !addFile ? 'is-invalid' : ''}`}
                                accept="application/pdf"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    setAddFile(file);
                                    setAddTitleError('');
                                }}
                            />
                            <small className="text-muted">Only PDF files are allowed</small>
                            {addTitleError && addFile === null && (
                                <p style={{ color: 'red', marginTop: '5px', marginBottom: '0' }}>PDF file is required</p>
                            )}
                        </div>

                        {/* Error Message */}
                        {addError && (
                            <div className="alert alert-danger mt-2" style={{ fontSize: '14px' }}>
                                {addError}
                            </div>
                        )}
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        className="btn btn-outline-secondary"
                        onClick={() => setShowAddModal(false)}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn btn-danger"
                        onClick={handleAddPDF}
                    >
                        Add PDF
                    </button>
                </Modal.Footer>
            </Modal>


        </div>
    );
};

export default ViewCourse;