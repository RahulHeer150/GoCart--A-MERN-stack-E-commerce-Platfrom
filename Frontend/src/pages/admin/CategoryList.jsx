/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { MdDelete, MdEdit, MdError } from "react-icons/md";
import adminApi from "../../api/adminApi";
import { AppContext } from "../../context/AppContext";
import { motion } from "framer-motion";
import Loading from "../../components/Loading";

const CategoryList = () => {
  const { toast, navigate } = useContext(AppContext);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await adminApi.get("/categories");
      if (response.status === 200) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Failed to fetch categories"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      const response = await adminApi.delete(`/categories/${id}`);
      if (response.status === 200) {
        toast.success(response.data.message);
        fetchCategories();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete category");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Loading Screen
  if (loading) {
    return <Loading />;
  }

  // Empty State
  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[95vh] text-gray-500">
        <MdError className="text-5xl text-gray-400 mb-3" />
        <p className="text-lg font-medium">
          Oops! There are no categories to show.
        </p>
      </div>
    );
  }

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-auto bg-gray-50 py-10 px-4 md:px-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Manage Categories
          </h2>
          <p className="text-gray-500 text-sm">
            View, edit, or delete product categories on the platform.
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/add-category")}
          className="bg-emerald-600 text-white px-5 py-2 rounded-md font-medium hover:bg-emerald-700 transition"
        >
          + Add Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 cursor-pointer">
        {categories.map((category, index) => (
          <motion.div
            key={category._id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
          >
            {/* Image */}
            <div className="relative">
              <img
                src={category.image}
                alt={category.name}
                className=" block mx-auto w-40 h-40 object-cover rounded-t-xl hover:scale-105 transition duration-300"
              />
              <div
                className="absolute top-2 right-2 w-6 h-6 rounded-full shadow-md"
                style={{ backgroundColor: category.color }}
                title={`Category Color: ${category.color}`}
              ></div>
            </div>

            {/* Info */}
            <div className="p-4 flex flex-col items-center text-center">
              <h3 className="font-semibold text-gray-800 text-lg truncate w-full">
                {category.name}
              </h3>

              <div className="flex items-center justify-center gap-4 mt-4 text-xl">
                <MdEdit
                  onClick={() => {
                    navigate(`/admin/categories/${category._id}`);
                    scrollTo(0, 0);
                  }}
                  className="text-emerald-600 hover:text-emerald-700 cursor-pointer transition hover:scale-105 duration-300"
                  title="Edit Category"
                />
                <MdDelete
                  onClick={() => handleDeleteCategory(category._id)}
                  className="text-red-500 hover:text-red-600 cursor-pointer transition hover:scale-105 duration-300"
                  title="Delete Category"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
