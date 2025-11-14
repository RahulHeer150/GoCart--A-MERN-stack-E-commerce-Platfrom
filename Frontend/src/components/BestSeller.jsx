import ProductCard from "./ProductCard";
import { useSelector } from "react-redux";
import { selectAllProducts } from "../features/products/productSlice";

const BestSeller = () => {
  const products = useSelector(selectAllProducts);
  return (
    <div id="bestSeller" className="mt-16">
      <p className="text-2xl md:text-3xl font-medium">Best Sellers</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 mt-6 justify-items-center sm:justify-items-normal">
        {products
          .filter((product) => product.stockQuantity > 0)
          .sort((a, b) => b.stockQuantity - a.stockQuantity)
          .slice(0, 5)
          .map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
      </div>
    </div>
  );
};

export default BestSeller;
