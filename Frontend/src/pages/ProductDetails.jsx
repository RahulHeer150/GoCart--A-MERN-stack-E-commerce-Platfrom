import { useContext, useEffect, useState } from "react";
import { FaStar } from "react-icons/fa6";
import { AppContext } from "../context/AppContext";
import { MdOutlineArrowOutward } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { selectAllProducts } from "../features/products/productSlice";
import { addAndUpdateCart, selectCartItems } from "../features/cart/cartSlice";

const ProductDetails = () => {
  const { navigate, toast } = useContext(AppContext);
  const { id } = useParams();
  const products = useSelector(selectAllProducts);
  const cartItems = useSelector(selectCartItems);
  const dispatch = useDispatch();

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);

  const product = products.find((item) => item._id === id);

  const cartItem = cartItems.find((item) => item.product?._id === product?._id);

  useEffect(() => {
    if (product && products.length > 0) {
      const filtered = products.filter(
        (item) =>
          product.category._id === item.category._id && item._id !== product._id
      );
      setRelatedProducts(filtered.slice(0, 5));
    }
  }, [product, products]);

  useEffect(() => {
    setThumbnail(product?.images[0] ? product.images[0] : null);
  }, [product]);

  if (!product) {
    return (
      <div className="text-2xl text-gray-500 flex items-center justify-center h-[80vh]">
        Product not found or is loading...
      </div>
    );
  }

  return (
    <div className="mt-12 px-4 md:px-10 bg-gray-50/40 pb-20">
      <p className="text-gray-500 text-sm mb-4">
        <Link to="/" className="hover:text-emerald-600">
          Home
        </Link>{" "}
        /
        <Link to="/products" className="hover:text-emerald-600">
          {" "}
          Products
        </Link>{" "}
        /
        <Link
          to={`/products/${product?.category?.path.toLowerCase()}`}
          className="hover:text-emerald-600"
        >
          {" "}
          {product?.category?.name}
        </Link>
        /<span className="text-emerald-600 font-medium"> {product.name}</span>
      </p>

      <div className="flex flex-col md:flex-row gap-16 mt-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex md:flex-col gap-3">
            {product.images.map((image, index) => (
              <div
                key={index}
                onClick={() => setThumbnail(image)}
                className={`rounded-xl border-2 ${
                  thumbnail === image
                    ? "border-emerald-500"
                    : "border-transparent"
                } hover:border-emerald-300 transition cursor-pointer`}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center rounded-2xl shadow-md bg-white p-4 border border-gray-100">
            <img
              src={thumbnail}
              alt={product.name}
              className="w-[320px] md:w-[400px] rounded-lg object-cover"
            />
          </div>
        </div>

        <div className="text-sm w-full md:w-1/2 space-y-4">
          <h1 className="text-3xl font-bold text-gray-800 leading-tight">
            {product.name}
          </h1>
          <p
            onClick={() => {
              navigate(`/view/${product.seller?._id}`);
              scrollTo(0, 0);
            }}
            className="text-gray-500 hover:text-emerald-600 cursor-pointer transition text-base flex items-center gap-1 hover:underline"
          >
            Sold by{" "}
            <span className="font-semibold">{product.seller.storeName}</span>
            <MdOutlineArrowOutward className="text-blue-400" />
          </p>

          <div className="flex items-center gap-1 mt-2">
            {Array(5)
              .fill("")
              .map((_, i) => (
                <FaStar
                  key={i}
                  className={`text-lg ${
                    i < 4 ? "text-emerald-500" : "text-gray-300"
                  }`}
                />
              ))}
            <p className="ml-2 text-gray-600 text-sm">(4.0)</p>
          </div>

          {/* Price */}
          <div className="mt-5">
            {product.offerPrice ? (
              <>
                <p className="text-gray-400 line-through text-base">
                  MRP: ₹{product.price}
                </p>
                <p className="text-3xl font-semibold text-gray-900">
                  ₹{product.offerPrice}
                </p>
              </>
            ) : (
              <p className="text-3xl font-semibold text-gray-900">
                ₹{product.price}
              </p>
            )}
            <p className="text-gray-400 text-xs">(Inclusive of all taxes)</p>
          </div>

          {/* Stock Info */}
          <div className="mt-3">
            {product.stockQuantity === 0 ? (
              <p className="font-semibold text-red-600">Out of Stock </p>
            ) : product.stockQuantity <= 10 ? (
              <p className="font-semibold text-orange-500">
                Only {product.stockQuantity} left in stock!
              </p>
            ) : (
              <p className="font-semibold text-emerald-600">In Stock </p>
            )}
          </div>

          {/* Description */}
          <div className="pt-4">
            <h3 className="font-semibold text-base text-gray-800 mb-1">
              About this product
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              {product.description}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
            <button
              onClick={() => {
                if (product.stockQuantity === 0)
                  return toast.error("Out of stock");
                dispatch(
                  addAndUpdateCart({
                    product,
                    quantity: (cartItem?.quantity || 0) + 1,
                  })
                );
              }}
              className="w-full py-3 font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all shadow-sm"
            >
              Add to Cart
            </button>

            <button
              onClick={() => {
                if (product.stockQuantity === 0)
                  return toast.error("Out of stock");
                dispatch(
                  addAndUpdateCart({
                    product,
                    quantity: (cartItem?.quantity || 0) + 1,
                  })
                );
                navigate("/cart");
                scrollTo(0, 0);
              }}
              className="w-full py-3 font-medium bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-lg hover:scale-[1.02] transition-all shadow-md"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-semibold text-gray-800">
            Related Products
          </h2>
          <div className="w-16 h-1 bg-emerald-600 mx-auto mt-2 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center">
          {relatedProducts
            .filter((p) => p.stockQuantity > 0)
            .map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
        </div>

        <div className="flex justify-center mt-12">
          <button
            onClick={() => {
              navigate("/products");
              scrollTo(0, 0);
            }}
            className="px-8 py-2 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all"
          >
            See More →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
