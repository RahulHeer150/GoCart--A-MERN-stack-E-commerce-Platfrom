/* eslint-disable react-hooks/exhaustive-deps */
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useSelector } from "react-redux";
import { selectAllProducts } from "../features/products/productSlice";
import userApi from "../api/userApi";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";

const ProductCategory = () => {
  const products = useSelector(selectAllProducts);
  const { category } = useParams();
  const { toast } = useContext(AppContext);

  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await userApi.get("/categories");
      if (response.status === 200) {
        setCategories(response.data.data);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const searchCategory = categories.find(
    (item) => item.path.toLowerCase() === category.toLowerCase()
  );

  const filteredProducts = products.filter(
    (product) => product.category.path.toLowerCase() === category.toLowerCase()
  );

  console.log(filteredProducts);
  return (
    <div className="mt-16">
      {searchCategory && (
        <div className="flex flex-col items-end w-max">
          <p className="text-2xl font-medium">
            {searchCategory.name.toUpperCase()}
          </p>
          <div className="w-16 h-0.5 bg-emerald-600 rounded-full"></div>
        </div>
      )}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 mt-6 justify-items-center">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-2xl font-medium text-emerald-600">
            No products found for this category
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductCategory;
