// src/AdminCard.js

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IoIosTrendingUp } from "react-icons/io";



const Card = ({ title, value,topicon, icon, backgroundColor,onClick  ,backIconColor}) => {
    return (
        <div className="card text-white" style={{ background: backgroundColor }} onClick={onClick}>
            <div className="card-body ">
            
                <div className="me-3 backdiv" >
                {icon}
                    {/* <img src={icon} alt="icon" style={{ width: '215px', height: '90px' }} /> */}
                    {/* {typeof icon === 'object' ? (
                            <IoIosTrendingUp icon={icon} size="2x" />
                        ) : (
                            <img src={icon} alt="icon" style={{ width: '50px', height: '50px' }} />
                        )} */}
                </div>
                <div className='mc-ecommerce-card-head'>
                    <h5 className="mc-ecommerce-card-meta"><span>{title}</span>{value}</h5>
                    <div className='user-icon' style={{ background: backIconColor }}>
                    {topicon}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;
