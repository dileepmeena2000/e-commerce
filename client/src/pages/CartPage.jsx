// import "../styles/CartStyles.css"
import React, { useEffect, useState } from 'react';
import { useCart } from '../context/Cart';
import { useAuth } from "../context/auth";
import axios from 'axios';
import Layout from '../components/Layout/Layout';
import { useNavigate } from 'react-router-dom';
import DropIn from "braintree-web-drop-in-react";
import { toast } from "react-hot-toast";

import "../styles/HomepageStyles.css"

function CartPage() {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

const totalPrice = () => {
  try {
    let total = 0;
    cart?.forEach(item => {
      total += item.price;
    });

    return total.toLocaleString("en-IN", {
      style: "currency" ,
      currency: "INR",
    });
  } catch (error) {
    console.log("Error calculating total price:", error);
    return "₹0.00";
  }
};


  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex(item => item._id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };


  //get payment gateway token

  const getToken = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/product/braintree/token");
      console.log(data , "Braintree clientToken" );
      setClientToken(data?.clientToken);
    } catch (error) {
      console.error("Failed to get Braintree token:", error);
    }
  };

  useEffect(() => {
    if (auth?.token) getToken();
  }, [auth?.token]);



  const handlePayment = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance?.requestPaymentMethod();
      const { data } = await axios.post("http://localhost:5000/api/product/braintree/payment", {
        nonce,
        cart,
      });

 console.log( data, "instance")

      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("Payment Completed Successfully ");

      console.log("dileep")
    } catch (error) {
      console.log(error);
      setLoading(false);
    }

  };


  return (
    <Layout>
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-2 mb-1">
              {!auth?.user ? "Hello Guest" : `Hello ${auth.user.name}`}
              <p className="text-center">
                {cart?.length
                  ? `You have ${cart.length} items in your cart ${auth?.token ? "" : "please login to checkout!"}`
                  : "Your Cart is Empty"}
              </p>
            </h1>
          </div>
        </div>

        <div className="row">
          <div className="col-md-7">
            {cart?.map(p => (
              <div className="row card flex-row" key={p._id}>
                <div className="col-md-4">
                  {p.image?.map((img, i) => (
                    <img key={i} src={img.url} height="200px" className="card-img-top mb-2" alt={`Product ${p.name} - ${i + 1}`} />
                  ))}
                </div>
                <div className="col-md-4     ">
                  <h4>{p.name}</h4>
                 <p>{p.description?.substring(0, 30) || "No description available."}</p>

                  <h4 style={{ color: "green", fontWeight: "bold" }}>Price: {p.price}</h4>
                </div>
                <div className="col-md-4 cart-remove-btn">
                  <button className="btn btn-danger mt-5" onClick={() => removeCartItem(p._id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          <div className="col-md-5 cart-summary">
            <h2>Cart Summary</h2>
            <p>Total | Checkout | Payment</p>
            <hr />
            <h4 style={{ color: "green", fontWeight: "bold" }}>Total: {totalPrice()}</h4>

            {auth?.user?.address ? (
              <div className="mb-3">
                <h4>Current Address</h4>
                <h5>{auth.user.address}</h5>
                <button className="btn btn-outline-warning" onClick={() => navigate("/dashboard/user/profile")}>
                  Update Address
                </button>
              </div>
            ) : (
              <div className="mb-3">
                {auth?.token ? (
                  <button className="btn btn-outline-warning" onClick={() => navigate("/dashboard/user/profile")}>
                    Update Address
                  </button>
                ) : (
                  <button className="btn btn-outline-warning" onClick={() => navigate("/login", { state: "/cart" })}>
                    Please log in to checkout
                  </button>
                )}
              </div>
            )}

            <div className="mt-2">
            {!clientToken || !auth?.token || !cart?.length ? (
                  ""
                ) : ( 
              <>
                <DropIn
                  options={{
                    authorization: clientToken,
                    paypal: {
                      flow: "vault",
                    },
                  }}
                  onInstance={(instance) => setInstance(instance)}

                />
                <button
                  className="btn btn-primary"
                  onClick={handlePayment}
                // disabled={loading || !instance || !auth?.user?.address}
                > 
                 {/* Make Payment */}

                  {loading ? "Processing ...." : "Make Payment"}
                </button>
              </>
              )}

            </div>

          </div>
        </div>
      </div>
    </Layout>

  );
}
export default CartPage;


