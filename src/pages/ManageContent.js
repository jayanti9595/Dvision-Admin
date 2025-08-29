/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-sequences */
import React, { useState, useMemo, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Typography from "@mui/material/Typography";
import JoditEditor from "jodit-react";
import axios from "axios";
import { API_URL, APP_PREFIX_PATH } from "../config/AppConfig";
import { Breadcrumbs } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Modal } from "react-bootstrap";

function Managecontent() {
  const options = [
    "bold",
    "italic",
    "|",
    "ul",
    "ol",
    "|",
    "font",
    "fontsize",
    "|",
    "outdent",
    "indent",
    "align",
    "|",
    "hr",
    "|",
    "fullsize",
    "brush",
    "|",
    "table",
    "link",
    "|",
    "undo",
    "redo",
    "|",
    "emoji" // if you want to add emoji button
  ];

  // We'll use both activeTab and value together for clarity.
  const tabNames = [
    "About Us",
    "Terms & Conditions",
    "Privacy Policy",
    "Android App Url",
    "Ios App Url",
    "Share App"
  ];

  const [activeTab, setActiveTab] = useState("About Us");
  const [value, setValue] = useState(0);
  const [about, setAbout] = useState("");
  const [hindiAbout, sethindiAbout] = useState("");
  const [terms, setTerms] = useState("");
  const [hindiTerms, sethindiTerms] = useState("");
  const [privacy, setPrivacy] = useState("");
  const [hindiPrivacy, sethindiPrivacy] = useState("");
  const [android, setAndroid] = useState("");
  const [ios, setIos] = useState("");
  const [share, setShare] = useState("");
  const [langValue, setLangValue] = useState(0);
  const [toastMessage, setToastMessage] = useState("");
  const [emptycontent, setEmptyContent] = useState("");
  const [showModal, setShowModal] = useState(false);

  const contentTypes = {
    "About Us": 0,
    "Privacy Policy": 1,
    "Terms & Conditions": 2,
    "Android App Url": 4,
    "Ios App Url": 3,
    "Share App": 5,
  };

  useEffect(() => {
    fetchContent("About Us");
    fetchContent("Terms & Conditions");
    fetchContent("Privacy Policy");
    fetchContent("Android App Url");
    fetchContent("Ios App Url");
    fetchContent("Share App");
  }, []);

  const fetchContent = (contentType) => {
    const contentTypeCode = contentTypes[contentType];
    axios
      .get(`${API_URL}/fetchaboutcontent?contentType=${contentTypeCode}`)
      .then((response) => {
        if (response.data.res && response.data.res.length > 0) {
          switch (contentType) {
            case "About Us":
              setAbout(response.data.res[0].content);
              sethindiAbout(response.data.res[0].content_1);
              break;
            case "Privacy Policy":
              setPrivacy(response.data.res[0].content);
              sethindiPrivacy(response.data.res[0].content_1);
              break;
            case "Terms & Conditions":
              setTerms(response.data.res[0].content);
              sethindiTerms(response.data.res[0].content_1);
              break;
            case "Android App Url":
              setAndroid(response.data.res[0].content);
              break;
            case "Ios App Url":
              setIos(response.data.res[0].content);
              break;
            case "Share App":
              setShare(response.data.res[0].content);
              break;
            default:
              break;
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching content for", contentType, error);
      });
  };

  const config1 = useMemo(
    () => ({
      readonly: false,
      placeholder: "",
      defaultActionOnPaste: "insert_as_html",
      defaultLineHeight: 1.2,
      enter: "div",
      buttons: options,
      statusbar: false,
    }),
    []
  );

  // When a tab button is clicked, update both activeTab and value.
  const handleTabChange = (tab, index) => {
    setActiveTab(tab);
    setValue(index);
  };

  const handleChangeLanguage = (event, newValue) => {
    setLangValue(newValue);
  };

  const handleUpdateContent = (contentType) => {
    let contentStateToUpdate = "";
    switch (contentType) {
      case "About Us":
        contentStateToUpdate = langValue === 0 ? about : hindiAbout;
        break;
      case "Terms & Conditions":
        contentStateToUpdate = langValue === 0 ? terms : hindiTerms;
        break;
      case "Privacy Policy":
        contentStateToUpdate = langValue === 0 ? privacy : hindiPrivacy;
        break;
      case "Android App Url":
        contentStateToUpdate = android;
        break;
      case "Ios App Url":
        contentStateToUpdate = ios;
        break;
      case "Share App":
        contentStateToUpdate = share;
        break;
      default:
        contentStateToUpdate = "";
    }

    if (!contentStateToUpdate.trim()) {
      setEmptyContent("This field could not be empty");
      return;
    } else {
      setEmptyContent("");
    }
    axios
      .post(`${API_URL}/updateContent`, {
        contentType: contentTypes[contentType],
        content: contentStateToUpdate,
        lang:
          contentType === "Share App" ||
            contentType === "Ios App Url" ||
            contentType === "Android App Url"
            ? 0
            : langValue,
      })
      .then(() => {
        setToastMessage(`${contentType} updated successfully`);
        setShowModal(true);
        setTimeout(() => setShowModal(false), 2000);
        setEmptyContent("");
      })
      .catch((error) => {
        console.log(error);
        console.log("Error occurred while updating");
      });
  };

  const breadcrumbItems = [
    { label: "Dashboard", path: `/${APP_PREFIX_PATH}/dashboard` },
    { label: "Manage Content", path: `/${APP_PREFIX_PATH}/manage-content` },
  ];

  return (
    <div className="container mt-5">
      <Breadcrumbs title="Manage Content" items={breadcrumbItems} />
      <div className="mc-card">
        <div className="content-tabs">
          {tabNames.map((tab, index) => (
            <button
              key={tab}
              className={`tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => handleTabChange(tab, index)}
            >
              {tab.toUpperCase().replace("_", " ")}
            </button>
          ))}
        </div>

        <div className="tab-content mt-4">
          {value === 0 && (
            <div className="mt-2">
              {/* <Tabs
                value={langValue}
                onChange={handleChangeLanguage}
                TabIndicatorProps={{ style: { backgroundColor: "#f47b1e" } }}
                aria-label="content management tabs"
              >

                <Tab label="English" style={{ color: '#f47b1e' }} />
                <Tab label="Hindi" style={{ color: '#f47b1e' }} />
              </Tabs> */}
              <Typography variant="body1" gutterBottom className="mt-3">
                About Us
              </Typography>
              {langValue === 0 ? (
                <JoditEditor
                  value={about}
                  config={config1}
                  onChange={(htmlString) => {
                    setAbout(htmlString);
                    setEmptyContent("");
                  }}
                />
              ) : (
                <JoditEditor
                  value={hindiAbout}
                  config={config1}
                  onChange={(htmlString) => {
                    sethindiAbout(htmlString);
                    setEmptyContent("");
                  }}
                />
              )}
              <br />
              <p style={{ color: "red" }}>{emptycontent}</p>
              <button
                className="btn mt-2" style={{ background: "#f47b1e", color: '#fff', border: 'none' }}
                onClick={() => handleUpdateContent("About Us")}
              >
                Update
              </button>
            </div>
          )}

          {value === 1 && (
            <div className="mt-2">
             {/* <Tabs
                value={langValue}
                onChange={handleChangeLanguage}
                TabIndicatorProps={{ style: { backgroundColor: "#f47b1e" } }}
                aria-label="content management tabs"
              >

                <Tab label="English" style={{ color: '#f47b1e' }} />
                <Tab label="Hindi" style={{ color: '#f47b1e' }} />
              </Tabs> */}
              <Typography variant="body1" gutterBottom className="mt-3">
                Terms & Conditions
              </Typography>
              {langValue === 0 ? (
                <JoditEditor
                  value={terms}
                  config={config1}
                  onChange={(htmlString) => {
                    setTerms(htmlString);
                    setEmptyContent("");
                  }}
                />
              ) : (
                <JoditEditor
                  value={hindiTerms}
                  config={config1}
                  onChange={(htmlString) => {
                    sethindiTerms(htmlString);
                    setEmptyContent("");
                  }}
                />
              )}
              <br />
              <p style={{ color: "red" }}>{emptycontent}</p>
              <button
                className="btn mt-2" style={{ background: "#f47b1e", color: '#fff', border: 'none' }}
                onClick={() => handleUpdateContent("Terms & Conditions")}
              >
                Update
              </button>
            </div>
          )}

          {value === 2 && (
            <div className="mt-2">
              {/* <Tabs
                value={langValue}
                onChange={handleChangeLanguage}
                TabIndicatorProps={{ style: { backgroundColor: "#f47b1e" } }}
                aria-label="content management tabs"
              >

                <Tab label="English" style={{ color: '#f47b1e' }} />
                <Tab label="Hindi" style={{ color: '#f47b1e' }} />
              </Tabs> */}
              <Typography variant="body1" gutterBottom className="mt-3">
                Privacy Policy
              </Typography>
              {langValue === 0 ? (
                <JoditEditor
                  value={privacy}
                  config={config1}
                  onChange={(htmlString) => {
                    setPrivacy(htmlString);
                    setEmptyContent("");
                  }}
                />
              ) : (
                <JoditEditor
                  value={hindiPrivacy}
                  config={config1}
                  onChange={(htmlString) => {
                    sethindiPrivacy(htmlString);
                    setEmptyContent("");
                  }}
                />
              )}
              <br />
              <p style={{ color: "red" }}>{emptycontent}</p>
              <button
                className="btn mt-2" style={{ background: "#f47b1e", color: '#fff', border: 'none' }}
                onClick={() => handleUpdateContent("Privacy Policy")}
              >
                Update
              </button>
            </div>
          )}

          {value === 3 && (
            <div className="mt-4">
              <Typography variant="body1" gutterBottom>
                Android App URL
              </Typography>
              <input
                type="text"
                className="form-control"
                value={android}
                onChange={(e) => {
                  setAndroid(e.target.value);
                  setEmptyContent("");
                }}
                placeholder="Enter Android App URL"
              />
              <br />
              <p style={{ color: "red" }}>{emptycontent}</p>
              <button
                className="btn mt-2" style={{ background: "#f47b1e", color: '#fff', border: 'none' }}
                onClick={() => handleUpdateContent("Android App Url")}
              >
                Update
              </button>
            </div>
          )}

          {value === 4 && (
            <div className="mt-4">
              <Typography variant="body1" gutterBottom>
                IOS App URL
              </Typography>
              <input
                type="text"
                className="form-control"
                value={ios}
                onChange={(e) => {
                  setIos(e.target.value);
                  setEmptyContent("");
                }}
                placeholder="Enter IOS App URL"
              />
              <br />
              <p style={{ color: "red" }}>{emptycontent}</p>
              <button
                className="btn mt-2" style={{ background: "#f47b1e", color: '#fff', border: 'none' }}
                onClick={() => handleUpdateContent("Ios App Url")}
              >
                Update
              </button>
            </div>
          )}

          {value === 5 && (
            <div className="mt-4">
              <Typography variant="body1" gutterBottom>
                Share App
              </Typography>
              <textarea
                rows={6}
                type="text"
                className="form-control"
                value={share}
                onChange={(e) => {
                  setShare(e.target.value);
                  setEmptyContent("");
                }}
                placeholder="Enter Share App URL"
              />
              <br />
              <p style={{ color: "red" }}>{emptycontent}</p>
              <button
                className="btn mt-2 btn-primary" style={{ background: "#f47b1e", color: '#fff', border: 'none' }}
                onClick={() => handleUpdateContent("Share App")}
              >
                Update
              </button>
            </div>
          )}
        </div>
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

export default Managecontent;
