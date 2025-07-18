
import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Modal } from "antd";
import CategoryForm from "../../components/Form/CategoryForm";

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedCategory, setUpdatedCategory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("https://e-commerce-9t1e.onrender.com/api/category/create", {
        category,
      });
      if (data?.success) {
        toast.success(`${category} created successfully`);
        setCategory("");
        getAllCategory();
      }
    } catch (error) {
      toast.error("Failed to create category");
    }
  };

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("https://e-commerce-9t1e.onrender.com/api/category/get-all");
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `https://e-commerce-9t1e.onrender.com/api/category/update/${selected._id}`,
        { category: updatedCategory }
      );
      if (data.success) {
        toast.success(`${updatedCategory} updated successfully`);
        setVisible(false);
        setSelected(null);
        setUpdatedCategory("");
        getAllCategory();
      }
    } catch (error) {
      toast.error("Failed to update category");
    }
  };

  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(`https://e-commerce-9t1e.onrender.com/api/category/delete/${id}`);
      if (data.success) {
        toast.success("Category deleted");
        getAllCategory();
      }
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  return (
    <Layout title="Dashboard - Create Category">
  <div className="container-fluid m-3 p-1 dashboard "> 
      <div className="row p-3">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1>Create Category</h1>
          <CategoryForm handleSubmit={handleSubmit} value={category} setValue={setCategory} />
          <table className="table w-75 mt-4">
            <thead>
              <tr>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories?.map((c) => (
                <tr key={c._id}>
                  <td>{c.category}</td>
                  <td>
                    <button
                      className="btn btn-primary me-2"
                      onClick={() => {
                        setVisible(true);
                        setUpdatedCategory(c.category);
                        setSelected(c);
                      }}
                    >
                      Edit
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDelete(c._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Modal open={visible} onCancel={() => setVisible(false)} footer={null}>
            <CategoryForm
              value={updatedCategory}
              setValue={setUpdatedCategory}
              handleSubmit={handleUpdate}
            />
          </Modal>
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default CreateCategory;
