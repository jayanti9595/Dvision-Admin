import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import { useNavigate } from "react-router-dom";
import { API_URL, APP_PREFIX_PATH } from "../config/AppConfig";
import "../assets/css/dashboard.scss";
import { IoIosTrendingUp ,} from "react-icons/io";
import { MdShoppingCart } from "react-icons/md";
import { IoMdTrendingDown } from "react-icons/io";
import { PiUserCircle } from "react-icons/pi";
import { FaDollarSign } from "react-icons/fa";
import Breadcrumbs from "../components/Breadcrumbs";
import axios from "axios";


const Dashboard = () => {
  const navigate = useNavigate(); 
  const [totalUser, setUserTotalCount] = useState(0)
  const [totalClassesCount, setClassesCount] = useState(0);
  const [totalCount ,setOrderTotalCount] = useState(0)
  
  var token = sessionStorage.getItem('token');

  const handleCardClick = (path) => {
    navigate(path); 
  };

  const breadcrumbItems = [
    { label: "Home", path:`/${APP_PREFIX_PATH}/dashboard`},
    { label: "Dashboard", path: `/${APP_PREFIX_PATH}/dashboard` },
  ]; 

  function fetchUserCount(){
    axios.get(API_URL + "/get_total_students", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response) => {
      if(response.data.key === 'authenticateFailed') {
        sessionStorage.clear();
        navigate(APP_PREFIX_PATH + '/');
      }
      else if(response.data.success) {
        setUserTotalCount(response.data.total_students);
      } else {

      }
    }).catch((error) => {
      console.log("error : ",error);
    })
  }

  function fetchClassesCount(){
    axios.get(API_URL + "/get_total_classes", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response) => {
      if(response.data.key === 'authenticateFailed') {
        sessionStorage.clear();
        navigate(APP_PREFIX_PATH + '/');
      }
      else if(response.data.success) {
        setClassesCount(response.data.total_classes);
      } else {

      }
    }).catch((error) => {
      console.log("error : ",error);
    })
  }

  function fetchOrderCount(){
    axios.get(API_URL + "/get_total_teachers", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response) => {
      if(response.data.key === 'authenticateFailed') {
        sessionStorage.clear();
        navigate(APP_PREFIX_PATH + '/');
      }
      else if(response.data.success) {
        setOrderTotalCount(response.data.total_teachers);
      } else {

      }
    }).catch((error) => {
      console.log("error : ",error);
    })
  }


  useEffect(() => {
    fetchUserCount();
    fetchClassesCount();
    fetchOrderCount();
  },[])

  return (
    <div className="container mt-5">

      <Breadcrumbs  title="Dashboard" items={breadcrumbItems}/>
      <div className="row">
        {/* Card 1 */}
        <div className="col-12 col-md-6 col-lg-4 mb-4">
          <Card
            title="Total Students"
            value={totalUser}
            onClick={() => handleCardClick(`/${APP_PREFIX_PATH}/users`)}
            icon={<IoIosTrendingUp/>}
            topicon={<PiUserCircle/>}
            backgroundColor="linear-gradient(270deg, #4eda89, #1a9f53)" 
              backIconColor="linear-gradient(270deg, #27bf68, #1a9f53)"
          />
        </div>
        {/* Card 2 */}
        <div className="col-12 col-md-6 col-lg-4 mb-4">
          <Card
            title="Total Classes"
            value={totalClassesCount}
            onClick={() => handleCardClick(`/${APP_PREFIX_PATH}/classes`)}
            icon={<IoMdTrendingDown  color="#e1940e"/>}
            topicon={<FaDollarSign color="#f6e053" />}
            backgroundColor="linear-gradient(270deg, #f4d02b, #e1940e)"
            backIconColor="linear-gradient(#edb213, #e1940e)"

          />
        </div>

        {/* Card 3 */}
        <div className="col-12 col-md-6 col-lg-4 mb-4">
          <Card
            title="Total Teachers"
            value={totalCount}
            onClick={() => handleCardClick(`/${APP_PREFIX_PATH}/manage-teacher`)}
            icon={<IoMdTrendingDown  color="#2b77e5"/>}
            topicon={<MdShoppingCart color="#96cefa" />}
            backgroundColor= "linear-gradient(270deg, #64b3f6, #2b77e5)"
               backIconColor="linear-gradient(#4094f1, #2b77e5)"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
