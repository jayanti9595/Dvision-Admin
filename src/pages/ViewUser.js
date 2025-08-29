// import React, { useState, useEffect } from 'react';
// import '../assets/css/users.scss';
// import { APP_PREFIX_PATH, API_URL, IMAGE_PATH } from "../config/AppConfig";
// import Breadcrumbs from "../components/Breadcrumbs";
// import { useParams } from 'react-router-dom';
// import { decode as base64_decode } from "base-64";
// import axios from "axios";
// const ViewUser = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [user_data, setUserDetails] = React.useState([]);
//   var { user_id } = useParams();



//   const breadcrumbItems = [
//     { label: "Dashboard", path: `/${APP_PREFIX_PATH}/dashboard` },
//     { label: "Manage Student", path: `/${APP_PREFIX_PATH}/users` },
//   ];
//   const decode_user_id = base64_decode(user_id);
//   const fetchUserDetail = () => {
//     axios
//       .get(`${API_URL}/get_user_data/${decode_user_id}`)
//       .then((response) => {
//         if (response.data.success) {
//           setUserDetails(response.data.res[0]);
//         } else {
//           console.error('Error fetching store details:', response.data.msg);
//         }
//       })
//       .catch((error) => {
//         console.error('Error fetching store details:', error);
//       });
//   };

//   useEffect(() => {
//     fetchUserDetail();
//   }, [])

//   return (
//     <div className="container mt-5">
//       <Breadcrumbs title="Manage Student" items={breadcrumbItems} />
//       <div className="mc-card">
//         <div className="row mt-4 mb-4">
//           <div className="col-lg-4">
//             <div className="user-img">
//               <img src={user_data.image
//                 ? `${IMAGE_PATH}${user_data.image}`
//                 : `${IMAGE_PATH}placeholder.png`} alt="profile" onClick={() => setIsModalOpen(true)} /></div>

//           </div>
//           <div className="col-lg-7">
//             <div className="row">
//               <div className="col-lg-12">
//                 <h4 className='mb-2'>Student Details</h4>
//               </div>
//             </div>
//             <div className="row mt-2">
//               <div className="col-lg-4">
//                 <h6 className='mb-2'>Name:</h6>

//               </div>
//               <div className="col-lg-8">
//                 <p className='mb-2'>{user_data.name || "NA"}</p>
//               </div>
//             </div>
//             <div className="row">
//               <div className="col-lg-4">
//                 <h6 className='mb-2'>Email:</h6>
//               </div>
//               <div className="col-lg-8">
//                 <p className='mb-2'>{user_data.email || "NA"}</p>
//               </div>
//             </div>

//             <div className="row">
//               <div className="col-lg-4">
//                 <h6 className='mb-2'>Referral Code:</h6>
//               </div>
//               <div className="col-lg-8">
//                 <p className='mb-2'>{user_data.referral_code || "NA"}</p>
//               </div>
//             </div>
//             <div className="row">
//               <div className="col-lg-4">
//                 <h6 className='mb-2'>Referral Code Count:</h6>
//               </div>
//               <div className="col-lg-8">
//                 <p className='mb-2'>{user_data.join_referral_code_count || 0}</p>
//               </div>
//             </div>
//             <div className="row">
//               <div className="col-lg-4">
//                 <h6 className='mb-2'>Mobile:</h6>

//               </div>
//               <div className="col-lg-8">
//                 <p className='mb-2'>{user_data.mobile || "NA"}4</p>
//               </div>
//             </div>
//             <div className="row">
//               <div className="col-lg-4">
//                 <h6 className='mb-2'>Class name:</h6>

//               </div>
//               <div className="col-lg-8">
//                 <p className='mb-2'>{user_data.class_name || "NA"} Class</p>
//               </div>
//             </div>
//             <div className="row">
//               <div className="col-lg-4">
//                 <h6 className='mb-2'>Board Type:</h6>

//               </div>
//               <div className="col-lg-8">
//                 <p className='mb-2'>{user_data.course_type_label || "NA"}</p>
//               </div>
//             </div>
//             <div className="row">
//               <div className="col-lg-4">
//                 <h6 className='mb-2'>Status : </h6>
//               </div>
//               <div className="col-lg-8">
//                 <p className='mb-2'>{user_data.active_flag_lable}</p>
//               </div>
//             </div>

//             {user_data.user_type == 1 ? <><div className="row">
//               <div className="col-lg-4">
//                 <h6 className='mb-2'>Subject Name : </h6>
//               </div>
//               <div className="col-lg-8">
//                 <p className='mb-2'>{user_data.subject_name}</p>
//               </div>
//             </div>
//             </> : <></>}

//             <div className="row">
//               <div className="col-lg-4">
//                 <h6 className='mb-2'>Create Date & Time </h6>

//               </div>
//               <div className="col-lg-8">
//                 <p className='mb-2'>{user_data.createtime || "NA"}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {isModalOpen && (
//         <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <span className="modal-close" onClick={() => setIsModalOpen(false)}>
//               &times;
//             </span>
//             <img
//               src={user_data.image ? `${IMAGE_PATH}${user_data.image}` : `${IMAGE_PATH}placeholder.png`}
//               alt="Profile Preview"
//               className="modal-image"
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ViewUser;


import React, { useState, useEffect } from 'react';
import '../assets/css/users.scss';
import { APP_PREFIX_PATH, API_URL, IMAGE_PATH } from "../config/AppConfig";
import Breadcrumbs from "../components/Breadcrumbs";
import { useParams } from 'react-router-dom';
import { decode as base64_decode } from "base-64";
import axios from "axios";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

const ViewUser = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user_data, setUserDetails] = useState([]);
  const [referredUsers, setReferredUsers] = useState([]);
     const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 8;
  const { user_id } = useParams();

  // Pagination state for referred users table
  const [currentReferredPage, setCurrentReferredPage] = useState(1);
  const referredUsersPerPage = 5;

  const breadcrumbItems = [
    { label: "Dashboard", path: `/${APP_PREFIX_PATH}/dashboard` },
    { label: "Manage Student", path: `/${APP_PREFIX_PATH}/users` },
    { label: "View Student" },
  ];

  const decode_user_id = base64_decode(user_id);

  const fetchUserDetail = () => {
    axios
      .get(`${API_URL}/get_user_data/${decode_user_id}`)
      .then((response) => {
        if (response.data.success) {
          setUserDetails(response.data.res[0]);
          // Fetch users who used this referral code
          fetchReferredUsers(response.data.res[0].referral_code);
        }
      })
      .catch((error) => {
        console.error('Error fetching user details:', error);
      });
  };

  const fetchReferredUsers = (referralCode) => {
    if (!referralCode) {
      setReferredUsers([]);
      return;
    }

    axios
      .get(`${API_URL}/get_users_by_referral_code`, {
        params: { referral_code: referralCode }
      })
      .then((response) => {
        if (response.data.success) {
          setReferredUsers(response.data.user_arr || []);
          // Reset to first page when data changes
          setCurrentReferredPage(1);
        } else {
          setReferredUsers([]);
        }
      })
      .catch((error) => {
        console.error('Error fetching referred users:', error);
        setReferredUsers([]);
      });
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentReferredUsers = referredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(referredUsers.length / usersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    fetchUserDetail();
  }, []);

  return (
    <div className="container mt-5">
      <Breadcrumbs title={`Manage ${user_data.user_type == 2 ? "student" : "Teacher"} `} items={breadcrumbItems} />

      {/* User Details Section */}
      <div className="mc-card">
        <div className="row mt-4 mb-4">
          <div className="col-lg-4">
            <div className="user-img">
              <img
                src={user_data.image
                  ? `${IMAGE_PATH}${user_data.image}`
                  : `${IMAGE_PATH}placeholder.png`}
                alt="profile"
                onClick={() => setIsModalOpen(true)}
              />
            </div>
          </div>
          <div className="col-lg-7">
            <div className="row">
              <div className="col-lg-12">
                <h4 className='mb-1'>{user_data.user_type == 2 ? "student" : "Teacher"} Details</h4>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-lg-4">
                <h6 className='mb-2'>Name:</h6>
              </div>
              <div className="col-lg-8">
                <p className='mb-2'>{user_data.name || "NA"}</p>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-4">
                <h6 className='mb-2'>Email:</h6>
              </div>
              <div className="col-lg-8">
                <p className='mb-2'>{user_data.email || "NA"}</p>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-4">
                <h6 className='mb-2'>Referral Code:</h6>
              </div>
              <div className="col-lg-8">
                <p className='mb-2'>{user_data.referral_code || "NA"}</p>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-4">
                <h6 className='mb-2'>Referral Code Count:</h6>
              </div>
              <div className="col-lg-8">
                <p className='mb-2'>{user_data.join_referral_code_count || 0}</p>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-4">
                <h6 className='mb-2'>Mobile:</h6>
              </div>
              <div className="col-lg-8">
                <p className='mb-2'>{user_data.mobile || "NA"}</p>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-4">
                <h6 className='mb-2'>Class name:</h6>
              </div>
              <div className="col-lg-8">
                <p className='mb-2'>{user_data.class_name || "NA"} Class</p>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-4">
                <h6 className='mb-2'>Board Type:</h6>
              </div>
              <div className="col-lg-8">
                <p className='mb-2'>{user_data.course_type_label || "NA"}</p>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-4">
                <h6 className='mb-2'>Status : </h6>
              </div>
              <div className="col-lg-8">
                <p className='mb-2'>{user_data.active_flag_lable}</p>
              </div>
            </div>

            {user_data.user_type == 1 && (
              <div className="row">
                <div className="col-lg-4">
                  <h6 className='mb-2'>Subject Name : </h6>
                </div>
                <div className="col-lg-8">
                  <p className='mb-2'>{user_data.subject_name}</p>
                </div>
              </div>
            )}

            <div className="row">
              <div className="col-lg-4">
                <h6 className='mb-2'>Create Date & Time </h6>
              </div>
              <div className="col-lg-8">
                <p className='mb-2'>{user_data.createtime || "NA"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Referred Users Table Section */}
      {user_data.referral_code && (
        <><Breadcrumbs title="Manage Students Using Referral Code" items={breadcrumbItems} /><div className="mc-card mt-4">
          <div className="mc-table-responsive">
            <table className="table">
              <thead className="table-head">
                <tr>
                  <th>S No.</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Create Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {currentReferredUsers.length > 0 ? (
                  currentReferredUsers.map((user, index) => {
                    const serialNumber = (currentReferredPage - 1) * referredUsersPerPage + index + 1;
                    return (
                      <tr key={index}>
                        <td>{serialNumber}</td>
                        <td>
                          <img
                            alt="user"
                            src={user.image
                              ? `${IMAGE_PATH}${user.image}`
                              : `${IMAGE_PATH}placeholder.png`}
                            style={{ width: '60px', height: '60px', borderRadius: '50%' }} />
                        </td>
                        <td>{user.name || "NA"}</td>
                        <td>{user.mobile || "NA"}</td>
                        <td>{user.createtime || "NA"}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No students found using this referral code
                    </td>
                  </tr>
                )}
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
        </div></>
      )}

      {/* Image Preview Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="modal-close" onClick={() => setIsModalOpen(false)}>
              &times;
            </span>
            <img
              src={user_data.image
                ? `${IMAGE_PATH}${user_data.image}`
                : `${IMAGE_PATH}placeholder.png`}
              alt="Profile Preview"
              className="modal-image"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewUser;