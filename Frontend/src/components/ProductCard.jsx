import { useContext } from "react";
import { FaStar } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { AppContext } from "../context/AppContext";
import { useDispatch, useSelector } from "react-redux";
import { addAndUpdateCart, selectCartItems } from "../features/cart/cartSlice";

const ProductCard = ({ product }) => {
  const { navigate } = useContext(AppContext);
  const cartItems = useSelector(selectCartItems);
  const dispatch = useDispatch();

  const cartItem = cartItems.find((item) => item.product?._id === product._id);

  return (
    <div
      onClick={() => {
        navigate(
          `/products/${product.category.name.toLowerCase()}/${product._id}`
        );
        scrollTo(0, 0);
      }}
      className="border border-gray-500/20 rounded-md md:px-4 px-3 py-2 bg-white min-w-56 max-w-56 w-full"
    >
      <div className="group cursor-pointer flex items-center justify-center px-2">
        <img
          className="group-hover:scale-105 transition max-w-26 md:max-w-36"
          src={product.images[0]}
          alt={product.name}
        />
      </div>
      <div className="text-gray-500/60 text-sm">
        <p>{product.category.name}</p>
        <p className="text-gray-700 font-medium text-lg truncate w-full">
          {product.name} {product.weight}
          {product.unit}
        </p>
        <p className="text-sm tracking-tighter mb-2">
          {" "}
          From {product.seller?.storeName}
        </p>
        <div className="flex items-center gap-0.5">
          {Array(5)
            .fill("")
            .map((_, i) => (
              <FaStar
                key={i}
                className={`text-lg ${
                  i < 4 ? "text-emerald-500" : "text-emerald-100"
                }`}
              />
            ))}
          <p>(4)</p>
        </div>
        <div className="flex items-end justify-between mt-3">
          {product.offerPrice ? (
            <p className="md:text-xl text-base font-medium text-emerald-600">
              ₹{product.offerPrice}
              {"  "}
              <span className="text-gray-500/60 md:text-sm text-xs line-through">
                ₹{product.price}
              </span>
            </p>
          ) : (
            <p className="md:text-xl text-base font-medium text-emerald-600">
              ₹{product.price}
            </p>
          )}
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="text-emerald-600"
          >
            {!cartItem ? (
              <button
                className="flex items-center justify-center gap-1 bg-emerald-100 border border-emerald-300 md:w-[80px] w-[64px] h-[34px] rounded text-emerald-600 font-medium cursor-pointer"
                onClick={() =>
                  dispatch(addAndUpdateCart({ product, quantity: 1 }))
                }
                disabled={product.stockQuantity === 0}
              >
                <FiShoppingCart className="text-emerald-600 opacity-75 mr-1" />
                Add
              </button>
            ) : (
              <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-emerald-500/25 rounded select-none">
                <button
                  onClick={() => {
                    dispatch(
                      addAndUpdateCart({
                        product,
                        quantity: cartItem.quantity - 1,
                      })
                    );
                  }}
                  className="cursor-pointer text-md px-2 h-full"
                >
                  -
                </button>
                <span className="w-5 text-center">{cartItem.quantity}</span>
                <button
                  onClick={() => {
                    dispatch(
                      addAndUpdateCart({
                        product,
                        quantity: cartItem.quantity + 1,
                      })
                    );
                  }}
                  disabled={cartItem.quantity >= product.stockQuantity}
                  className="cursor-pointer text-md px-2 h-full"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
