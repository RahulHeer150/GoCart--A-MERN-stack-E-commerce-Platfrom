import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import { useSelector } from "react-redux";
import { selectAllProducts } from "../features/products/productSlice";

const AllProducts = () => {
  const products = useSelector(selectAllProducts);
  const searchQuery = useSelector((state) => state.ui.searchQuery);

  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (searchQuery.length > 0) {
      setFilteredProducts(
        products.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredProducts(products);
    }
  }, [products, searchQuery]);

  const sortedProducts = useMemo(
    () =>
      [...(filteredProducts ||[])].sort((a, b) => b.stockQuantity - a.stockQuantity),
    [filteredProducts]
  );
  return (
    <div className="mt-16 flex flex-col">
      <div className="flex flex-col items-end w-max">
        <p className="text-2xl font-medium uppercase">ALL PRODUCTS</p>
        <div className="w-16 h-0.5 bg-emerald-600 rounded-full "></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 mt-6 justify-items-center">
        {sortedProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default AllProducts;
