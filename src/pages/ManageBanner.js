import React, { useEffect, useState, useRef } from 'react';

import { API_URL, APP_PREFIX_PATH, IMAGE_PATH } from "../config/AppConfig";
import Breadcrumbs from "../components/Breadcrumbs";
import { HiChevronLeft } from "react-icons/hi";
import { HiChevronRight } from "react-icons/hi";
import { IoMdAdd } from "react-icons/io";
import { Modal, Form } from 'react-bootstrap';
import table from "../assets/images/table.jpg";
import '../assets/css/variables.scss';
// import SearchBar from '../components/SearchBar';
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import axios from 'axios';
import { IoSearch } from "react-icons/io5";

const ManageBanner = () => {

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [banner_data, setBannerData] = useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [addImage, setAddImage] = useState('');
  const [addImageError, setAddImageError] = useState('');
  const [deleteId, setDeleteId] = useState('');
  const [deleteModel, setDeleteModel] = useState(false);
  const [editImage, setEditImage] = useState('');
  const [editImageError, setEditImageError]= useState('');
  var token = sessionStorage.getItem("token");

  const handleClick = (index) => {
    setSelectedIndex(index === selectedIndex ? null : index);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedIndex(null);
  };
  const usersPerPage = 8;

  var fetchBannerData = async () => {
    axios
      .get(`${API_URL}/get_banner`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        setBannerData(response.data.banner_arr || []);
      })
      .catch((error) => {
        console.log('Error Banner : ', error);
      });
  };

  useEffect(() => {
    fetchBannerData()
  }, [])

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleEditModal = (user) => {
    setShowEditModal(true);
    setSelectedIndex(null);
    setEditImage(user.image);  
    setDeleteId(user.banner_id);
  };

  const handleEditCloseModal = () => { setShowEditModal(false); setAddImageError(''); setAddImage('') };

  const filteredBanner = banner_data.filter((user) => {
    const lowercasedTerm = searchQuery.toLowerCase();
    const dateMatch = user.createtime ? String(user.createtime).toLowerCase().includes(lowercasedTerm) : false;
    return dateMatch;
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentBanner = filteredBanner.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredBanner.length / usersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log(file);

    if (file) {
      const fileType = file.type;
      if (fileType.startsWith('image/')) {
        setAddImage(file);
        setAddImageError('');
      } else {
        setAddImageError('Please upload valid image format');
        e.target.value = null;
      }
    }
  };

  const handleFileEditChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type;
      if (fileType.startsWith('image/')) {
        setEditImage(file);
        setEditImageError('');
      } else {
        setEditImageError('Please upload a valid image format');
        e.target.value = null;
      }
    }
  };
  

  const breadcrumbItems = [
    { label: "Dashboard", path: `/${APP_PREFIX_PATH}/dashboard` },
    { label: "Manage Banner", path: `/${APP_PREFIX_PATH}/manage-banner` },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;
    if (!addImage) {
      setAddImageError("Please Select Banner Image");
      hasError = true;
    } else {
      setAddImageError('')
    }
    if (hasError) return;

    const data = new FormData();
    data.append('image', addImage);
    const res = await axios.post(`${API_URL}/add_banner`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (res.data.success) {
      setShowModal(false);
      setAddImage('')
      setAddImageError('');
      fetchBannerData();
    } else {
      setAddImageError('Error Adding Banner');
    }
  }

  const DeleteModel = async (banner_id) => {
    setSelectedIndex(null); 
    setDeleteId(banner_id);
    setDeleteModel(true);
  };
  

  const deleteBanner = () => {
    axios
      .post(`${API_URL}/delete_banner`, { banner_id: deleteId }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        if (response.data.success) {
          fetchBannerData();
          setDeleteModel(false);
        } else {
          console.error('Error deleting Banner:', response.data.message);
        }
      })
      .catch((error) => {
        console.error('Error deleting prodcut:', error);
      });
  };

  // const handleEditBanner = async (e) => {
  //   e.preventDefault();
  //   let hasError = false;
  //   if (!editImage) {
  //     setEditImageError("Please Select Banner Image");
  //     hasError = true;
  //   } else {
  //     setEditImageError('')
  //   }
  //   if (hasError) return;

  //   const data = new FormData();
  //   data.append('image', editImage);
  //   data.append("banner_id",deleteId)
  //   const res = await axios.post(`${API_URL}/edit_banner`, data, {
  //     headers: {
  //       'Content-Type': 'multipart/form-data',
  //     },
  //   });
  //   if (res.data.success) {
  //     setShowEditModal(false);
  //     setAddImage('')
  //     setAddImageError('');
  //     fetchBannerData();
  //   } else {
  //     setAddImageError('Error Editing Banner');
  //   }
  // }

  const handleEditBanner = async (e) => {
    e.preventDefault();
  
    if (!editImage) {
      setEditImageError("Please Select Banner Image");
      return;
    }
  
    const data = new FormData();
    data.append('image', editImage);
    data.append('banner_id', deleteId);  // Ensure banner_id is correctly appended
  
    try {
      const res = await axios.post(`${API_URL}/edit_banner`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (res.data.success) {
        setShowEditModal(false);
        setEditImage('');
        setEditImageError('');
        fetchBannerData();  // Refresh the banners after edit
      } else {
        setEditImageError('Error Editing Banner');
      }
    } catch (error) {
      console.error("Error Editing Banner:", error);
      setEditImageError('Error Editing Banner');
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
    <div className="container mt-5">
      <Breadcrumbs title=" Manage Banner" items={breadcrumbItems} />
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
              <button className='send-btn btn-primary' onClick={handleShowModal}><IoMdAdd style={{ fontSize: '20px', marginRight: '3px' }} />Add Banner</button>
            </div>
          </div>
        </div>

        <div className="mc-table-responsive">
          <table className="table">
            <thead className='table-head'>
              <tr>
                <th>S No.</th>
                <th>Action</th>
                <th>Banner Image</th>
                <th>Create Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {currentBanner.length > 0 ? <>{currentBanner.map((user, index) => (
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
                        <li><a className="dropdown-item"  onClick={(e) => {handleEditModal(user)}}>
                          <MdModeEdit className='mr-2' /> Edit</a></li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => DeleteModel(user.banner_id)}
                          >
                            <MdDelete className='mr-2' /> Delete
                          </button>
                        </li>
                      </ul>
                    </div>
                  </td>
                  <td><img alt="user image" src={user.image && user.image != null ? `${IMAGE_PATH}${user.image}` : `${IMAGE_PATH}placeholderVillage.png`} style={{ width: '70px', height: '70px', borderRadius: '50%' }} /></td>
                  <td>{user.createtime}</td>
                </tr>
              ))}</> : <>
                <tr>
                  <td colSpan="4">
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
          <Modal.Title style={{ fontSize: '17px' }}>Add Banner</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ width: '100%' }}>
          <form>
            <div className="mb-3">
              <label htmlFor="categoryDescription" className="form-label">
                Banner Image
              </label>
              <Form.Control type="file" onChange={handleFileChange} />
              {addImageError && <span className="text-danger">{addImageError}</span>}

            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          {/* <button variant="secondary" className='btn  btn-secondary' onClick={handleCloseModal}>
            Close
          </button> */}
          <button variant="primary" className=' btn-primary ' onClick={handleSubmit}>
            Add Banner
          </button>
        </Modal.Footer>
      </Modal>
      {/* edit modal start here */}

      <Modal show={showEditModal} onHide={handleEditCloseModal} style={{ zIndex: '99999', width: '100%' }}>
        <Modal.Header closeButton style={{ width: '100%' }}>
          <Modal.Title style={{ fontSize: '17px' }}>Edit Banner</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ width: '100%' }}>
          <form>
            <div className="mb-3">
              <label value={addImage} htmlFor="categoryDescription" className="form-label" >
                Image
              </label>
              {editImageError && <span className="text-danger">{editImageError}</span>}

              <Form.Control type="file" onChange={handleFileEditChange} />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          {/* <button variant="secondary" className='btn  btn-secondary' onClick={handleEditCloseModal}>
            Close
          </button> */}
          <button variant="primary" className=' btn-primary ' onClick={handleEditBanner}>
            Update Banner
          </button>
        </Modal.Footer>
      </Modal>
      {/* edit modal end*/}

      {/* Delete Banner start*/}
      <Modal show={deleteModel} onHide={() => setDeleteModel(false)} style={{ zIndex: '99999', width: '100%' }}>
        <Modal.Header closeButton style={{ width: '100%' }}>
          <Modal.Title style={{ fontSize: '17px' }}>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ width: '100%' }}>Are you sure you want to delete this Banner?</Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-danger"
            onClick={deleteBanner}
          >
            Delete Banner
          </button>
        </Modal.Footer>
      </Modal>
      {/* Delete Banner end*/}
    </div>
  );
};

export default ManageBanner;
