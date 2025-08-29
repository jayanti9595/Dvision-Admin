// /* eslint-disable eqeqeq */
// // src/Login.js

// import React, { useState } from "react";
// // import 'bootstrap/dist/css/bootstrap.min.css';
// import { Link, useNavigate } from "react-router-dom";
// import { API_URL, APP_LOGO, APP_PREFIX_PATH } from "../config/AppConfig";
// import axios from "axios";

// const ForgotPassword = () => {
//   const [email, setEmail] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [error, setError] = useState("");
//   const [showErrorModal, setShowErrorModal] = useState(false);
//   const navigate = useNavigate();

//   const closeErrorModal = () => {
//     setShowErrorModal(false);
//     setError("");
//   };

//   const handleSubmit = async (values) => {
//     console.log("error", error);
//     if (values.email == "") {
//       setError("Please enter your email");
//       return;
//     }

//     try {
//       const checkResponse = await axios.post(`${API_URL}/Check_admin_email`, {
//         email: values.email,
//       });

//       if (checkResponse.data.success) {
//         setShowModal(true);
//         const resetResponse = await axios.post(
//           `${API_URL}/Admin_forget_password`,
//           { email: values.email }
//         );

//         console.log("resetResponse ", resetResponse);

//         setTimeout(() => {
//           setShowModal(false);
//           setError("");
//           navigate(`${APP_PREFIX_PATH}/`);
//         }, 1000);

//         console.log("Email sent successfully");
//         setError("");
//       } else {
//         // Email doesn't exist or other error
//         setError("Email address is not register with us, please try again");
//         setShowErrorModal(true);
//       }
//     } catch (error) {
//       console.error("Error checking or sending reset link:", error);
//       setError("Something went wrong, please try again later");
//       setShowErrorModal(true);
//     }
//   };

//   return (
//     <div className="container d-flex align-items-center justify-content-center">
//       <div
//         className="card"
//         style={{ width: "450px", borderRadius: "16px", height: "400px" }}
//       >
//         <div className="card-body">
//           <h5 className="card-title text-center">
//             <img
//               src={APP_LOGO}
//               alt="Login"
//               style={{ width: "150px",height:"50px" }}
//               className="mb-4 mt-4"
//             />
//             <br />
//             Login
//           </h5>
//           <form className="login-form mt-4 mb-4">
//             <div className="mb-3">
//               <label htmlFor="email" className="form-label">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 className="form-control"
//                 placeholder="Enter Email"
//                 id="email"
//                 value={email}
//                 onChange={(e) => {
//                   setEmail(e.target.value);
//                   setError("");
//                 }}
//               />
//               {error && <span className="text-danger">{error}</span>}
//             </div>

//             <button
//               type="submit"
//               className=" btn-primary w-100"
//               onClick={handleSubmit}
//             >
//               Send Mail
//             </button>
//           </form>
//           <div className="mt-3 text-center">
//             <Link to={`${APP_PREFIX_PATH}/`}>Back?Login</Link>
//           </div>
//         </div>
//       </div>
//       {showModal && (
//         <div
//           className="modal fade show"
//           tabIndex="-1"
//           role="dialog"
//           aria-labelledby="exampleModalCenterTitle"
//           aria-hidden="true"
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             backgroundColor: "rgba(0, 0, 0, 0.5)",
//             display: "block",
//             alignItems: "center",
//             justifyContent: "center",
//             zIndex: 1000,
//           }}
//         >
//           <div
//             className="modal-dialog  pwd-modal modal-dialog-centered"
//             role="document"
//           >
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h3 className="modal-title" id="exampleModalLongTitle">
//                   Forgot Password
//                 </h3>
//               </div>
//               <div className="modal-body">
//                 <p>Password reset link has been sent Successfully</p>
//               </div>
//               <div className="modal-footer">
//                 {/* Optionally add a Save changes button */}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Error Modal */}
//       {showErrorModal && (
//         <div
//           className="modal fade show"
//           // style={{ display: 'block' }}
//           tabIndex="-1"
//           role="dialog"
//           aria-labelledby="errorModalTitle"
//           aria-hidden="true"
//           style={{
//             // display: 'block' ,
//             position: "fixed",
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             backgroundColor: "rgba(0, 0, 0, 0.5)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             zIndex: 1000,
//           }}
//         >
//           <div
//             className="modal-dialog modal-dialog-centered pwd-modal"
//             role="document"
//           >
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h3 className="modal-title" id="errorModalTitle">
//                   Error
//                 </h3>
//               </div>
//               <div className="modal-body">
//                 <p>{error}</p>
//               </div>
//               <div className="modal-footer">
//                 <button
//                   type="button"
//                   className="btn btn-secondary"
//                   onClick={closeErrorModal}
//                 >
//                   OK
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ForgotPassword;
import React, { useState } from "react";
// import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from "react-router-dom";
import { API_URL, APP_LOGO, APP_PREFIX_PATH } from "../config/AppConfig";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const navigate = useNavigate();

  const closeErrorModal = () => {
    setShowErrorModal(false);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    var hashError = false;
    if (!email) {
      setError("Please enter your email");
      hashError = true;
    } else {
      hashError = false;
    }
    if(hashError) {
      return;
    }

    try {
      const checkResponse = await axios.post(`${API_URL}/Check_admin_email`, {
        email: email,
      });

      if (checkResponse.data.success) {
        setShowModal(true);
        const resetResponse = await axios.post(
          `${API_URL}/Admin_forget_password`,
          { email: email }
        );

        console.log("resetResponse ", resetResponse);

        setTimeout(() => {
          setShowModal(false);
          setError("");
          navigate(`/${APP_PREFIX_PATH}/`);
        }, 1000);

        console.log("Email sent successfully");
        setError("");
      } else {
        // Email doesn't exist or other error
        setError("Email address is not register with us, please try again");
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error("Error checking or sending reset link:", error);
      setError("Something went wrong, please try again later");
      setShowErrorModal(true);
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center">
      <div
        className="card"
        style={{ width: "450px", borderRadius: "16px", height: "400px" }}
      >
        <div className="card-body">
          <h5 className="card-title text-center">
            <img
              src={APP_LOGO}
              alt="Login"
              style={{ width: "100px",height:"100px" }}
              className="mb-4 mt-4"
            />
            <br />
            Forgot Password
          </h5>
          <form className="login-form mt-4 mb-4" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter Email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
              />
              {error && <span className="text-danger">{error}</span>}
            </div>

            <button
              type="submit"
              className=" btn-primary w-100"
            >
              Send Mail
            </button>
          </form>
          <div className="mt-3 text-center">
            <Link to={`/${APP_PREFIX_PATH}/`}>Back?Login</Link>
          </div>
        </div>
      </div>
      {showModal && (
        <div
          className="modal fade show"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "block",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="modal-dialog  pwd-modal modal-dialog-centered"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="modal-title" id="exampleModalLongTitle">
                  Forgot Password
                </h3>
              </div>
              <div className="modal-body">
                <p>Password reset link has been sent Successfully</p>
              </div>
              <div className="modal-footer">
                {/* Optionally add a Save changes button */}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div
          className="modal fade show"
          // style={{ display: 'block' }}
          tabIndex="-1"
          role="dialog"
          aria-labelledby="errorModalTitle"
          aria-hidden="true"
          style={{
            // display: 'block' ,
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="modal-dialog modal-dialog-centered pwd-modal"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="modal-title" id="errorModalTitle">
                  Error
                </h3>
              </div>
              <div className="modal-body">
                <p>{error}</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeErrorModal}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;