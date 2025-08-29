import React, { useEffect, useState } from 'react';
import '../assets/css/users.scss';
import { API_URL, APP_PREFIX_PATH } from "../config/AppConfig";
import Breadcrumbs from "../components/Breadcrumbs";
import table from "../assets/images/table.jpg";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { decode as base64_decode } from "base-64";
import { HiChevronRight } from "react-icons/hi";
import { IoSearch } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { encode as base64_encode } from 'base-64';
import { FaEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { HiChevronLeft } from "react-icons/hi";
import './rating.css'
const ViewOrder = () => {
  const [order_data, setOrderDetail] = useState({});
  const [order_product, setOrderDetailProduct] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedIndex, setSelectedIndex] = React.useState(null);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleClick = (index) => {
    setSelectedIndex(index === selectedIndex ? null : index);
  };


  const { order_id } = useParams();
  const breadcrumbItems = [
    { label: "Dashboard", path: `/${APP_PREFIX_PATH}/dashboard` },
    { label: "View Booking Detail", path: `/${APP_PREFIX_PATH}/users` },
  ];

  const usersPerPage = 8;
  const filteredOrder = order_product.filter((user) => {
    const lowercasedTerm = searchQuery.toLowerCase();
    const productNameMatch = user.name_en?.toLowerCase().includes(lowercasedTerm);
    const productHiNameEnglishMatch = user.name_hi?.toLowerCase().includes(lowercasedTerm);
    const company_name_hiMatch = user.company_name_hi?.toLowerCase().includes(lowercasedTerm);
    const company_name_enMatch = user.company_name_en?.toLowerCase().includes(lowercasedTerm);
    const dateMatch = user.createtime ? String(user.createtime).toLowerCase().includes(lowercasedTerm) : false;
    const priceMatch = user.price ? String(user.price).toLowerCase().includes(lowercasedTerm) : false;
    const pricewholesaleMatch = user.total_price ? String(user.total_price).toLowerCase().includes(lowercasedTerm) : false;
    const quesntityMatch = user.quantity ? String(user.quantity).toLowerCase().includes(lowercasedTerm) : false;
    return productNameMatch || dateMatch || productHiNameEnglishMatch || quesntityMatch || priceMatch || pricewholesaleMatch || company_name_enMatch || company_name_hiMatch;
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredOrder.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredOrder.length / usersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  const fetchOrderDetail = () => {
    const decode_order_id = base64_decode(order_id);
    axios.get(API_URL + `/get_order_detail?booking_id=${decode_order_id}`).then((res) => {
      console.log((res, "  response"));
      setOrderDetail(res.data.all_booking_arr)
    }).catch((error) => {
      console.log("error : ", error);
    })
  }

  const fetchOrderProductDetail = () => {
    const decode_order_id = base64_decode(order_id);
    axios.get(API_URL + `/get_order_product?booking_id=${decode_order_id}`).then((res) => {
      console.log((res, "  response"));
      setOrderDetailProduct(res.data.allBookingArr)
    }).catch((error) => {
      console.log("error : ", error);
    })
  }

  useEffect(() => {
    fetchOrderDetail();
    fetchOrderProductDetail();
  }, [order_id])

  return (
    <div className="container mt-5">
      <Breadcrumbs title="Manage Booking Detail" items={breadcrumbItems} />
      <div className="mc-card">
        <h4>Booking Detail</h4>
        <div className="row mt-4 mb-4">
          <div className="col-lg-7">
            <div className="row">
              <div className="col-lg-4">
                <h6 className='mb-2'>Customer Name:</h6>

              </div>
              <div className="col-lg-8">
                <p className='mb-2'>{order_data.name || 'NA'}</p>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-4">
                <h6 className='mb-2'>Customer Mobile No:</h6>

              </div>
              <div className="col-lg-8">
                <p className='mb-2'>{order_data.mobile || 'NA'}</p>
              </div>
            </div>
            {order_data.subAdminArr ? <>

              <div className="row">
                <div className="col-lg-4">
                  <h6 className='mb-2'>Sub Admin Name:</h6>

                </div>
                <div className="col-lg-8">
                  <p className='mb-2'>{order_data.subAdminArr.username || 'NA'}</p>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-4">
                  <h6 className='mb-2'>Sub Admin Email:</h6>

                </div>
                <div className="col-lg-8">
                  <p className='mb-2'>{order_data.subAdminArr.email || 'NA'}</p>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-4">
                  <h6 className='mb-2'>Sub Admin Mobile:</h6>

                </div>
                <div className="col-lg-8">
                  <p className='mb-2'>{order_data.subAdminArr.mobile || 'NA'}</p>
                </div>
              </div>

            </> : <></>}

            <div className="row">
              <div className="col-lg-4">
                <h6 className='mb-2'>Booking Id:</h6>

              </div>
              <div className="col-lg-8">
                <p className='mb-2'>{order_data.booking_number}</p>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-4">
                <h6 className='mb-2'>Booking Type</h6>

              </div>
              <div className="col-lg-8">
                <p className='mb-2 '>
                  {order_data.booking_type_lable}</p>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-4">
                <h6 className='mb-2'>Transaction ID:</h6>

              </div>
              <div className="col-lg-8">
                <p className='mb-2'>{order_data.transaction_id || 'NA'}</p>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-4">
                <h6 className='mb-2'>Total Amount :  </h6>

              </div>
              <div className="col-lg-8">
                <p className='mb-2'>{order_data.total_price || 'NA'}</p>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-4">
                <h6 className='mb-2'>Rating:</h6>
              </div>
              <div className="col-lg-8">
                <div className="star-rating">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} className={i < Math.floor(order_data.rating_arr) ? 'filled' : 'empty'}>
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </div>


            <div className="row">
              <div className="col-lg-4">
                <h6 className='mb-2'>Status </h6>

              </div>
              <div className="col-lg-8">
                <p className='mb-2 '>
                  <button className='ongoing' style={{
                    backgroundColor:
                      order_data.trace_order === 0
                        ? "#ffc107" // Yellow for Pending
                        : order_data.trace_order === 1
                          ? "#17a2b8" // Blue for In Progress
                          : "#28a745", // Green for Complete
                    color: "white",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    fontWeight: "bold",
                    display: "inline-block",
                    textAlign: "center",
                  }}>
                    {order_data.trace_order_label}
                  </button></p>
              </div>
            </div>


            <div className="row">
              <div className="col-lg-4">
                <h6 className='mb-2'>Address</h6>

              </div>
              <div className="col-lg-8">
                <p className='mb-2 '>
                  {order_data.address}</p>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-4">
                <h6 className='mb-2'>Address Type</h6>

              </div>
              <div className="col-lg-8">
                <p className='mb-2 '>
                  {order_data.address_type_label}</p>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-4">
                <h6 className='mb-2'>total Amount </h6>

              </div>
              <div className="col-lg-8">
                <p className='mb-2 '>
                  ₹1000
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mc-card">
        <div className="row">
          <div className="col-lg-9">
            <form className="header-search">
              <IoSearch className="ms-3" />
              <input type="text" placeholder="Search Here..." onChange={handleSearch} />
            </form>
          </div>
        </div>
      </div>
      <div className="mc-table-responsive">
        <table className="table">
          <thead className='table-head'>
            <tr>
              <th>S No.</th>
              <th>Action</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Total Price</th>
              <th>Quantity</th>
              <th>Company Name</th>
              <th>Create Date & Time</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, index) => (
              <tr key={user.s_no}>
                <td>{user.s_no}.</td>
                <td>
                  <div className="dropdown custom-dropup">
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
                      style={{ display: selectedIndex === index ? 'block' : 'none' }} // Show dropdown if index matches
                    >
                      <li><Link className="dropdown-item" to={`/${APP_PREFIX_PATH}/view-product/${base64_encode(user.product_id)}`}><FaEye className='me-2' />View</Link></li>
                      {/* <li><button className="dropdown-item"  ><MdDelete className='me-2' />In Progress</button></li>
                            <li><button className="dropdown-item"  ><MdDelete className='me-2' />Complete</button></li> */}
                    </ul>
                  </div>
                </td>
                <td>{user.name_en + "(" + user.name_hi + ")"}</td>
                <td>{user.price}</td>

                <td>{user.total_price}</td>
                {/* <td>
                  <p
                    className="status-btn"
                    style={{
                      backgroundColor:
                        user.trace_order === 0
                          ? "#ffc107" // Yellow for Pending
                          : user.trace_order === 1
                            ? "#17a2b8" // Blue for In Progress
                            : "#28a745", // Green for Complete
                      color: "white",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      fontWeight: "bold",
                      display: "inline-block",
                      textAlign: "center",
                    }}
                  >
                    {user.trace_order_label}
                  </p>
                </td> */}

                <td>{user.quantity}</td>
                <td>{user.company_name_en + "(" + user.company_name_hi + ")"}</td>
                {/* <td>{user.quantity}</td>
                      <td>{user.product_price}</td> */}
                {/* <td>{user.total_price}</td> */}
                <td>{user.createtime}</td>
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
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          <HiChevronRight style={{ fontSize: '20px' }} />

        </button>
      </div>
    </div>
  );
};

export default ViewOrder;
