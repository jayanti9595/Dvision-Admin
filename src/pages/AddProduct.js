import React, { useEffect, useState } from "react";
import { API_URL, APP_PREFIX_PATH } from "../config/AppConfig";
import Breadcrumbs from "../components/Breadcrumbs";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
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
  const [productNoteHindiError, setProductNoteHindiError] = useState("");
  const [productNoteEnglish, setProductNoteEnglish] = useState("");
  const [productNoteEnglishError, setProductNoteEnglishError] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [productQuantityError, setProductQuantityError] = useState("");
  const [imagesError, setImagesError] = useState("");
  const [categoryError, setCategroyError] = useState("");
  const [subCategoriesId, setSubCategoryId] = useState("");
  const [subCategoryIdError, setSubCategroyError] = useState("");
  const [productPriceWholesale, setProductPriceWholesheel] = useState("");
  const [productPriceWholesaleError, setProductPriceWholesheelError] = useState("");
  const [companyNameHindi, setCompanyNameHindi] = useState('');
  const [companyNameHindiError, setCompanyNameHindiError] = useState('');
  const [companyNameEnglishError,setCompanyNameEnglishError] = useState('');
  const [companyNameEnglish,setCompanyNameEnglish] = useState('');
  const [productSacNo, setProductSACNo] = useState('');
  const [productSACNoError, setProductSACNOError] = useState('')
  var navigate = useNavigate();

  const breadcrumbItems = [
    { label: "Dashboard", path: `/${APP_PREFIX_PATH}/dashboard` },
    { label: "Add Product", path: `/${APP_PREFIX_PATH}/add-product` },
  ];

  useEffect(() => {
    axios
      .get(API_URL + "/get_category?user_id=1")
      .then((response) => {
        if (response.data.success) {
          console.log("response.data.category_arr : ", response.data.category_arr);

          setCategoryData(response.data.category_arr);
        }
      })
      .catch((error) => {
        console.error("Error fetching category data:", error);
      });
  }, []);

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);

    if (categoryId) {
      axios
        .get(`${API_URL}/get_subcategory?category_id=${categoryId}`)
        .then((response) => {
          if (response.data.success) {
            setCategroyError(""); // Clear category error
            setSubCategoryData(response.data.subcategory_arr); // Set subcategories
            setSubCategoryId(""); // Reset selected subcategory
            console.log("subCategories : ",subCategories);
          }
          
          
        })
        .catch((error) => {
          console.error("Error fetching subcategory data:", error);
        });
    } else {
      setSubCategoryData([]); // Clear subcategories if no category selected
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const HandleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;

    if (!productNameEnglish) {
      setProductNameEnglishError('Please Enter Product Name English');
      hasError = true;
    } else {
      setProductNameEnglishError('');
    }
    if (!productSacNo) {
      setProductSACNOError('Please Enter SAC No.');
      hasError = true;
    } else {
      setProductSACNOError('');
    }
    // if (!companyNameEnglish) {
    //   setCompanyNameEnglishError('Please Enter Company Name English');
    //   hasError = true;
    // } else {
    //   setCompanyNameEnglishError('');
    // }
    // if (!companyNameHindi) {
    //   setCompanyNameHindiError('Please Enter Company Name Hindi');
    //   hasError = true;
    // } else {
    //   setCompanyNameHindiError('');
    // }
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
    if (!productPriceWholesale) {
      setProductPriceWholesheelError('Please Enter Product Price Wholesale');
      hasError = true;
    } else {
      setProductPriceWholesheelError('');
    }
    if (!productQuantity) {
      setProductQuantityError('Please Enter Product Price');
      hasError = true;
    } else {
      setProductQuantityError('');
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
    // if (!productNoteEnglish) {
    //   setProductNoteEnglishError('Please Select Product Images');
    //   hasError = true;
    // } else {
    //   setProductNoteEnglishError('');
    // }
    // if (!productNoteHindi) {
    //   setProductNoteHindiError('Please Select Product Images');
    //   hasError = true;
    // } else {
    //   setProductNoteHindiError('');
    // }
    if (!selectedCategory) {
      setCategroyError('Please Select category');
      hasError = true;
    } else {
      setCategroyError("")
    }
    // if (!subCategoriesId) {
    //   setSubCategroyError('Please Select category');
    //   hasError = true;
    // } else {
    //   setSubCategroyError("")
    // }
    if (hasError) {
      return
    }

    const data = new FormData();
    data.append('name_en', productNameEnglish);
    data.append('name_hi', productNameHindi);
    data.append('price', productPrice);
    data.append('price_wholesale', productPriceWholesale);
    data.append('quantity', productQuantity);
    data.append('category_id', selectedCategory);
    data.append('subcategory_id', subCategoriesId);
    data.append('description', productDescriptionEnglish);
    data.append('description_hi', productDescriptionHindi);
    data.append('note_hi', productNoteHindi);
    data.append('note_en', productNoteEnglish);
    data.append('company_name_hindi', companyNameHindi);
    data.append('company_name_english', companyNameEnglish);
    data.append('sac_no', productSacNo);
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
      <Breadcrumbs title="Add Product" items={breadcrumbItems} />
      <div className="mc-card">
        <form onSubmit={HandleSubmit}>
          <div className="row mb-4 mt-2 flex-wrap">
            {/* Product Name */}
            <div className="mb-3 form-group col-lg-6">
              <label htmlFor="productName" className="form-label">
                Product Name (English)
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

            {/* Product Name (Hindi) */}
            <div className="mb-3 form-group col-lg-6">
              <label htmlFor="productNameHindi" className="form-label">
                Product Name (Hindi)
              </label>
              <input
                value={productNameHindi}
                type="text"
                className="form-control"
                id="productNameHindi"
                placeholder="Enter Product Name in Hindi"
                onChange={(e) => { setProductNameHindi(e.target.value); setProductNameHindiError("") }}
              />
              {productNameHindiError && <span className="text-danger">{productNameHindiError}</span>}

            </div>

            {/* <div className="mb-3 form-group col-lg-6">
              <label htmlFor="productNameHindi" className="form-label">
                Address
              </label>
              <input
                value={address}
                type="text"
                className="form-control"
                id="productNameHindi"
                placeholder="Enter Address"
                onChange={(e) => { setAddress(e.target.value); setAddressError("") }}
              />
              {addressError && <span className="text-danger">{addressError}</span>}

            </div> */}

            <div className="mb-3 form-group col-lg-6">
              <label htmlFor="productNameHindi" className="form-label">
                Company Name (Hindi)
              </label>
              <input
                value={companyNameHindi}
                type="text"
                className="form-control"
                id="productNameHindi"
                placeholder="Enter company Name in Hindi"
                onChange={(e) => { setCompanyNameHindi(e.target.value); setCompanyNameHindiError("") }}
              />
              {companyNameHindiError && <span className="text-danger">{companyNameHindiError}</span>}

            </div>
            <div className="mb-3 form-group col-lg-6">
              <label htmlFor="productNameHindi" className="form-label">
                Company Name (English)
              </label>
              <input
                value={companyNameEnglish}
                type="text"
                className="form-control"
                id="productNameHindi"
                placeholder="Enter Company Name in English"
                onChange={(e) => { setCompanyNameEnglish(e.target.value); setCompanyNameEnglishError("") }}
              />
              {companyNameEnglishError && <span className="text-danger">{companyNameEnglishError}</span>}

            </div>

            {/* Category */}
            <div className="mb-3 form-group col-lg-6">
              <label htmlFor="category" className="form-label">
                Category
              </label>
              <select
                className="form-control"
                id="category"
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <option value="" disabled>Select Category</option>
                {categories.map((category) => (
                  <option key={category.category_id} value={category.category_id}>
                    {category.category_name_en + "(" + category.category_name_hi + ")"}
                  </option>
                ))}
              </select>
              {categoryError && <span className="text-danger">{categoryError}</span>}
            </div>

            <div className="mb-3 form-group col-lg-6">
              <label htmlFor="subcategory" className="form-label">
                Sub Category
              </label>
              <select
                value={subCategoriesId}
                onChange={(e) => {
                  setSubCategoryId(e.target.value);
                  setSubCategroyError("");
                }}
                className="form-control"
                id="subcategory"
              >
                <option value="" disabled>
                  Select Sub Category
                </option>
                {subCategories.map((subcategory) => (
                  <option key={subcategory.subcategory_id} value={subcategory.subcategory_id}>
                    {subcategory.sub_name_en + " (" + subcategory.sub_name_hi + ")"}
                  </option>
                ))}
              </select>
              {subCategoryIdError && <span className="text-danger">{subCategoryIdError}</span>}
            </div>

      <div className="mb-3 form-group col-lg-6">
        <label htmlFor="price" className="form-label">
          Price (₹)
        </label>
        <input
          value={productPrice}
          type="number"
          className="form-control"
          id="price"
          placeholder="Enter Price"
          min="0"
          onChange={(e) => { setProductPrice(e.target.value); setProductPriceError("") }}
        />
        {productPriceError && <span className="text-danger">{productPriceError}</span>}
      </div>

      <div className="mb-3 form-group col-lg-6">
        <label htmlFor="price" className="form-label">
          Price Wholesale (₹)
        </label>
        <input
          value={productPriceWholesale}
          type="number"
          className="form-control"
          id="price"
          placeholder="Enter Price"
          min="0"
          onChange={(e) => { setProductPriceWholesheel(e.target.value); setProductPriceWholesheelError("") }}
        />
        {productPriceWholesaleError && <span className="text-danger">{productPriceWholesaleError}</span>}
      </div>

      {/* Quantity */}
      <div className="mb-3 form-group col-lg-6">
        <label htmlFor="quantity" className="form-label">
          Quantity
        </label>
        <input
          value={productQuantity}
          type="number"
          className="form-control"
          id="quantity"
          placeholder="Enter Quantity"
          min="1"
          onChange={(e) => { setProductQuantity(e.target.value); setProductQuantityError("") }}
        />
        {productQuantityError && <span className="text-danger">{productQuantityError}</span>}
      </div>

      <div className="mb-3 form-group col-lg-6">
        <label htmlFor="quantity" className="form-label">
          SAC No.
        </label>
        <input
          value={productSacNo}
          type="text"
          className="form-control"
          id="quantity"
          placeholder="Enter SAC No"
          min="1"
          onChange={(e) => { setProductSACNo(e.target.value); setProductSACNOError("") }}
        />
        {productSACNoError && <span className="text-danger">{productSACNoError}</span>}
      </div>


      {/* Preview Images */}
      <div className="mb-3 col-lg-12">
        <label className="form-label">Selected Images :</label>
        <div className="d-flex flex-wrap gap-2">
          {images.map((image, index) => (
            <img
              key={index}
              src={URL.createObjectURL(image)}
              alt={`Preview ${index}`}
              className="img-thumbnail"
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
          ))}
        </div>
      </div>

      {/* Multiple Image Upload */}
      <div className="mb-3 col-lg-12">
        <label htmlFor="productImages" className="form-label">
          Product Images
        </label>
        <input
          type="file"
          className="form-control"
          id="productImages"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />
        {imagesError && <span className="text-danger">{imagesError}</span>}
      </div>

      <div className="mb-3 col-lg-12">
        <label htmlFor="productDescription" className="form-label">
          Product Description (English)
        </label>
        <textarea
          value={productDescriptionEnglish}
          className="form-control"
          id="productDescription"
          rows="3"
          placeholder="Enter Product Description (Hindi)"
          onChange={(e) => { setProductDescriptionEnglish(e.target.value); setProductDescriptionEnglishError("") }}

        ></textarea>
        {productDescriptionEnglishError && <span className="text-danger">{productDescriptionEnglishError}</span>}
      </div>

      <div className="mb-3 col-lg-12">
        <label htmlFor="productDescription" className="form-label">
          Product Description (Hindi)
        </label>
        <textarea
          value={productDescriptionHindi}
          className="form-control"
          id="productDescription"
          rows="3"
          placeholder="Enter Product Description (Hindi)"
          onChange={(e) => { setProductDescriptionHindi(e.target.value); setProductDescriptionHindiError("") }}
        ></textarea>
        {productDescriptionHindiError && <span className="text-danger">{productDescriptionHindiError}</span>}
      </div>

      <div className="mb-3 col-lg-12">
        <label htmlFor="productDescription" className="form-label">
          Product Note (English)
        </label>
        <textarea
          value={productNoteEnglish}
          className="form-control"
          id="productDescription"
          rows="3"
          placeholder="Enter Product Note (English)"
          onChange={(e) => { setProductNoteEnglish(e.target.value); setProductNoteEnglishError("") }}
        ></textarea>
        {productNoteEnglishError && <span className="text-danger">{productNoteEnglishError}</span>}
      </div>



      {/* Description */}
      <div className="mb-3 col-lg-12">
        <label htmlFor="productDescription" className="form-label">
          Product Note (Hindi)
        </label>
        <textarea
          value={productNoteHindi}
          className="form-control"
          id="productDescription"
          rows="3"
          placeholder="Enter Product Note (Hindi)"
          onChange={(e) => { setProductNoteHindi(e.target.value); setProductNoteHindiError("") }}
        ></textarea>
        {productNoteHindiError && <span className="text-danger">{productNoteHindiError}</span>}
      </div>

      <div className="col-lg-12">
        <button type="submit" className="btn btn-primary">
          Add Product
        </button>
      </div>
    </div>
    </form >
      </div >
    </div >
  );
};

export default AddProduct;
