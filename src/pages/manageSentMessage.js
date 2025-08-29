import React, { useEffect, useState } from "react";
import { API_URL, APP_PREFIX_PATH } from "../config/AppConfig";
import Breadcrumbs from "../components/Breadcrumbs";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const SentMesssage = () => {
    const [categories, setCategoryData] = useState([]);
    const [subCategories, setSubCategoryData] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [images, setImages] = useState([]);
    const [productNameHindi, setProductNameHindi] = useState("");
    const [productNameHindiError, setProductNameHindiError] = useState("");
    const [productNameEnglish, setProductNameEnglish] = useState("");
    const [productNameEnglishError, setProductNameEnglishError] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [productPriceError, setProductPriceError] = useState("");
    const [productDescriptionHindi, setProductDescriptionHindi] = useState("");
    const [productDescriptionHindiError, setProductDescriptionHindiError] = useState("");
    const [productDescriptionEnglish, setProductDescriptionEnglish] = useState("");
    const [productDescriptionEnglishError, setProductDescriptionEnglishError] = useState("");
    const [productNoteHindi, setProductNoteHindi] = useState("");
    const [productNoteEnglish, setProductNoteEnglish] = useState("");
    const [productNoteEnglishError, setProductNoteEnglishError] = useState("");
    const [productQuantityError, setProductQuantityError] = useState("");
    const [imagesError, setImagesError] = useState("");
    const [categoryError, setCategroyError] = useState("");
    const [subCategoriesId, setSubCategoryId] = useState("");
    const [productPriceWholesale, setProductPriceWholesheel] = useState("");
    const [companyNameHindi, setCompanyNameHindi] = useState('');
    const [companyNameEnglish, setCompanyNameEnglish] = useState('');
    const [productSacNo, setProductSACNo] = useState('');
    var navigate = useNavigate();
    const breadcrumbItems = [
        { label: "Dashboard", path: `/${APP_PREFIX_PATH}/dashboard` },
        { label: "Sent Message", path: `/${APP_PREFIX_PATH}/add-product` },
    ];
    const handleCategoryChange = (e) => {
        const categoryId = e.target.value;
        setSelectedCategory(categoryId);
        if (categoryId) {
            axios
                .get(`${API_URL}/get_subcategory?category_id=${categoryId}`)
                .then((response) => {
                    if (response.data.success) {
                        setCategroyError("");
                        setSubCategoryData(response.data.subcategory_arr);
                        setSubCategoryId("");
                        console.log("subCategories : ", subCategories);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching subcategory data:", error);
                });
        } else {
            setSubCategoryData([]);
        }
    };
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
    };
    const HandleSubmit = async (e) => {
        e.preventDefault();
        let hasError = false;
        if (!productNameHindi) {
            setProductNameHindiError('Please Enter Product Name Hindi');
            hasError = true;
        } else {
            setProductNameHindiError('');
        }
        if (!productPrice) {
            setProductPriceError('Please Enter Product Price');
            hasError = true;
        } else {
            setProductPriceError('');
        }

        if (!productDescriptionEnglish) {
            setProductDescriptionEnglishError('Please Enter Product Description');
            hasError = true;
        } else {
            setProductDescriptionEnglishError('');
        }
        if (!productDescriptionHindi) {
            setProductDescriptionHindiError('Please Enter Product Description');
            hasError = true;
        } else {
            setProductDescriptionHindiError('');
        }
        if (!images) {
            setImagesError('Please Select Product Images');
            hasError = true;
        } else {
            setImagesError('');
        }
        
        if (hasError) {
            return
        }
        const data = new FormData();
        data.append('title', productNameEnglish);
        data.append('message', productNameHindi);
        data.append('price', productPrice);
        if (images && images.length > 0) {
            images.forEach((image) => {
                data.append('image', image);
            });
        }
        const res = await axios.post(`${API_URL}/add_product`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        if (res.data.success) {
            setProductDescriptionEnglish("");
            setProductDescriptionEnglishError("");
            setProductDescriptionHindi("");
            setProductDescriptionHindiError("");
            setProductNameEnglish("");
            setProductNameEnglishError("");
            setProductNameHindi("");
            setProductNameHindiError("");
            setProductNoteEnglish("");
            setProductNoteEnglishError();
            navigate(`/${APP_PREFIX_PATH}/manage-product`);
        } else {
            console.log("error add product : ");
        }
    }
    return (
        <div className="container mt-5">
            <Breadcrumbs title="Sent Message" items={breadcrumbItems} />
            <div className="mc-card">
                <form onSubmit={HandleSubmit}>
                    <div className="row mb-4 mt-2 flex-wrap">
                        <div className="mb-3 form-group col-lg-6">
                            <label htmlFor="productName" className="form-label">
                               Upload Axcle File
                            </label>
                            <input
                                value={productNameEnglish}
                                type="text"
                                className="form-control"
                                id="productName"
                                placeholder="Enter Product Name"
                                onChange={(e) => { setProductNameEnglish(e.target.value); setProductNameEnglishError("") }}
                            />
                            {productNameEnglishError && <span className="text-danger">{productNameEnglishError}</span>}
                        </div>
                        <div className="mb-3 col-lg-12">
                            <label htmlFor="productDescription" className="form-label">
                                Title
                            </label>
                            <textarea
                                value={productDescriptionEnglish}
                                className="form-control"
                                id="productDescription"
                                rows="3"
                                placeholder="Enter Title"
                                onChange={(e) => { setProductDescriptionEnglish(e.target.value); setProductDescriptionEnglishError("") }}
                            ></textarea>
                            {productDescriptionEnglishError && <span className="text-danger">{productDescriptionEnglishError}</span>}
                        </div>
                        <div className="mb-3 col-lg-12">
                            <label htmlFor="productDescription" className="form-label">
                                Description
                            </label>
                            <textarea
                                value={productDescriptionHindi}
                                className="form-control"
                                id="productDescription"
                                rows="3"
                                placeholder="Enter Description"
                                onChange={(e) => { setProductDescriptionHindi(e.target.value); setProductDescriptionHindiError("") }}
                            ></textarea>
                            {productDescriptionHindiError && <span className="text-danger">{productDescriptionHindiError}</span>}
                        </div>
                        <div className="col-lg-12">
                            <button type="submit" className="btn btn-primary">
                                Send Messagge
                            </button>
                        </div>
                    </div>
                </form >
            </div >
        </div >
    );
};
export default SentMesssage;
