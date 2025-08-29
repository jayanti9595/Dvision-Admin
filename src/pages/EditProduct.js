/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { API_URL, APP_PREFIX_PATH } from "../config/AppConfig";
import Breadcrumbs from "../components/Breadcrumbs";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { decode as base64_decode } from 'base-64';

const EditProduct = () => {
  const { product_id } = useParams();
  const pro_id = base64_decode(product_id);
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
  const [companyNameEnglishError, setCompanyNameEnglishError] = useState('');
  const [companyNameEnglish, setCompanyNameEnglish] = useState('');
  const [productSacNo, setProductSACNo] = useState('');
  const [productSACNoError, setProductSACNOError] = useState('')
  
  const navigate = useNavigate();

  const breadcrumbItems = [
    { label: "Dashboard", path: `/${APP_PREFIX_PATH}/dashboard` },
    { label: "Edit Product", path: `/${APP_PREFIX_PATH}/edit-product` },
  ];

  const user_id = localStorage.getItem("id");

  // Fetch product details on load
  useEffect(() => {
    axios
      .get(`${API_URL}/get_Product_Detail_Admin?user_id=${user_id}&product_id=${pro_id}`)
      .then((response) => {
        if (response.data.success) {
          const prod = response.data.product_arr;
          setCompanyNameEnglish(prod.company_name_en);
          setCompanyNameHindi(prod.company_name_en); // It seems you are setting both the same value. Adjust if needed.
          setProductPriceWholesheel(prod.price_wholesale);
          setProductPrice(prod.price);
          setSelectedCategory(prod.category_id);
          setProductQuantity(prod.quantity);
          setProductNameEnglish(prod.product_en);
          setProductDescriptionHindi(prod.description_hi);
          setProductDescriptionEnglish(prod.description);
          setProductNoteHindi(prod.note_hi);
          setProductNoteEnglish(prod.note_en);
          setProductNameEnglish(prod.name_en);
          setProductNameHindi(prod.name_hi);
          setSubCategoryId(prod.subcategory_id);
          setProductSACNo(prod.sac_no)
          // setImages(prod.product_image_arr);
        }
      })
      .catch((error) => {
        console.log("Error : ", error);
      });
  }, []);

  // Fetch categories on load
  useEffect(() => {
    axios
      .get(API_URL + "/get_category?user_id=1")
      .then((response) => {
        if (response.data.success) {
          setCategoryData(response.data.category_arr);
        }
      })
      .catch((error) => {
        console.error("Error fetching category data:", error);
      });
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      axios
        .get(`${API_URL}/get_subcategory?category_id=${selectedCategory}`)
        .then((response) => {
          if (response.data.success) {
            setCategroyError("");
            setSubCategoryData(response.data.subcategory_arr);
          }
        })
        .catch((error) => {
          console.error("Error fetching subcategory data:", error);
        });
    } else {
      setSubCategoryData([]);
    }
  }, [selectedCategory]);

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const HandleSubmit = async (e) => {
    console.log('values', e);

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
      setProductQuantityError('Please Enter Product Quantity');
      hasError = true;
    } else {
      setProductQuantityError('');
    }
    if (!productDescriptionEnglish) {
      setProductDescriptionEnglishError('Please Enter Product Description (English)');
      hasError = true;
    } else {
      setProductDescriptionEnglishError('');
    }
    if (!productDescriptionHindi) {
      setProductDescriptionHindiError('Please Enter Product Description (Hindi)');
      hasError = true;
    } else {
      setProductDescriptionHindiError('');
    }
    // if (!images || images.length === 0) {
    //   setImagesError('Please Select Product Images');
    //   hasError = true;
    // } else {
    //   setImagesError('');
    // }
    // if (!productNoteEnglish) {
    //   setProductNoteEnglishError('Please Enter Product Note (English)');
    //   hasError = true;
    // } else {
    //   setProductNoteEnglishError('');
    // }
    // if (!productNoteHindi) {
    //   setProductNoteHindiError('Please Enter Product Note (Hindi)');
    //   hasError = true;
    // } else {
    //   setProductNoteHindiError('');
    // }
    if (!selectedCategory) {
      setCategroyError('Please Select Category');
      hasError = true;
    } else {
      setCategroyError("");
    }
    if (!subCategoriesId) {
      setSubCategroyError('Please Select Sub Category');
      hasError = true;
    } else {
      setSubCategroyError("");
    }
    if (hasError) {
      return;
    }

    const data = new FormData();
    data.append("product_id", pro_id);
    data.append("name_en", productNameEnglish);
    data.append("name_hi", productNameHindi);
    data.append("price", productPrice);
    data.append("price_wholesale", productPriceWholesale);
    data.append("quantity", productQuantity);
    data.append("category_id", selectedCategory);
    data.append("subcategory_id", subCategoriesId);
    data.append("description", productDescriptionEnglish);
    data.append("description_hi", productDescriptionHindi);
    data.append("note_hi", productNoteHindi);
    data.append("note_en", productNoteEnglish);
    data.append("company_name_hindi", companyNameHindi);
    data.append("company_name_english", companyNameEnglish);
    data.append('sac_no', productSacNo);

    if (images && images.length > 0) {
      images.forEach((image) => {
        data.append("image", image);
      });
    }
    try {
      const res = await axios.post(`${API_URL}/edit_product`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data.success) {
        navigate(`/${APP_PREFIX_PATH}/manage-product`);
      } else {
        console.log("Error editing product");
      }
    } catch (error) {
      console.error("Error while editing product:", error);
    }
  };

  return (
    <div className="container mt-5">
      <Breadcrumbs title="Edit Product" items={breadcrumbItems} />
      <div className="mc-card">
        <form onSubmit={HandleSubmit}>
          <div className="row mb-4 mt-2 flex-wrap">
            {/* Product Name (English) */}
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
                onChange={(e) => {
                  setProductNameEnglish(e.target.value);
                  setProductNameEnglishError("");
                }}
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
                onChange={(e) => {
                  setProductNameHindi(e.target.value);
                  setProductNameHindiError("");
                }}
              />
              {productNameHindiError && <span className="text-danger">{productNameHindiError}</span>}
            </div>

            {/* Company Name (Hindi) */}
            <div className="mb-3 form-group col-lg-6">
              <label htmlFor="companyNameHindi" className="form-label">
                Company Name (Hindi)
              </label>
              <input
                value={companyNameHindi}
                type="text"
                className="form-control"
                id="companyNameHindi"
                placeholder="Enter Company Name in Hindi"
                onChange={(e) => {
                  setCompanyNameHindi(e.target.value);
                  setCompanyNameHindiError("");
                }}
              />
              {companyNameHindiError && <span className="text-danger">{companyNameHindiError}</span>}
            </div>

            {/* Company Name (English) */}
            <div className="mb-3 form-group col-lg-6">
              <label htmlFor="companyNameEnglish" className="form-label">
                Company Name (English)
              </label>
              <input
                value={companyNameEnglish}
                type="text"
                className="form-control"
                id="companyNameEnglish"
                placeholder="Enter Company Name in English"
                onChange={(e) => {
                  setCompanyNameEnglish(e.target.value);
                  setCompanyNameEnglishError("");
                }}
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
                    {category.category_name_en} ({category.category_name_hi})
                  </option>
                ))}
              </select>
              {categoryError && <span className="text-danger">{categoryError}</span>}
            </div>

            {/* Sub Category */}
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
                    {subcategory.sub_name_en} ({subcategory.sub_name_hi})
                  </option>
                ))}
              </select>
              {subCategoryIdError && <span className="text-danger">{subCategoryIdError}</span>}
            </div>

            {/* Price */}
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
                onChange={(e) => {
                  setProductPrice(e.target.value);
                  setProductPriceError("");
                }}
              />
              {productPriceError && <span className="text-danger">{productPriceError}</span>}
            </div>

            {/* Wholesale Price */}
            <div className="mb-3 form-group col-lg-6">
              <label htmlFor="priceWholesale" className="form-label">
                Price Wholesale (₹)
              </label>
              <input
                value={productPriceWholesale}
                type="number"
                className="form-control"
                id="priceWholesale"
                placeholder="Enter Wholesale Price"
                min="0"
                onChange={(e) => {
                  setProductPriceWholesheel(e.target.value);
                  setProductPriceWholesheelError("");
                }}
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
                onChange={(e) => {
                  setProductQuantity(e.target.value);
                  setProductQuantityError("");
                }}
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
            {/* <div className="mb-3 col-lg-12">
              <label className="form-label">Selected Images :</label>
              <div className="d-flex flex-wrap gap-2">
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(image.image)}
                    alt={`Preview ${index}`}
                    className="img-thumbnail"
                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                  />
                ))}
              </div>
            </div> */}

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
              {/* {imagesError && <span className="text-danger">{imagesError}</span>} */}
            </div>

            {/* Product Description (English) */}
            <div className="mb-3 col-lg-12">
              <label htmlFor="productDescriptionEnglish" className="form-label">
                Product Description (English)
              </label>
              <textarea
                value={productDescriptionEnglish}
                className="form-control"
                id="productDescriptionEnglish"
                rows="3"
                placeholder="Enter Product Description (English)"
                onChange={(e) => {
                  setProductDescriptionEnglish(e.target.value);
                  setProductDescriptionEnglishError("");
                }}
              ></textarea>
              {productDescriptionEnglishError && <span className="text-danger">{productDescriptionEnglishError}</span>}
            </div>

            {/* Product Description (Hindi) */}
            <div className="mb-3 col-lg-12">
              <label htmlFor="productDescriptionHindi" className="form-label">
                Product Description (Hindi)
              </label>
              <textarea
                value={productDescriptionHindi}
                className="form-control"
                id="productDescriptionHindi"
                rows="3"
                placeholder="Enter Product Description (Hindi)"
                onChange={(e) => {
                  setProductDescriptionHindi(e.target.value);
                  setProductDescriptionHindiError("");
                }}
              ></textarea>
              {productDescriptionHindiError && <span className="text-danger">{productDescriptionHindiError}</span>}
            </div>

            {/* Product Note (English) */}
            <div className="mb-3 col-lg-12">
              <label htmlFor="productNoteEnglish" className="form-label">
                Product Note (English)
              </label>
              <textarea
                value={productNoteEnglish}
                className="form-control"
                id="productNoteEnglish"
                rows="3"
                placeholder="Enter Product Note (English)"
                onChange={(e) => {
                  setProductNoteEnglish(e.target.value);
                  setProductNoteEnglishError("");
                }}
              ></textarea>
              {productNoteEnglishError && <span className="text-danger">{productNoteEnglishError}</span>}
            </div>

            {/* Product Note (Hindi) */}
            <div className="mb-3 col-lg-12">
              <label htmlFor="productNoteHindi" className="form-label">
                Product Note (Hindi)
              </label>
              <textarea
                value={productNoteHindi}
                className="form-control"
                id="productNoteHindi"
                rows="3"
                placeholder="Enter Product Note (Hindi)"
                onChange={(e) => {
                  setProductNoteHindi(e.target.value);
                  setProductNoteHindiError("");
                }}
              ></textarea>
              {productNoteHindiError && <span className="text-danger">{productNoteHindiError}</span>}
            </div>

            <div className="col-lg-12">
              <button type="submit" className="btn btn-primary">
                Edit Product
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;


