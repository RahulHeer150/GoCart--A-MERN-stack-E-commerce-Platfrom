import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { MdError, MdEdit, MdDelete } from "react-icons/md";
import sellerApi from "../../api/sellerApi";
import { useSelector } from "react-redux";
import Loading from "../../components/Loading";
import { motion } from "framer-motion";

const ProductList = () => {
  const { toast, navigate } = useContext(AppContext);
  const sellerData = useSelector((state) => state.auth.sellerData);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const response = await sellerApi.get("/sellers/me/products");
      if (response.status === 200) {
        setProducts(response.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await sellerApi.delete(`/products/${productId}`);
      if (response.status === 200) {
        toast.success(response.data.message);
        fetchProducts();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete product");
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Account Status Guard ---
  if (sellerData?.status === "Pending") {
    return (
      <div className="flex h-[95vh] items-center justify-center w-full">
        <div className="flex items-center gap-3 bg-yellow-100 text-yellow-800 px-6 py-4 rounded-md shadow-md max-w-2xl">
          <MdError className="text-3xl" />
          <p className="text-base font-medium">
            Your account is under review. You’ll be notified upon approval.
          </p>
        </div>
      </div>
    );
  }

  if (sellerData?.status === "Rejected") {
    return (
      <div className="flex h-[95vh] items-center justify-center w-full">
        <div className="flex items-center gap-3 bg-red-100 text-red-700 px-6 py-4 rounded-md shadow-md max-w-2xl">
          <MdError className="text-3xl" />
          <p className="text-base font-medium">
            Your seller account was not approved. Please contact support.
          </p>
        </div>
      </div>
    );
  }

  // --- Loading State ---
  if (loading) {
    return <Loading />;
  }

  // --- No Products ---
  if (products.length === 0) {
    return (
      <div className="flex h-[90vh] items-center justify-center flex-col gap-4 text-center">
        <MdError className="text-5xl text-gray-400" />
        <p className="text-gray-600 font-medium text-lg">
          You haven't uploaded any products yet.
        </p>
        <button
          onClick={() => navigate("/seller/add-product")}
          className="bg-emerald-600 text-white px-5 py-2 rounded-md hover:bg-emerald-700 transition"
        >
          Add Product
        </button>
      </div>
    );
  }

  // --- Product List UI ---
  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-auto bg-gray-50">
      <div className="md:p-10 p-4 space-y-6 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            All Products ({products.length})
          </h2>
          <button
            onClick={() => navigate("/seller/add-product")}
            className="bg-emerald-600 text-white px-5 py-2.5 rounded-md hover:bg-emerald-700 transition"
          >
            + Add Product
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Product</th>
                <th className="px-6 py-3 text-left font-semibold">Category</th>
                <th className="px-6 py-3 text-left font-semibold">Stock</th>
                <th className="px-6 py-3 text-left font-semibold">Price</th>
                <th className="px-6 py-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, idx) => (
                <motion.tr
                  key={product._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border-t border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img
                      src={product.images[0]}
                      alt="Product"
                      className="w-14 h-14 rounded-md object-cover border"
                    />
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-800">
                        {product.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {product._id.slice(-8).toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {product.category.name}
                  </td>
                  <td
                    className={`px-6 py-4 font-medium ${
                      product.stockQuantity === 0
                        ? "text-red-500"
                        : product.stockQuantity < 10
                        ? "text-orange-500"
                        : "text-emerald-600"
                    }`}
                  >
                    {product.stockQuantity}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    ₹{product.offerPrice || product.price}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center items-center gap-4 text-lg">
                      <button
                        onClick={() =>
                          navigate(`/seller/product-list/${product._id}`)
                        }
                        title="Edit Product"
                        className="text-emerald-600 hover:text-emerald-700 transition"
                      >
                        <MdEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        title="Delete Product"
                        className="text-red-500 hover:text-red-600 transition"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
