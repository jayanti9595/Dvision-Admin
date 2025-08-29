import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom'; 
import { APP_PREFIX_PATH } from '../config/AppConfig';
import logo from '../assets/images/login.jpg'; 
import { MdDashboard } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { BiCategory } from "react-icons/bi";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { MdBroadcastOnPersonal } from "react-icons/md";
import { TbCategoryPlus } from "react-icons/tb";
import { PiFlagBanner } from "react-icons/pi";
import { FaPhone } from "react-icons/fa6";
import { MdContentCopy } from "react-icons/md";
import { MdReviews } from "react-icons/md";
import { MdAttachMoney } from "react-icons/md";
import { BiSolidWatchAlt } from 'react-icons/bi'; 
import Swal from 'sweetalert2';
import { IoLogOutOutline } from "react-icons/io5";

import { FaChalkboardUser } from "react-icons/fa6";const Sidebar = () => {
    const location = useLocation(); 
    const navigate = useNavigate();
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
        <div className="sidebar-container border-right">
            {/* Navigation List */}
            <ul className="navbar">
                <li className="mc-sidebar-menu-item">
                    <Link
                        to={`/${APP_PREFIX_PATH}/dashboard`}
                        className={`nav-link ${location.pathname === `/${APP_PREFIX_PATH}/dashboard` ? 'active' : ''}`}
                    >
                        <MdDashboard />
                        Dashboard
                    </Link>
                </li>
                <li className="mc-sidebar-menu-item">
                    <Link
                        to={`/${APP_PREFIX_PATH}/users`}
                        className={`nav-link ${location.pathname === `/${APP_PREFIX_PATH}/users` ? 'active' : ''}`}
                    >
                        <FaUsers />
                        Manage Students
                    </Link>
                </li>
                <li className="mc-sidebar-menu-item">
                    <Link
                        to={`/${APP_PREFIX_PATH}/manage-teacher`}
                        className={`nav-link ${location.pathname === `/${APP_PREFIX_PATH}/manage-teacher` ? 'active' : ''}`}
                    >
                        <FaChalkboardUser />
                        Manage Teacher
                    </Link>
                </li>
                 <li className="mc-sidebar-menu-item">
                    <Link
                        to={`/${APP_PREFIX_PATH}/teacher_attendance`}
                        className={`nav-link ${location.pathname === `/${APP_PREFIX_PATH}/teacher_attendance` ? 'active' : ''}`}
                    >
                    <BiSolidWatchAlt />
                        Manage Attendance 
                    </Link>
                </li>                    
                <li className="mc-sidebar-menu-item">
                    <Link
                        to={`/${APP_PREFIX_PATH}/classes`}
                        className={`nav-link ${location.pathname === `/${APP_PREFIX_PATH}/classes` ? 'active' : ''}`}
                    >
                        <BiCategory />
                        Manage Classes
                    </Link>
                </li>

                <li className="mc-sidebar-menu-item">
                    <Link
                        to={`/${APP_PREFIX_PATH}/ManageSubject`}
                        className={`nav-link ${location.pathname === `/${APP_PREFIX_PATH}/ManageSubject` ? 'active' : ''}`}
                    >
                    <TbCategoryPlus />
                        Manage Subjects
                    </Link>
                </li>
                <li className="mc-sidebar-menu-item">
                    <Link
                        to={`/${APP_PREFIX_PATH}/quote`}
                        className={`nav-link ${location.pathname === `/${APP_PREFIX_PATH}/quote` ? 'active' : ''}`}
                    >
                    <TbCategoryPlus />
                        Manage Quote
                    </Link>
                </li>
                <li className="mc-sidebar-menu-item">
                    <Link
                        to={`/${APP_PREFIX_PATH}/manage-course`}
                        className={`nav-link ${location.pathname === `/${APP_PREFIX_PATH}/manage-course` ? 'active' : ''}`}
                    >
                        <MdOutlineProductionQuantityLimits />
                        Manage Courses
                    </Link>
                </li>
                <li className="mc-sidebar-menu-item">
                    <Link
                        to={`/${APP_PREFIX_PATH}/manage-quiz`}
                        className={`nav-link ${location.pathname === `/${APP_PREFIX_PATH}/manage-quiz` ? 'active' : ''}`}
                    >
                        <MdOutlineProductionQuantityLimits />
                        Manage Quiz
                    </Link>
                </li>

               

                <li className="mc-sidebar-menu-item">
                    <Link
                        to={`/${APP_PREFIX_PATH}/manage-timetable`}
                        className={`nav-link ${location.pathname === `/${APP_PREFIX_PATH}/review` ? 'active' : ''}`}
                    >
                       <MdAttachMoney />
                        Manage Time Tables 
                    </Link>
                </li>

                <li className="mc-sidebar-menu-item">
                    <Link
                        to={`/${APP_PREFIX_PATH}/manage-product`}
                        className={`nav-link ${location.pathname === `/${APP_PREFIX_PATH}/manage-product` ? 'active' : ''}`}
                    >
                    <MdContentCopy />
                        Manage Subscription
                    </Link>
                </li>

                {/* <li className="mc-sidebar-menu-item">
                    <Link
                        to={`/${APP_PREFIX_PATH}/broadcast`}
                        className={`nav-link ${location.pathname === `/${APP_PREFIX_PATH}/broadcast` ? 'active' : ''}`}
                    >
                       <MdBroadcastOnPersonal />
                        Manage Broadcast
                    </Link>
                </li> */}

                <li className="mc-sidebar-menu-item">
                    <Link
                        to={`/${APP_PREFIX_PATH}/manage-banner`}
                        className={`nav-link ${location.pathname === `/${APP_PREFIX_PATH}/manage-banner` ? 'active' : ''}`}
                    >
                    <PiFlagBanner />
                        Manage Banner
                    </Link>
                </li>

                <li className="mc-sidebar-menu-item">
                    <Link
                        to={`/${APP_PREFIX_PATH}/manage-contact`}
                        className={`nav-link ${location.pathname === `/${APP_PREFIX_PATH}/manage-contact` ? 'active' : ''}`}
                    >
                    <FaPhone />
                        Manage Contact Us
                    </Link>
                </li>
                <li className="mc-sidebar-menu-item">
                    <Link
                        to={`/${APP_PREFIX_PATH}/manage-content`}
                        className={`nav-link ${location.pathname === `/${APP_PREFIX_PATH}/manage-content` ? 'active' : ''}`}
                    >
                    <MdContentCopy />
                        Manage Contents
                    </Link>
                </li>
                <li className="mc-sidebar-menu-item " style={{color:'red'}}>
                    <Link
                        onClick={handleLogout}
                    >
                    <IoLogOutOutline />
                    Logout
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
