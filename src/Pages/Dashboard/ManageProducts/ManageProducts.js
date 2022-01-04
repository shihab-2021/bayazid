import { CircularProgress, Rating } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ManageProducts.css";
import StarIcon from "@mui/icons-material/AccessAlarm";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // const product = useSelector((state) => state);
  const dispatch = useDispatch();
  const fetchProducts = async () => {
    const response = await axios
      .get("http://localhost:5000/services")
      .catch((err) => {
        console.log("error", err);
      });
    setIsLoading(false);
    dispatch(setProducts(response.data.result));
  };
  useEffect(() => {
    fetchProducts();
  }, [!products]);
  const handleDeleteProduct = (id) => {
    const proceed = window.confirm("Are you sure, you want to delete?", id);
    console.log(id);
    if (proceed) {
      const url = `http://localhost:5000/services/${id}`;
      fetch(url, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.deletedCount > 0) {
            console.log(id);
            alert("Deleted Successfully!");
            const remainingProducts = products.filter(
              (product) => product._id !== id
            );
            setProducts(remainingProducts);
          }
        });
    }
  };
  return (
    <div className="container">
      <h1 className="heading text-primary">MANAGE PRODUCTS</h1>
      {isLoading && (
        <div className="d-flex align-items-center my-5 py-5">
          <CircularProgress className="mx-auto" />
        </div>
      )}
      {!isLoading && (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-2 py-5">
          {products.map((singleProduct) => (
            <div key={singleProduct._id} className="col">
              <div>
                <div className="card shadow" style={{ minHeight: "515px" }}>
                  <div className="d-flex justify-content-center align-items-center">
                    <img
                      src={singleProduct.img1}
                      className="manage-img img-fluid p-1"
                      alt="..."
                    />
                  </div>
                  <div className="card-body border-top">
                    <h5 className="card-title fw-bold">
                      {singleProduct.name?.slice(0, 50)}
                    </h5>
                    <h6 className="card-title">
                      {singleProduct.title?.slice(0, 50)}
                    </h6>
                    <h5>${singleProduct.price}</h5>
                    <Rating
                      style={{ fontSize: "15px" }}
                      name="half-rating-read"
                      value={`${singleProduct.rating}`}
                      precision={0.5}
                      readOnly
                    />
                  </div>
                  <div
                    className="d-flex"
                    style={{ backgroundColor: "#dbe3e3" }}
                  >
                    <Link
                      to={`/details/${singleProduct._id}`}
                      className="w-50 text-center my-2 link"
                    >
                      <button className="btn btn-outline-success">
                        Detail <i className="fas fa-info-circle"></i>
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDeleteProduct(singleProduct._id)}
                      type="button"
                      className="align-self-center btn btn-outline-danger mx-auto"
                    >
                      Delete <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
