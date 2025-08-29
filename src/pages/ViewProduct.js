/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from "react";
import "../assets/css/users.scss";
import { API_URL, APP_PREFIX_PATH, IMAGE_PATH } from "../config/AppConfig";
import Breadcrumbs from "../components/Breadcrumbs";
import table from "../assets/images/table.jpg";
import { useParams } from "react-router-dom";
import { decode as base64_decode } from "base-64";
import axios from "axios";

import "./popup.css";
import { Modal } from "react-bootstrap";

const ViewProduct = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [product_detail, setProductData] = useState({});
  const { product_id } = useParams();
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productImageId, setProductImageId] = useState("");

  const breadcrumbItems = [
    { label: "Dashboard", path: `/${APP_PREFIX_PATH}/dashboard` },
    { label: "View Product", path: `/${APP_PREFIX_PATH}/view-product` },
  ];
  var user_id = localStorage.getItem("id");

  var fetchProductDetailData = async () => {
    axios
      .get(
        `${API_URL}/get_Product_Detail_Admin?user_id=${user_id}&product_id=${base64_decode(
          product_id
        )}`
      )
      .then((response) => {
        console.log(
          "response.data.product_detail : ",
          response.data.product_arr
        );
        setProductData(response.data.product_arr);
      })
      .catch((error) => {
        console.log("Error : ", error);
      });
  };

  useEffect(() => {
    fetchProductDetailData();
  }, []);

  const handleImageClick = (imageUrl) => {
    setEnlargedImage(imageUrl);
    setShowImagePopup(true);
  };

  const handleCloseImage = () => {
    setEnlargedImage(null);
    setShowImagePopup(false);
  };

  const handleCrossClick = (product_image_id) => {
    console.log("product_image_id",product_image_id);
    
    setProductImageId(product_image_id);
    setShowDeleteModal(true);
  };

  const deleteProductImage = async () => {
    axios.post(`${API_URL}/delete_product_image`, {product_image_id : productImageId}).then((response) => {
        if(response.data.success) {
            setShowDeleteModal(false);
            fetchProductDetailData();
        }
    }).catch((error) => {
        console.log("Error : ", error);
     });
  };

  return (
    <>
      <div className="container mt-5">
        <Breadcrumbs title="View Product" items={breadcrumbItems} />
        <div className="mc-card">
          <div className="row mt-4 mb-4">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-4">
                  <h6 className="mb-2">Product Name(English) :</h6>
                </div>
                <div className="col-lg-8">
                  <p className="mb-2">{product_detail.name_en || "NA"}</p>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-4">
                  <h6 className="mb-2">Product Name(Hindi) :</h6>
                </div>
                <div className="col-lg-8">
                  <p className="mb-2">{product_detail.name_hi || "NA"}</p>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-4">
                  <h6 className="mb-2">SAC No:</h6>
                </div>
                <div className="col-lg-8">
                  <p className="mb-2">
                    {product_detail.sac_no || "NA"}
                  </p>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-4">
                  <h6 className="mb-2">Company Name(English):</h6>
                </div>
                <div className="col-lg-8">
                  <p className="mb-2">
                    {product_detail.company_name_en || "NA"}
                  </p>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-4">
                  <h6 className="mb-2">Company Name(Hindi):</h6>
                </div>
                <div className="col-lg-8">
                  <p className="mb-2">
                    {product_detail.company_name_hi || "NA"}
                  </p>
                </div>
              </div>

              {/* <div className="row">
                    <div className="col-lg-4">
                        <h6 className="mb-2">Status:</h6>
                    </div>
                    <div className="col-lg-8">
                        <p className="mb-2 ">
                        <button className='active-btn'>
                        Completed
                    </button>
                              
                        </p>
                    </div>
                </div> */}

              <div className="row">
                <div className="col-lg-4">
                  <h6 className="mb-2">Quantity:</h6>
                </div>
                <div className="col-lg-8">
                  <p className="mb-2">{product_detail.quantity || 0}</p>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-4">
                  <h6 className="mb-2">Price Wholesale :</h6>
                </div>
                <div className="col-lg-8">
                  <p className="mb-2">{product_detail.price_wholesale || 0}</p>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-4">
                  <h6 className="mb-2">Price Retail:</h6>
                </div>
                <div className="col-lg-8">
                  <p className="mb-2">{product_detail.price || 0}</p>
                </div>
              </div>

              {/* <div className="row">
                    <div className="col-lg-4">
                        <h6 className="mb-2">Address:</h6>
                    </div>
                    <div className="col-lg-8">
                        <p className="mb-2">{product_detail.address || "NA"}</p>
                    </div>
                </div> */}

              <div className="row">
                <div className="col-lg-4">
                  <h6 className="mb-2">Category:</h6>
                </div>
                <div className="col-lg-8">
                  <p className="mb-2">
                    {product_detail?.category_name?.length > 0
                      ? `${product_detail.category_name[0]} (${product_detail.category_name[1]})`
                      : "NA"}
                  </p>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-4">
                  <h6 className="mb-2">Sub Category:</h6>
                </div>
                <div className="col-lg-8">
                  <p className="mb-2">
                    {product_detail?.subcategory_name?.length > 0
                      ? `${product_detail.subcategory_name[0]} (${product_detail.subcategory_name[1]})`
                      : "NA"}
                  </p>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-4">
                  <h6 className="mb-2">Description(English):</h6>
                </div>
                <div className="col-lg-8">
                  <p className="mb-2">{product_detail.description || "NA"}</p>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-4">
                  <h6 className="mb-2">Description(Hindi):</h6>
                </div>
                <div className="col-lg-8">
                  <p className="mb-2">
                    {product_detail.description_hi || "NA"}
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-4">
                  <h6 className="mb-2">Note(English):</h6>
                </div>
                <div className="col-lg-8">
                  <p className="mb-2">{product_detail.note_en || "NA"}</p>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-4">
                  <h6 className="mb-2">Note(Hindi):</h6>
                </div>
                <div className="col-lg-8">
                  <p className="mb-2">{product_detail.note_hi || "NA"}</p>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-4">
                  <h6 className="mb-2">Create Date & Time:</h6>
                </div>
                <div className="col-lg-8">
                  <p className="mb-2">{product_detail.createtime || 0}</p>
                </div>
              </div>

              {product_detail?.product_image_arr?.length > 0 ? (
                <div className="row address" style={{ marginTop: "20px" }}>
                  <div className="col-lg-4">
                    <h6 className="mb-2">Product Images:</h6>
                  </div>
                  <div className="col-lg-8">
                    <div
                      style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}
                    >
                      {product_detail.product_image_arr.map(
                        (imageObj, index) => (
                          <div
                            style={{
                              position: "relative",
                              display: "inline-block",
                            }}
                          >
                            <img
                              key={imageObj.product_image_id}
                              src={`${IMAGE_PATH}${
                                imageObj.image || "placeholder.png"
                              }`}
                              alt={`Product Image ${index + 1}`}
                              style={{
                                width: "100px",
                                height: "100px",
                                objectFit: "cover",
                                borderRadius: "8px",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                handleImageClick(
                                  `${IMAGE_PATH}${
                                    imageObj.image || "placeholder.png"
                                  }`
                                )
                              }
                            />
                            <span
                              onClick={() => {
                                handleCrossClick(imageObj.product_image_id);
                              }}
                              style={{
                                position: "absolute",
                                top: "5px",
                                right: "5px",
                                backgroundColor: "rgba(0,0,0,0.6)",
                                color: "#fff",
                                borderRadius: "50%",
                                width: "20px",
                                height: "20px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                fontSize: "14px",
                                zIndex: 1,
                              }}
                            >
                              &times;
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
        {showImagePopup && (
          <div
            className="enlarged-image-overlay"
            onClick={handleCloseImage}
            role="button"
            tabIndex={0}
          >
            <span
              className="close-button"
              onClick={handleCloseImage}
              role="button"
              tabIndex={0}
            >
              &times;
            </span>
            <img
              src={enlargedImage}
              alt="Enlarged Image"
              className="enlarged-image"
              style={{ width: "20rem", height: "20rem", objectFit: "cover" }}
            />
          </div>
        )}

        {/* Modal for Image Preview */}
        {isModalOpen && (
          <div
            className="modal-overlay"
            onClick={() => setIsModalOpen(false)}
            style={{ overflowX: "scroll" }}
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <span
                className="modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </span>
              <img src={table} alt="Profile Preview" className="modal-image" />
            </div>
          </div>
        )}
      </div>
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this Product Image?
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-secondary"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </button>
          <button className="btn btn-danger" onClick={deleteProductImage}>
            Delete
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ViewProduct;
