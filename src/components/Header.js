import React, { useEffect, useState } from "react";
import { MdMenuOpen, MdOutlineMenu } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { API_URL, APP_LOGO, APP_PREFIX_PATH, IMAGE_PATH } from "../config/AppConfig";
import  {Link, useNavigate} from 'react-router-dom'; 
// import SearcBar from "./SearchBar";
import '../assets/css/header.scss';
import axios from "axios";
const Swal = require('sweetalert2')

const Header = ({ onToggleSidebar, username }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [admin,setAllAdminData] = useState([]);
  const navigate = useNavigate();

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    onToggleSidebar();
  };
  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const fetchData = () => {
    axios
      .get(`${API_URL}/get_admin_data`)
      .then((response) => {
        setAllAdminData(response.data.info[0]);
      })
      .catch((error) => {
        console.error('Error fetching data :', error);
      });
  };

  useEffect(() =>{
    fetchData()
  },[])

  const handleLogout = () => {
    Swal.fire({
      text: "Are you sure you want to logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, logout",
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.clear();
        navigate(`${APP_PREFIX_PATH}/`);
      }
    });
  };
  return (
    <div className="header">
      <div className="container-fluid">
        <div className="row topbar">
          <div className="col-lg-3">
            <div className="d-flex justify-content-between align-items-center part1">
              <Link to="#">
                <img src={APP_LOGO} alt="User" className="logo" height={72} width={2}/>
              </Link>
              <div className="mc-group">
                <div className="mc-header-left">
                  <button
                    className="rounded-circle"
                    onClick={handleToggleSidebar}
                  >
                    {isSidebarOpen ? <MdOutlineMenu /> : <MdMenuOpen />}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3">
          </div>
          <div className="col-lg-6">
            <div className="mc-header-user dropdown">
              <button className="dropdown-toggle" onClick={handleProfileClick}>
                <Link to="#">
                  <img  src={admin.image != null ? `${IMAGE_PATH}${admin.image}` : `${IMAGE_PATH}placeholder.png`} alt="Profile" />
                </Link>
              </button>
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <span onClick={(e) => {setIsDropdownOpen(false)}}>
                  <Link to={`/${APP_PREFIX_PATH}/profile`} className="dropdown-item">
                  <FaUser  className="me-2"/> Profile
                  </Link>
                  </span>
                  <span  onClick={handleLogout} className="dropdown-item">
                  <IoLogOutOutline  className="me-2" style={{fontSize:'22px'}}/> Logout
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
