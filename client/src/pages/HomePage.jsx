
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/auth";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import { useCart } from "../context/Cart";
import toast from "react-hot-toast";
import "../styles/HomepageStyles.css"


const HomePage = () => {
  const navigate = useNavigate()
  const [auth, setAuth] = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useCart();

  // Get all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("https://e-commerce-9t1e.onrender.com/api/category/get-all");
      if (data?.success) {
        setCategories(data?.categories);
      }
    } catch (error) {
      console.log(error);

    }
  };

  // Fetch total product count
  const getTotal = async () => {
    try {
      const { data } = await axios.get("https://e-commerce-9t1e.onrender.com/api/product/product-count");
      setTotal(data?.total || 0);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`https://e-commerce-9t1e.onrender.com/api/product/product-list/${page}`);
      setLoading(false);
      setProducts(data.products || []);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  // Load more
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`https://e-commerce-9t1e.onrender.com/api/product/product-list/${page}`);
      setLoading(false);
      setProducts((prev) => [...prev, ...data?.products]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // Filter handler
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
    setPage(1); // optional: reset page on filter
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);


  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);

  useEffect(() => {
    if (!checked.length || !radio.length) getAllProducts();
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
  }, [checked, radio]);

  //get filterd product
  const filterProduct = async () => {
    try {
      const { data } = await axios.post("https://e-commerce-9t1e.onrender.com/api/product/product-filters", {
        checked,
        radio,
      });
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Layout title="All Products - Best offers"  >
      <div className="image">
        <img src="/images/banner.png" alt="Banner" height="500px" width="100%" />
      </div>
      <div className="container-fluid row mt-3 home-page">
        <div className="row ">
          <div className="col-md-2 mt-3  col-md-3 filters  ">
            <h4 className="text-center">Filter By Category</h4>
            <div className="d-flex flex-wrap  my-2 justify-content-start">
              {categories?.map((c) => (
                <div key={c._id} className="form-check">
                  <Checkbox onChange={(e) => handleFilter(e.target.checked, c._id)}>
                    {c.category}
                  </Checkbox>
                </div>
              ))}
            </div>
            <h4 className="text-center mt-4  ">Filter By Price</h4>
            <div className="d-flex flex-column">
              <Radio.Group onChange={e => setRadio(e.target.value)}>
                {Prices?.map((p, index) => (
                  <Radio key={index} value={p.array}>
                    {p.name}
                  </Radio>
                ))}
              </Radio.Group>
            </div>

            <div className="d-flex flex-column">
              <button
                className="btn btn-danger"
                onClick={() => window.location.reload()}
              >
                RESET FILTERS
              </button>
            </div>


          </div>
          <div className="col-md-9">
            <h1 className="text-center">All Products</h1>
            <div className="d-flex flex-wrap">
              {products?.map((p) => (
                <div key={p._id} className="card m-2" style={{ width: "18rem" }}>
                  {p.image?.map((img, i) => (
                    <img
                      key={i}
                      src={img.url}
                      height={"200px"}
                      className="card-img-top mb-2"
                      alt={`Product ${p.name} - ${i + 1}`}
                    />
                  ))}
                  <div className="card-body   ">
                    <div className="card-name-price d-flex justify-content-between align-items-center">
                      <h5 className="card-title ">{p.name}</h5>
                      <h5 className="card-price">
                        {p.price.toLocaleString("en-IN", {
                          style: "currency",
                          currency: "INR",
                        })}
                      </h5>
                    </div>
                    <p className="card-text">
                      {p.description?.substring(0, 60)}...
                    </p>
                    <div className="card-name-price">
                      <button
                        className="btn btn-info ms-1"
                        onClick={() => navigate(`/product/${p._id}`)}
                      >
                        More Details
                      </button>

                      <button
                        className="btn btn-dark ms-1"
                        onClick={() => {
                          setCart([...cart, p]);
                          localStorage.setItem("cart", JSON.stringify([...cart, p]));
                          toast.success("Item added to cart");
                        }}
                      >
                        ADD TO CART
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {products && products.length < total && (
              <div className="text-center m-4">
                <button
                  className="btn btn-warning"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage((prev) => prev + 1);
                  }}
                >
                  {loading ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
export default HomePage;
