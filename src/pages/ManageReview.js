import React, { useState } from 'react';
import { APP_PREFIX_PATH } from "../config/AppConfig";
import Breadcrumbs from "../components/Breadcrumbs";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { IoMdAdd } from "react-icons/io";
import { Modal, Form } from 'react-bootstrap';
import table from "../assets/images/table.jpg";
import '../assets/css/variables.scss';
import SearchBar from '../components/SearchBar';

const ManageReview = () => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination settings
  const reviewsPerPage = 8;

  // Reviews Data
  const reviews = [
    { sn: 1, reviewerName: "John Doe", email: "John@mailinator.com", review: "Excellent product! Highly recommend it.", rating: 5, date: "28/10/2024 10:16 AM" },
    { sn: 2, reviewerName: "Jane Doe", email: "Jane@mailinator.com", review: "The service was satisfactory, but delivery was late.", rating: 3, date: "28/10/2024 11:16 AM" },
    { sn: 3, reviewerName: "Bob Smith", email: "Bob@mailinator.com", review: "Not worth the price. Poor quality.", rating: 1, date: "28/10/2024 12:16 PM" },
    { sn: 4, reviewerName: "Alice Johnson", email: "Alice@mailinator.com", review: "Amazing experience! Will purchase again.", rating: 5, date: "28/10/2024 01:16 PM" },
    { sn: 5, reviewerName: "Charlie Brown", email: "Charlie@mailinator.com", review: "Good product, but packaging needs improvement.", rating: 4, date: "28/10/2024 02:16 PM" },
    { sn: 6, reviewerName: "David Green", email: "David@mailinator.com", review: "Product stopped working after a week.", rating: 2, date: "28/10/2024 03:16 PM" },
    { sn: 7, reviewerName: "Eva White", email: "Eva@mailinator.com", review: "Fast delivery and great customer service.", rating: 5, date: "28/10/2024 04:16 PM" },
    { sn: 8, reviewerName: "Frank Black", email: "Frank@mailinator.com", review: "Decent quality for the price.", rating: 4, date: "28/10/2024 05:16 PM" },
    { sn: 9, reviewerName: "Grace Blue", email: "Grace@mailinator.com", review: "The product doesn't match the description.", rating: 2, date: "28/10/2024 06:16 PM" },
    { sn: 10, reviewerName: "Henry Gray", email: "Henry@mailinator.com", review: "Very happy with the purchase. Worth every penny.", rating: 5, date: "28/10/2024 07:16 PM" },
    { sn: 11, reviewerName: "Ivy Red", email: "Ivy@mailinator.com", review: "Average product. Could be better.", rating: 3, date: "28/10/2024 08:16 PM" },
    { sn: 12, reviewerName: "Jack Purple", email: "Jack@mailinator.com", review: "Poor customer support. Disappointed.", rating: 1, date: "28/10/2024 09:16 PM" },
    { sn: 13, reviewerName: "Kara Pink", email: "Kara@mailinator.com", review: "Excellent quality and quick shipping.", rating: 5, date: "28/10/2024 10:16 PM" },
    { sn: 14, reviewerName: "Leo Orange", email: "Leo@mailinator.com", review: "The product exceeded my expectations!", rating: 5, date: "28/10/2024 11:16 PM" },
    { sn: 15, reviewerName: "Mona Yellow", email: "Mona@mailinator.com", review: "Not satisfied. Will not buy again.", rating: 2, date: "28/10/2024 12:16 AM" }
  ];

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const breadcrumbItems = [
    { label: "Manage Review", path: `/${APP_PREFIX_PATH}/dashboard` },
    { label: "Review", path: `/${APP_PREFIX_PATH}/review` },
  ];

  return (
    <div className="container mt-5">
      <Breadcrumbs title="Manage Review" items={breadcrumbItems} />
      <div className="mc-card">
        {/* Search and Add Section */}
        <div className="row mb-4 mt-2 flex-wrap">
          <div className="col-lg-3">
            <SearchBar />
          </div>
          
        </div>

        {/* Table */}
        <div className="mc-table-responsive">
          <table className="table">
            <thead className='table-head'>
              <tr>
                <th>S No.</th>
                <th>Name</th>
                <th>Email</th>
                <th>Review</th>
                <th>Rating</th>
                <th>Create Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {currentReviews.map((review) => (
                <tr key={review.sn}>
                  <td>{review.sn}</td>
                  <td>{review.reviewerName}</td>
                  <td>{review.email}</td>
                  <td>{review.review}</td>
                  <td>{review.rating}</td>
                  <td>{review.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination">
          <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
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
          <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
            <HiChevronRight style={{ fontSize: '20px' }} />
          </button>
        </div>
      </div>

      {/* Add Category Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Category Name (English)</Form.Label>
              <Form.Control type="text" placeholder="Enter Category Name" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category Name (Hindi)</Form.Label>
              <Form.Control type="text" placeholder="Enter Category Name" />
            </Form.Group>
            <Form.Group>
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <button className='btn btn-secondary' onClick={() => setShowModal(false)}>Close</button>
          <button className='btn btn-primary'>Submit</button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageReview;
