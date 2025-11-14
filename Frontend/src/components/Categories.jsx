/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { ApiUrl } from "../constants";

const Categories = () => {
  const { navigate, toast } = useContext(AppContext);
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${ApiUrl}/categories`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setCategories(response.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Can't fetch categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="mt-16">
      <p className="text-2xl md:text-3xl font-medium">Categories</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 mt-6 gap-6">
        {categories
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((category) => (
            <div
              key={category._id}
              className="group cursor-pointer py-5 px-3 gap-2 rounded-lg flex flex-col justify-center items-center"
              style={{ backgroundColor: category.color }}
              onClick={() => {
                navigate(`/products/${category.path.toLowerCase()}`);
                scrollTo(0, 0);
              }}
            >
              <img
                src={category.image}
                alt={category.name}
                className="group-hover:scale-110 transition max-w-28"
              />
              <p
                className="text-sm
            font-medium"
              >
                {category.name}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Categories;
