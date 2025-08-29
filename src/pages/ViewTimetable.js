/* eslint-disable eqeqeq */
import React, { useEffect, useState } from 'react';
import '../assets/css/users.scss';
import { API_URL, APP_PREFIX_PATH, IMAGE_PATH } from "../config/AppConfig";
import Breadcrumbs from "../components/Breadcrumbs";
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ViewTimetable = () => {
  const { channel_name } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
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
      setStudents(res.data?.students || []);
    }).catch(() => {
      setStudents([]);
      setError('Failed to fetch joined users');
    }).finally(() => setLoading(false));
  }, [channel_name]);

  return (
    <div className="container mt-5">
      <Breadcrumbs title="Joined Users" items={breadcrumbItems} />
      <div className="mc-card">
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
                {students && students.length > 0 ? (
                  students.map((s, idx) => (
                    <tr key={s.user_id || idx}>
                      <td>{idx + 1}</td>
                      <td><img src={s.image != null
                    ? `${IMAGE_PATH}${s.image}`
                    : `${IMAGE_PATH}placeholder.png`} style={{ width: '60px', height: '60px', borderRadius: '50%' }} /></td>
                      <td>{s.name || 'NA'}</td>
                      <td>{s.mobile || s.phone || 'NA'}</td>
                      <td>{s.join_time || 'NA'}</td>
                      <td>{s.createtime || 'NA'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No users joined.</td>
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


