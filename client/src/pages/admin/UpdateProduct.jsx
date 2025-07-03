
import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
const { Option } = Select;

const UpdateProduct = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [shipping, setShipping] = useState("");
  const [photo, setPhoto] = useState(null);
  const [id, setId] = useState("");
  const [imageUrl, setImageUrl] = useState(""); 

  // Get single product
  const getSingleProduct = async () => {
    try {
      const { data } = await axios.get(
        `https://e-commerce-9t1e.onrender.com/api/product/get-product/${params.id}`
      );
      if (data?.success) {
        const product = data.product;
        setName(product.name);
        setId(product._id);
        setDescription(product.description);
        setPrice(product.price);
        setStock(product.stock);
        setShipping(product.shipping?.toString());
        setCategory(product.category?._id || "");
        setImageUrl(product.image?.url || ""); // if using array: product.image[0]?.url
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load product");
    }
  };

  useEffect(() => {
    getSingleProduct();
  }, []);

  // Get all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("https://e-commerce-9t1e.onrender.com/api/category/get-all");
      if (data?.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  

const handleUpdate = async (e) => {
  e.preventDefault();

  if (!id) {
    toast.error("Product ID not found");
    return;
  }

  try {
    // Step 1: Update product info
    const productData = {
      name,
      description,
      price,
      stock,
      category,
      shipping,
    };

    const { data: updateRes } = await axios.put(
      `https://e-commerce-9t1e.onrender.com/api/product/update-product/${id}`,
      productData
    );

    if (!updateRes.success) {
      return toast.error(updateRes.message || "Product update failed");
    }

    // Step 2: If photo is selected, upload it separately
    if (photo) {
      const imageData = new FormData();
      imageData.append("image", photo);

      const { data: imageRes } = await axios.put(
        `https://e-commerce-9t1e.onrender.com/api/product/image/${id}`,
        imageData
      );

      if (!imageRes.success) {
        return toast.error(imageRes.message || "Image upload failed");
      }
    }

    toast.success("Product updated successfully");
    navigate("/dashboard/admin/products");
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong");
  }
};


  // Handle delete
  const handleDelete = async () => {
    try {
      const answer = window.confirm("Are you sure you want to delete this product?");
      if (!answer) return;

      const { data } = await axios.delete(
        `https://e-commerce-9t1e.onrender.com/api/product/delete/${id}`
      );

      if (data?.success) {
        toast.success("Product deleted successfully");
        navigate("/dashboard/admin/products");
      } else {
        toast.error(data?.message || "Delete failed");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title={"Dashboard - Update Product"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Update Product</h1>
            <div className="m-1 w-75">
              {/* Category Select */}
              <Select
                variant="borderless"
                placeholder="Select a category"
                size="large"
                showSearch
                className="form-select mb-3"
                onChange={(value) => setCategory(value)}
                value={category}
              >
                {categories?.map((c) => (
                  <Option key={c._id} value={c._id}>
                    {c.name || c.category}
                  </Option>
                ))}
              </Select>

              {/* Photo Upload */}
              <div className="mb-3">
                <label className="btn btn-outline-secondary col-md-12">
                  {photo ? photo.name : "Upload Photo"}
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files[0])}
                    hidden
                  />
                </label>
              </div>

              {/* Show Preview */}
              {(photo || imageUrl) && (
                <div className="mb-3 text-center">
                  <img
                    src={photo ? URL.createObjectURL(photo) : imageUrl || null}
                    alt="product"
                    height="200px"
                    className="img img-responsive"
                  />
                </div>
              )}

              {/* Name */}
              <div className="mb-3">
                <input
                  type="text"
                  value={name}
                  placeholder="Write a name"
                  className="form-control"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="mb-3">
                <textarea
                  value={description}
                  placeholder="Write a description"
                  className="form-control"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Price */}
              <div className="mb-3">
                <input
                  type="number"
                  value={price}
                  placeholder="Write a price"
                  className="form-control"
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              {/* Stock */}
              <div className="mb-3">
                <input
                  type="number"
                  value={stock}
                  placeholder="Write stock amount"
                  className="form-control"
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>

              {/* Shipping */}
              <div className="mb-3">
                <Select
                  variant="borderless"
                  placeholder="Select shipping"
                  size="large"
                  className="form-select mb-3"
                  onChange={(value) => setShipping(value)}
                  value={shipping}
                >
                  <Option value="0">No</Option>
                  <Option value="1">Yes</Option>
                </Select>
              </div>

              {/* Buttons */}
              <div className="mb-3">
                <button className="btn btn-primary" onClick={handleUpdate}>
                  UPDATE PRODUCT
                </button>
              </div>
              <div className="mb-3">
                <button className="btn btn-danger" onClick={handleDelete}>
                  DELETE PRODUCT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateProduct;

