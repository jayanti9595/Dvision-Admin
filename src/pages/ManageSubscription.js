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
import axios from 'axios';
import { IoSearch } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const ManageSubscription = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [subscriptionData, setSubscriptionData] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [subscriptionToDelete, setSubscriptionToDelete] = useState('');

  const [subscriptionName, setSubscriptionName] = useState('');
  const [subscriptionNameError, setSubscriptionNameError] = useState('');
  const [subscriptionType, setSubscriptionType] = useState('');
  const [subscriptionTypeError, setSubscriptionTypeError] = useState('');
  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState('');
  const [noOfDays, setNoOfDays] = useState("");
  const [noOfDaysError, setNoOfDaysError] = useState("");

  var token = sessionStorage.getItem('token');
  var navigate = useNavigate();

  const handleAddSubscription = (e) => {
    e.preventDefault();

    let hasError = false;

    if (!subscriptionName) {
      setSubscriptionNameError('Please Enter Subscription Name');
      hasError = true;
    } else {
      setSubscriptionNameError('');
    }

    if (!subscriptionType) {
      setSubscriptionTypeError('Please Select Subscription Type');
      hasError = true;
    } else {
      setSubscriptionTypeError('');
    }

    if (!noOfDays || isNaN(noOfDays) || Number(noOfDays) <= 0) {
      setNoOfDaysError('Please enter a valid number of days');
      hasError = true;
    } else {
      setNoOfDaysError('');
    }

    if (!amount) {
      setAmountError('Please Enter Amount');
      hasError = true;
    } else {
      setAmountError('');
    }

    if (hasError) {
      return;
    }

    const data = new FormData();
    data.append('subscription_name', subscriptionName);
    data.append('subscription_type', subscriptionType);
    data.append('no_of_days', noOfDays);
    data.append('amount', amount);

    axios
      .post(`${API_URL}/add_subscription`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        if (response.data.key === 'authenticateFailed') {
          sessionStorage.clear();
          navigate(APP_PREFIX_PATH + '/');
        }
        else if (response.data.key === 'subscriptionExists') {
          setSubscriptionNameError('Subscription Already Exists');
        } else  if(response.data.success){
          fetchData();
          setShowModal(false);
          setSubscriptionName('');
          setSubscriptionNameError('');
          setSubscriptionType('');
          setSubscriptionTypeError('');
          setAmount('');
          setAmountError('');
          setNoOfDays('');
          setNoOfDaysError('');
        }
      })
      .catch((error) => {
        console.error('Error adding subscription:', error);
      });
  };

  const handleClick = (index) => {
    setSelectedIndex(index === selectedIndex ? null : index);
  };

  var fetchData = () => {
    axios
      .get(`${API_URL}/get_subscriptions`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        if (response.data.key === 'authenticateFailed') {
          sessionStorage.clear();
          navigate(APP_PREFIX_PATH + '/');
        } else {
          setSubscriptionData(response.data.subscription_arr || []);
        }
      })
      .catch((error) => {
        console.error('Error fetching subscriptions:', error);
      });
  };

  const handleEdit = (e) => {
    e.preventDefault();

    let hasError = false;

    if (!subscriptionName) {
      setSubscriptionNameError('Please Enter Subscription Name');
      hasError = true;
    } else {
      setSubscriptionNameError('');
    }

    if (subscriptionType < 0) {
      setSubscriptionTypeError('Please Select Subscription Type');
      hasError = true;
    } else {
      setSubscriptionTypeError('');
    }

    if (!noOfDays || isNaN(noOfDays) || Number(noOfDays) <= 0) {
      setNoOfDaysError('Please enter a valid number of days');
      hasError = true;
    } else {
      setNoOfDaysError('');
    }

    if (!amount) {
      setAmountError('Please Enter Amount');
      hasError = true;
    } else {
      setAmountError('');
    }

    if (hasError) {
      return;
    }

    const data = new FormData();
    data.append('subscription_id', subscriptionToDelete);
    data.append('subscription_name', subscriptionName);
    data.append('subscription_type', subscriptionType);
    data.append('no_of_days', noOfDays);
    data.append('amount', amount);

    axios
      .post(`${API_URL}/edit_subscription`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        if (response.data.key === 'authenticateFailed') {
          sessionStorage.clear();
          navigate(APP_PREFIX_PATH + '/');
        }
        else if (response.data.key === 'subscriptionExists') {
          setSubscriptionNameError('Subscription Already Exists');
        } else if (response.data.success) {
          fetchData();
          setShowEditModal(false);
          setSubscriptionName('');
          setSubscriptionNameError('');
          setSubscriptionType('');
          setSubscriptionTypeError('');
          setAmount('');
          setAmountError('');
          setNoOfDays('');
          setNoOfDaysError('');
        } else {
          console.log('Subscription Updated Unsuccessfully');
        }
      })
      .catch((error) => {
        console.error('Error updating subscription:', error);
      });
  };

  React.useEffect(() => {
    fetchData();
  }, []);

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

  const handleAction = (action, data) => {
    if (action === 'Edit') {
      setShowEditModal(true);
      setSelectedIndex(null);
      setSubscriptionType(data.subscription_type || 0);
      setSubscriptionName(data.subscription_name);
      setNoOfDays(data.no_of_days);
      setAmount(data.amount);
      setSubscriptionToDelete(data.subscription_id);
    } else if (action === 'Delete') {
      setSelectedIndex(null);
      setShowDeleteModal(true);
      setSubscriptionToDelete(data.subscription_id);
    }
  };

  const handleShowModal = () => {
    setShowModal(true);
    setNoOfDays("");
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setSubscriptionName('');
    setSubscriptionNameError('');
    setSubscriptionType('');
    setSubscriptionTypeError('');
    setNoOfDays("");
    setNoOfDaysError("");
    setAmount('');
    setAmountError('');
  };

  const handleEditModal = (subscription) => { 
    setSelectedIndex(null);
    setShowEditModal(true); 
    setSubscriptionType(subscription.subscription_type); 
    setSubscriptionName(subscription.subscription_name); 
    setNoOfDays(subscription.no_of_days);
    setAmount(subscription.amount);
    setSubscriptionToDelete(subscription.subscription_id); 
  };
  
  const handleEditCloseModal = () => { 
    setShowEditModal(false); 
    setSubscriptionName(""); 
    setSubscriptionNameError(""); 
    setSubscriptionType('');
    setSubscriptionTypeError('');
    setNoOfDays("");
    setNoOfDaysError("");
    setAmount('');
    setAmountError('');
  };

  const breadcrumbItems = [
    { label: "Manage Subscription", path: `/${APP_PREFIX_PATH}/dashboard` },
    { label: "Subscription", path: `/${APP_PREFIX_PATH}/manage-subscription` },
  ];

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredSubscriptions = subscriptionData.filter((subscription) => {
    const lowercasedTerm = searchQuery.toLowerCase();
    const subscriptionNameMatch = subscription.subscription_name ? 
      String(subscription.subscription_name).toLowerCase().includes(lowercasedTerm) : false;
    const subscriptionTypeMatch = subscription.subscription_type_label ? 
      String(subscription.subscription_type_label).toLowerCase().includes(lowercasedTerm) : false;
    const amountMatch = subscription.amount ? 
      String(subscription.amount).toLowerCase().includes(lowercasedTerm) : false;
    const dateMatch = subscription.createtime ? 
      String(subscription.createtime).toLowerCase().includes(lowercasedTerm) : false;
    return subscriptionNameMatch || subscriptionTypeMatch || amountMatch || dateMatch;
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredSubscriptions.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredSubscriptions.length / usersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const deleteSubscription = () => {
    axios
      .post(`${API_URL}/delete_subscription`, { subscription_id: subscriptionToDelete }, {
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
          setSubscriptionToDelete('');
        } else {
          console.error('Error deleting subscription:', response.data.message);
        }
      })
      .catch((error) => {
        console.error('Error deleting subscription:', error);
      });
  };

  return (
    <div className="container mt-5">
      <Breadcrumbs title="Manage Subscription" items={breadcrumbItems} />
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
              <button className='send-btn btn-primary' onClick={handleShowModal}>
                <IoMdAdd style={{ fontSize: '20px', marginRight: '3px' }} />Add Subscription
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
                <th>Subscription Name</th>
                <th>Subscription Type</th>
                <th>Price</th>
                <th>No. of Days</th>
                <th>Create Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? 
                currentUsers.map((subscription, index) => (
                  <tr key={subscription.subscription_id}>
                    <td>{indexOfFirstUser + index + 1}</td>
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
                            <a className="dropdown-item" href="#" onClick={() => { handleEditModal(subscription) }}>
                              <MdModeEdit className='me-2' /> Edit
                            </a>
                          </li>
                          <li>
                            <button className="dropdown-item" onClick={() => { handleAction("Delete", subscription) }}>
                              <MdDelete className='me-2' />Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td>
                    <td>{subscription.subscription_name}</td>
                    <td>{subscription.subscription_type_label}</td>
                    <td>₹ {subscription.amount}</td>
                    <td>{subscription.no_of_days}</td>
                    <td>{subscription.createtime}</td>
                  </tr>
                )) : 
                <tr>
                  <td colSpan="7" className="text-center">
                    No Data Found
                  </td>
                </tr>
              }
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

      {/* Add Subscription Modal */}
      <Modal show={showModal} onHide={handleCloseModal} style={{ zIndex: '99999', width: '100%' }}>
        <Modal.Header closeButton style={{ width: '100%' }}>
          <Modal.Title style={{ fontSize: '17px' }}>Add Subscription</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ width: '100%' }}>
          <form>
            <div className="mb-3">
              <label htmlFor="subscriptionName" className="form-label">
                Subscription Name
              </label>
              <input 
                type="text" 
                className="form-control" 
                id="subscriptionName" 
                placeholder="Enter Subscription Name" 
                value={subscriptionName}
                onChange={(e) => {
                  setSubscriptionName(e.target.value);
                  setSubscriptionNameError('');
                }} 
              />
              {subscriptionNameError && <p style={{ color: 'red' }}>{subscriptionNameError}</p>}
            </div>
            <div className="mb-3">
              <label htmlFor="subscriptionType" className="form-label">
                Subscription Type
              </label>
              <select
                id="subscriptionType"
                value={subscriptionType}
                onChange={(e) => {
                  setSubscriptionType(e.target.value);
                  setSubscriptionTypeError('');
                }}
                className="form-control"
              >
                <option value="" disabled>
                  Select Subscription Type
                </option>
                <option value="0">Monthly</option>
                <option value="1">Yearly</option>
                {/* <option value="3">Custom</option> */}
              </select>
              {subscriptionTypeError && <p style={{ color: 'red' }}>{subscriptionTypeError}</p>}
            </div>
            <div className="mb-3">
              <label htmlFor="noOfDays" className="form-label">
                No. of Days
              </label>
              <input
                type="number"
                className="form-control"
                id="noOfDays"
                placeholder="Enter Number of Days"
                value={noOfDays}
                onChange={e => {
                  setNoOfDays(e.target.value);
                  setNoOfDaysError("");
                }}
                min="1"
                required
              />
              {noOfDaysError && <p style={{ color: 'red' }}>{noOfDaysError}</p>}
            </div>
            <div className="mb-3">
              <label htmlFor="amount" className="form-label">
                Amount
              </label>
              <input 
                type="number" 
                className="form-control" 
                id="amount" 
                placeholder="Enter Amount" 
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setAmountError('');
                }} 
              />
              {amountError && <p style={{ color: 'red' }}>{amountError}</p>}
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button variant="primary" className='btn btn-danger' onClick={handleAddSubscription}>
            Add Subscription
          </button>
        </Modal.Footer>
      </Modal>

      {/* Edit Subscription Modal */}
      <Modal show={showEditModal} onHide={handleEditCloseModal} style={{ zIndex: '99999', width: '100%' }}>
        <Modal.Header closeButton style={{ width: '100%' }}>
          <Modal.Title style={{ fontSize: '17px' }}>Edit Subscription</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ width: '100%' }}>
          <form>
            <div className="mb-3">
              <label htmlFor="subscriptionName" className="form-label">
                Subscription Name
              </label>
              <input 
                type="text" 
                className="form-control" 
                id="subscriptionName" 
                placeholder="Enter Subscription Name" 
                value={subscriptionName}
                onChange={(e) => {
                  setSubscriptionName(e.target.value);
                  setSubscriptionNameError('');
                }} 
              />
              {subscriptionNameError && <p style={{ color: 'red' }}>{subscriptionNameError}</p>}
            </div>
            <div className="mb-3">
              <label htmlFor="subscriptionType" className="form-label">
                Subscription Type
              </label>
              <select
                id="subscriptionType"
                value={subscriptionType}
                onChange={(e) => {
                  setSubscriptionType(e.target.value);
                  setSubscriptionTypeError('');
                }}
                className="form-control"
              >
                <option value="" disabled>
                  Select Subscription Type
                </option>
                <option value="0">Monthly</option>
                <option value="1">Yearly</option>
                {/* <option value="3">Custom</option> */}
              </select>
              {subscriptionTypeError && <p style={{ color: 'red' }}>{subscriptionTypeError}</p>}
            </div>
            <div className="mb-3">
              <label htmlFor="noOfDays" className="form-label">
                No. of Days
              </label>
              <input
                type="number"
                className="form-control"
                id="noOfDays"
                placeholder="Enter Number of Days"
                value={noOfDays}
                onChange={e => {
                  setNoOfDays(e.target.value);
                  setNoOfDaysError("");
                }}
                min="1"
                required
              />
              {noOfDaysError && <p style={{ color: 'red' }}>{noOfDaysError}</p>}
            </div>
            <div className="mb-3">
              <label htmlFor="amount" className="form-label">
                Amount
              </label>
              <input 
                type="number" 
                className="form-control" 
                id="amount" 
                placeholder="Enter Amount" 
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setAmountError('');
                }} 
              />
              {amountError && <p style={{ color: 'red' }}>{amountError}</p>}
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button variant="primary" className='btn btn-danger' onClick={handleEdit}>
            Update Subscription
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
            <h6>Are you sure you want to delete this subscription?</h6>
            <p className="text-muted mb-0">This action cannot be undone.</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button 
            className="btn btn-danger px-4" 
            onClick={deleteSubscription}
          >
            <MdDelete className="me-2" />
            Delete Subscription
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageSubscription;