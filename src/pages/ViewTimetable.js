// /* eslint-disable eqeqeq */
// import React, { useEffect, useState } from 'react';
// import '../assets/css/users.scss';
// import { API_URL, APP_PREFIX_PATH, IMAGE_PATH } from "../config/AppConfig";
// import Breadcrumbs from "../components/Breadcrumbs";
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const ViewTimetable = () => {
//   const { channel_name } = useParams();
//   const navigate = useNavigate();
//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const token = sessionStorage.getItem('token');

//   const breadcrumbItems = [
//     { label: "Dashboard", path: `/${APP_PREFIX_PATH}/dashboard` },
//     { label: "Timetable", path: `/${APP_PREFIX_PATH}/manage-timetable` },
//     { label: "Joined Users", path: `/${APP_PREFIX_PATH}/view-timetable/${channel_name}` },
//   ];

//   useEffect(() => {
//     if (!channel_name) return;
//     setLoading(true);
//     setError('');
//     axios.get(`${API_URL}/get_join_users_time_tables?channel_name=${channel_name}`, {
//       headers: { Authorization: `Bearer ${token}` }
//     }).then(res => {
//       if (res.data?.key === 'authenticateFailed') {
//         sessionStorage.clear();
//         navigate(`/${APP_PREFIX_PATH}/`);
//         return;
//       }
//       setStudents(res.data?.students || []);
//     }).catch(() => {
//       setStudents([]);
//       setError('Failed to fetch joined users');
//     }).finally(() => setLoading(false));
//   }, [channel_name]);

//   return (
//     <div className="container mt-5">
//       <Breadcrumbs title="Joined Users" items={breadcrumbItems} />
//       <div className="mc-card">
//         {loading ? (
//           <div className="p-3">Loading...</div>
//         ) : error ? (
//           <div className="p-3 text-danger">{error}</div>
//         ) : (
//           <div className="mc-table-responsive">
//             <table className="table">
//               <thead className='table-head'>
//                 <tr>
//                   <th>S No.</th>
//                   <th>Image</th>
//                   <th>Name</th>
//                   <th>Mobile</th>
//                   <th>Join Time</th>
//                   <th>Create Time</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {students && students.length > 0 ? (
//                   students.map((s, idx) => (
//                     <tr key={s.user_id || idx}>
//                       <td>{idx + 1}</td>
//                       <td><img src={s.image != null
//                     ? `${IMAGE_PATH}${s.image}`
//                     : `${IMAGE_PATH}placeholder.png`} style={{ width: '60px', height: '60px', borderRadius: '50%' }} /></td>
//                       <td>{s.name || 'NA'}</td>
//                       <td>{s.mobile || s.phone || 'NA'}</td>
//                       <td>{s.join_time || 'NA'}</td>
//                       <td>{s.createtime || 'NA'}</td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="6">No users joined.</td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ViewTimetable;


/* eslint-disable eqeqeq */
import React, { useEffect, useState } from 'react';
import '../assets/css/users.scss';
import { API_URL, APP_PREFIX_PATH, IMAGE_PATH } from "../config/AppConfig";
import Breadcrumbs from "../components/Breadcrumbs";
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ViewTimetable = () => {
  const { channel_name } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const token = sessionStorage.getItem('token');

  const breadcrumbItems = [
    { label: "Dashboard", path: `/${APP_PREFIX_PATH}/dashboard` },
    { label: "Timetable", path: `/${APP_PREFIX_PATH}/manage-timetable` },
    { label: "Joined Users", path: `/${APP_PREFIX_PATH}/view-timetable/${channel_name}` },
  ];

  useEffect(() => {
    if (!channel_name) return;
    setLoading(true);
    setError('');
    axios.get(`${API_URL}/get_join_users_time_tables?channel_name=${channel_name}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      if (res.data?.key === 'authenticateFailed') {
        sessionStorage.clear();
        navigate(`/${APP_PREFIX_PATH}/`);
        return;
      }
      const data = res.data?.students || [];
      setStudents(data);
      setFilteredStudents(data);
    }).catch(() => {
      setStudents([]);
      setFilteredStudents([]);
      setError('Failed to fetch joined users');
    }).finally(() => setLoading(false));
  }, [channel_name]);

  // 🔍 Search filter
  // 🔍 Safe Search filter (replace your current useEffect for search/filter)
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredStudents(students);
      return;
    }

    const lower = searchTerm.toLowerCase();

    const filtered = students.filter(s => {
      const name = (s.name ?? '').toString().toLowerCase();
      const mobile = (s.mobile ?? s.phone ?? '').toString().toLowerCase();
      const joinTime = (s.join_time ?? '').toString().toLowerCase();

      return (
        name.includes(lower) ||
        mobile.includes(lower) ||
        joinTime.includes(lower)
      );
    });

    setFilteredStudents(filtered);
  }, [searchTerm, students]);


  // ⬇️ Export filtered data to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredStudents.map((s, idx) => ({
        "S No.": idx + 1,
        "Name": s.name ?? "NA",
        "Mobile": String(s.mobile || "NA"),
        "Join Time": s.join_time ?? "NA",
        "Create Time": s.createtime ?? "NA",
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Joined Users");
    const excelBuffer = XLSX.write(workbook, { type: "array", bookType: "xlsx" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `JoinedUsers_${channel_name}.xlsx`);
  };

  return (
    <div className="container mt-5">
      <Breadcrumbs title="Joined Users" items={breadcrumbItems} />
      <div className="mc-card p-3">

        {/* 🔍 Search + ⬇️ Download */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <input
            type="text"
            className="form-control w-50"
            placeholder="Search by name or mobile..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
           {filteredStudents.length > 0 ? <><button className="btn btn-success ms-2" onClick={exportToExcel}>
            Download Excel
          </button></> : <></>}
        </div>


        {loading ? (
          <div className="p-3">Loading...</div>
        ) : error ? (
          <div className="p-3 text-danger">{error}</div>
        ) : (
          <div className="mc-table-responsive">
            <table className="table">
              <thead className='table-head'>
                <tr>
                  <th>S No.</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Join Time</th>
                  <th>Create Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents && filteredStudents.length > 0 ? (
                  filteredStudents.map((s, idx) => (
                    <tr key={s.user_id || idx}>
                      <td>{idx + 1}</td>
                      <td>
                        <img
                          src={s.image != null
                            ? `${IMAGE_PATH}${s.image}`
                            : `${IMAGE_PATH}placeholder.png`}
                          style={{ width: '60px', height: '60px', borderRadius: '50%' }}
                          alt="user"
                        />
                      </td>
                      <td>{s.name || 'NA'}</td>
                      <td>{s.mobile || 'NA'}</td>
                      <td>{s.join_time || 'NA'}</td>
                      <td>{s.createtime || 'NA'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewTimetable;
