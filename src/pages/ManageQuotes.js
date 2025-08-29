/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-sequences */
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { API_URL, APP_PREFIX_PATH } from "../config/AppConfig";
import Breadcrumbs from "../components/Breadcrumbs";
import { Modal } from "react-bootstrap";

function ManageQuote() {
  const [quote, setQuote] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const token = sessionStorage.getItem('token');

  React.useEffect(() => {
    // Fetch the current quote from the API (assuming endpoint exists)
    axios.get(`${API_URL}/get_quote`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => {
        if (response.data && response.data.quote) {
          setQuote(response.data.quote.quotes);
        }
      })
      .catch((error) => {
        console.error("Error fetching quote", error);
      });
  }, [token]);

  const handleUpdateQuote = () => {
    if (!quote.trim()) {
      setToastMessage("Quote cannot be empty");
      setShowModal(true);
      setTimeout(() => setShowModal(false), 2000);
      return;
    }
    axios.post(`${API_URL}/update_quote`, { quote }, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        setToastMessage("Quote updated successfully");
        setShowModal(true);
        setTimeout(() => setShowModal(false), 2000);
      })
      .catch((error) => {
        setToastMessage("Error updating quote");
        setShowModal(true);
        setTimeout(() => setShowModal(false), 2000);
        console.error(error);
      });
  };

  const breadcrumbItems = [
    { label: "Dashboard", path: `/${APP_PREFIX_PATH}/dashboard` },
    { label: "Manage Quote", path: `/${APP_PREFIX_PATH}/manage-quote` },
  ];

  return (
    <div className="container mt-5">
      <Breadcrumbs title="Manage Quote" items={breadcrumbItems} />
      <div className="mc-card p-4">
        <div className="mb-3">
          <label className="form-label">Quote</label>
          <textarea
            className="form-control"
            value={quote}
            onChange={e => setQuote(e.target.value)}
            placeholder="Enter Quote"
            rows={4}
          />
        </div>
        <button className="btn btn-danger end" onClick={handleUpdateQuote}>
          Update Quote
        </button>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header>
          <Modal.Title>Update</Modal.Title>
        </Modal.Header>
        <Modal.Body>{toastMessage}</Modal.Body>
      </Modal>
    </div>
  );
}

export default ManageQuote;
