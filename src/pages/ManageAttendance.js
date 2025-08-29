import React, { useEffect, useState, useRef } from 'react';
import '../assets/css/users.scss';
import { API_URL, APP_PREFIX_PATH, IMAGE_PATH } from "../config/AppConfig";
import Breadcrumbs from "../components/Breadcrumbs";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { BsEyeFill } from "react-icons/bs";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { IoSearch } from "react-icons/io5";
import { encode as base64_encode } from 'base-64';
const ManageTeacherAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;
  const [selectedIndex, setSelectedIndex] = useState(null);


  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = attendanceData.filter((user) => {
    const lowercasedTerm = searchQuery.toLowerCase();
    const userNameMatch = user.name?.toLowerCase().includes(lowercasedTerm);
    const classNameMatch = user.class_name?.toLowerCase().includes(lowercasedTerm);
    const in_time = user.in_time?.toLowerCase().includes(lowercasedTerm);
    const out_time = user.out_time?.toLowerCase().includes(lowercasedTerm);
    const dateMatch = user.createtime ? String(user.createtime).toLowerCase().includes(lowercasedTerm) : false;
    const attendance_date = user.attendance_date ? String(user.attendance_date).toLowerCase().includes(lowercasedTerm) : false;
    return userNameMatch || dateMatch || out_time || attendance_date || in_time || classNameMatch;
  });

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const breadcrumbItems = [
    { label: "Dashboard", path: `/${APP_PREFIX_PATH}/dashboard` },
    { label: "Teacher Attendance", path: `/${APP_PREFIX_PATH}/teacher_attendance` },
  ];
  function fetchUser() {
    const token = sessionStorage.getItem('token');
    axios.get(API_URL + "/get_all_attendance", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response) => {
      if (response.data.success) {
        setAttendanceData(response.data.attendance_arr);
      } else {
        setAttendanceData([])
      }
    }).catch((error) => {
      console.log("error : ", error);
    })
  }

  useEffect(() => {
    fetchUser();
  }, [])


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
    <><div className="container mt-5">
      <Breadcrumbs title="Manage Teacher Attendance" items={breadcrumbItems} />
      <div className="mc-card">
        <div className="row mb-4 mt-2">
          <div className="col-lg-3">
            <form className="header-search">
              <IoSearch className="ms-3" />
              <input type="text" placeholder="Search Here..." onChange={handleSearch} />
            </form>
          </div>
        </div>

        <div className="mc-table-responsive" >
          <table className="table">
            <thead className='table-head'>
              <tr>
                <th>S No.</th>
                <th>Action</th>
                <th>Image</th>
                <th>Teacher Name</th>
                <th>Attendance Date</th>
                <th>Check In Time</th>
                <th>Check Out Time</th>
                <th>Create Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? <> {currentUsers.map((user, index) => (
                <tr key={user.sn}>
                  <td>{index + 1}.</td>
                  <td>
                    <Link
                      className="btn" style={{background : "#f47b1e",color : "white"}}
                      to={`/${APP_PREFIX_PATH}/view-user/${base64_encode(user.teacher_id)}`}
                    >
                      <BsEyeFill className="me-2" />
                      View
                    </Link>
                  </td>

                  <td><img src={user.image != null
                    ? `${IMAGE_PATH}${user.image}`
                    : `${IMAGE_PATH}placeholder.png`} style={{ width: '60px', height: '60px', borderRadius: '50%' }} /></td>
                  <td>{user.name || "NA"}</td>
                  <td>{user.attendance_date || "NA"}</td>
                  <td>{user.in_time || "NA"}</td>
                  <td>{user.out_time || "NA"}</td>
                  <td>{user.createtime || "NA"}</td>
                </tr>
              ))}</> : <><tr>
                <td colSpan="8">
                  No Data Found
                </td>
              </tr></>}
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

    </div>
    </>
  );
};

export default ManageTeacherAttendance;
