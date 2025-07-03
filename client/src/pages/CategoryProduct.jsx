
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useCart } from "../context/Cart";
import "../styles/CategoryProductStyles.css";

const CategoryProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState({});
  const [cart, setCart] = useCart();



  useEffect(() => {
    if (params?.id) getProductsByCategory();
  }, [params?.id]);

  const getProductsByCategory = async () => {
    try {
      const { data } = await axios.get(
        `https://e-commerce-9t1e.onrender.com/api/category/single-category/${params.id}`
      );
      if (data?.success) {
        setProducts(data.products || []);
        setCategory(data.getSingle || {});
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load category products");
    }
  };

  return (
    <Layout>
      <div className="container mt-3 category">
        <h4 className="text-center">Category - {category?.name}</h4>

        {category?.image?.url && (
          <div className="text-center mb-3">
            {category?.image && (
              <div className="text-center mb-3">
                <img
                  src={
                    typeof category.image === "string"
                      ? category.image
                      : category.image?.url
                  }
                  alt={category.name}
                  style={{ height: "200px", objectFit: "contain" }}
                />
              </div>
            )}
          </div>
        )}
        
        <h6 className="text-center">{products?.length} result(s) found</h6>

        <div className="row">
          <div className="col-md-9 offset-1">
            <div className="d-flex flex-wrap">
              {products?.map((p) => (
                <div className="card m-2" key={p._id}>
                  {p.image?.map((img, i) => (
                    <img
                      key={i}
                      src={img.url}
                      height={"200px"}
                      className="card-img-top mb-2"
                      alt={`Product ${p.name} - ${i + 1}`}
                    />
                  ))}
                  <div className="card-body">
                    <div className="card-name-price">
                      <h5 className="card-title">{p.name}</h5>
                      <h5 className="card-title card-price">
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
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryProduct;

