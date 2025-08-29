/* eslint-disable eqeqeq */
import { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "./assets/css/App.scss";
import { APP_PREFIX_PATH } from "./config/AppConfig";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UsersList from "./pages/UsersList";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Profile from "./pages/Profile";
import ManageBroadcast from "./pages/ManageBroadcast";
import ManageSubject from "./pages/ManageSubject";
import ViewOrder from "./pages/ViewOrder";
import ViewUser from "./pages/ViewUser";
import ManageBanner from "./pages/ManageBanner";
import ManageContact from "./pages/ManageContact";
import ManageContent from "./pages/ManageContent";
import ManageProduct from "./pages/ManageSubscription";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import ViewProduct from "./pages/ViewProduct";
import ViewTimetable from "./pages/ViewTimetable";
import ViewResult from "./pages/ViewResult";
import ForgotPassword from "./pages/ForgotPassword";
import ManageReview from "./pages/ManageReview";
import ResetPassword from "./pages/ResetPassword";
import ManageCommission from "./pages/ManageTimetables";
import ManageClass from "./pages/ManageClass";
import ManageTeacher from "./pages/ManageTeacher";
import AddTeacher from "./pages/AddTeacher";
import ManageSubscription from "./pages/ManageSubscription";
import ManageQuiz from './pages/ManageQuiz';
import AddQuiz from './pages/AddQuiz';
import EditQuiz from './pages/EditQuiz';
import ViewQuiz from './pages/ViewQuiz';
import ManageCourse from "./pages/ManageCourse";
import ViewCourse from "./pages/ViewCourse";
import ManageQuote from "./pages/ManageQuotes";
import AddCourse from "./pages/AddCourse";
import EditCourse from "./pages/EditCourse";
import ManageTeacherAttendance from "./pages/ManageAttendance";
import './index.css';
function App() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const location = useLocation(); // Get current route location

  // Check if the current path is the login path
  const isLoginPage =
    location.pathname == `/${APP_PREFIX_PATH}` ||
    location.pathname == `/${APP_PREFIX_PATH}/` ||
    location.pathname == `/${APP_PREFIX_PATH}/forgot-password` ||
    location.pathname == `/${APP_PREFIX_PATH}/reset-password` ||
    location.pathname == `/${APP_PREFIX_PATH}/forgot-password/` ||
    location.pathname == `/${APP_PREFIX_PATH}/reset-password/`;

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };
  console.log("isLoginPage : ", isLoginPage, "location.pathname : ", location.pathname, "APP_PREFIX_PATH : ", APP_PREFIX_PATH);

  return (
    <>
      {/* Render Header only if not on the login page */}
      {!isLoginPage && (
        <Header onToggleSidebar={toggleSidebar} username="John Doe" />
      )}
      <div className="main" style={{ marginTop: isLoginPage ? "0" : "110px" }}>
        {/* Render Sidebar only if not on the login page and it is visible */}
        {!isLoginPage ? (
          <>
            {" "}
            {!isLoginPage && isSidebarVisible && (
              <div className="sidebarWrapper">
                <div className="sidebar">
                  <Sidebar />
                </div>
              </div>
            )}
          </>
        ) : (
          <></>
        )}

        {/* Main Content: full width if on the login page, otherwise adjust */}
        <div
          className={
            isSidebarVisible && !isLoginPage
              ? "main-content"
              : "main-content w-100 ms-0"
          }
        >
          <div className="content">
            <Routes>
              {/* Define Routes */}
              <Route path={`${APP_PREFIX_PATH}/`} element={<Login />} />
              <Route
                path={`${APP_PREFIX_PATH}/forgot-password`}
                element={<ForgotPassword />}
              />
              <Route
                path={`${APP_PREFIX_PATH}/reset-password`}
                element={<ResetPassword />}
              />
              <Route
                path={`${APP_PREFIX_PATH}/dashboard`}
                element={<Dashboard />}
              />
               <Route
                path={`${APP_PREFIX_PATH}/teacher_attendance`}
                element={<ManageTeacherAttendance />}
              />
              <Route
                path={`${APP_PREFIX_PATH}/users`}
                element={<UsersList />}
              />
              <Route
                path={`${APP_PREFIX_PATH}/manage-quiz`}
                element={<ManageQuiz />}
              />
              <Route
                path={`${APP_PREFIX_PATH}/add-quiz`}
                element={<AddQuiz />}
              />
              <Route
                path={`${APP_PREFIX_PATH}/edit-quiz/:quiz_id`}
                element={<EditQuiz />}
              />
               <Route
                path={`${APP_PREFIX_PATH}/edit-course/:courseId`}
                element={<EditCourse />}
              />
              <Route
                path={`${APP_PREFIX_PATH}/view-quiz/:quiz_id`}
                element={<ViewQuiz />}
              />
              <Route
                path={`${APP_PREFIX_PATH}/manage-teacher`}
                element={<ManageTeacher />}
              />
              <Route
                path={`${APP_PREFIX_PATH}/add-teacher`}
                element={<AddTeacher />}
              />
              <Route
                path={`${APP_PREFIX_PATH}/classes`}
                element={<ManageClass />}
              />
              <Route
                path={`${APP_PREFIX_PATH}/broadcast`}
                element={<ManageBroadcast />}
              />
              <Route
                path={`${APP_PREFIX_PATH}/profile`}
                element={<Profile />}
              />
              <Route
                path={`${APP_PREFIX_PATH}/ManageSubject`}
                element={<ManageSubject />}
              />
              <Route
                path={`${APP_PREFIX_PATH}/view-order/:order_id`}
                element={<ViewOrder />}
              />
              <Route
                path={`${APP_PREFIX_PATH}/view-user/:user_id`}
                element={<ViewUser />}
              />
              <Route
                path={`${APP_PREFIX_PATH}/manage-banner`}
                element={<ManageBanner />}
              />
              <Route
                path={`${APP_PREFIX_PATH}/manage-contact`}
                element={<ManageContact />}
              />
              <Route
                path={`${APP_PREFIX_PATH}/manage-content`}
                element={<ManageContent />}
              />
              <Route
                path={`${APP_PREFIX_PATH}/manage-product`}
                element={<ManageSubscription />}
              />

<Route
                path={`${APP_PREFIX_PATH}/add-course`}
                element={<AddCourse />}
              />

              <Route
                path={`${APP_PREFIX_PATH}/quote`}
                element={<ManageQuote />}
              />

              <Route
                path={`${APP_PREFIX_PATH}/manage-course`}
                element={<ManageCourse />}
              />
              <Route
                path={`${APP_PREFIX_PATH}/add-product`}
                element={<AddProduct />}
              />
              <Route
                path={`${APP_PREFIX_PATH}/view-course/:course_id`}
                element={<ViewCourse
                />}
              />
              <Route
                path={`${APP_PREFIX_PATH}/edit-product/:product_id`}
                element={<EditProduct />}
              />
              <Route
                path={`${APP_PREFIX_PATH}/view-product/:product_id`}
                element={<ViewProduct />}
              />
              <Route
                path={`${APP_PREFIX_PATH}/review`}
                element={<ManageReview />}
              />
              <Route
                path={`${APP_PREFIX_PATH}/manage-timetable`}
                element={<ManageCommission />}
              />
              <Route
                path={`${APP_PREFIX_PATH}/view-timetable/:channel_name`}
                element={<ViewTimetable />}
              />
              <Route
                path={`${APP_PREFIX_PATH}/view-result/:quiz_id`}
                element={<ViewResult />}
              />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
