/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import sellerApi from "../../api/sellerApi";
import { useParams } from "react-router-dom";
import Loading from "../../components/Loading";

const EditProductDetails = () => {
  const { productId } = useParams();

  const { toast, navigate } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [weight, setWeight] = useState("");
  const [units, setUnits] = useState("kg");
  const [category, setCategory] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");

  const [categories, setCategories] = useState([]);
  const fetchCategories = async () => {
    try {
      const response = await sellerApi.get("/categories");
      if (response.status === 200) {
        setCategories(response.data.data);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await sellerApi.get(`/products/${productId}`);
      if (response.status === 200) {
        const data = response.data.data;
        setName(data.name);
        setDescription(data.description);
        setPrice(data.price);
        setOfferPrice(data.offerPrice || "");
        setWeight(data.weight);
        setUnits(data.unit);
        setCategory(data.category.name);
        setStockQuantity(data.stockQuantity);
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProduct();
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (category === "") {
      toast.error("Please select a category");
      setLoading(false);
      return;
    }

    const data = {
      name,
      description,
      price,
      offerPrice,
      weight,
      unit: units,
      category,
      stockQuantity,
    };

    try {
      const response = await sellerApi.patch(
        `/products/${productId}/details`,
        data
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        navigate("/seller/product-list");
        scrollTo(0, 0);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between relative">
      {loading && <Loading />}
      <form
        onSubmit={onSubmitHandler}
        className="md:p-10 p-4 space-y-5 max-w-lg"
      >
        <h1 className="text-2xl font-medium mb-4">Edit Product</h1>
        {/* Name */}
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-name">
            Product Name
          </label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            id="product-name"
            type="text"
            placeholder="Enter Product Name"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            required
          />
        </div>
        {/* Description */}
        <div className="flex flex-col gap-1 max-w-md">
          <label
            className="text-base font-medium"
            htmlFor="product-description"
          >
            Product Description
          </label>
          <textarea
            id="product-description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            rows={3}
            className="outline-none md:py-2.5 py-2 px-3 rounded border overflow-auto no-scrollbar border-gray-500/40 resize-none"
            placeholder="Enter Product Description"
          ></textarea>
        </div>
        {/* Price and Offer Price*/}
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="product-price">
              Product Price
            </label>
            <input
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              id="product-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              required
            />
          </div>

          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="offer-price">
              Offer Price
            </label>
            <input
              onChange={(e) => setOfferPrice(e.target.value)}
              value={offerPrice}
              id="offer-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              required
            />
          </div>
        </div>
        {/* weight and units*/}
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label htmlFor="weight" className="test-base font-medium">
              Weight
            </label>
            <input
              type="number"
              name="weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              id="weight"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              placeholder="Add weight"
            />
          </div>
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label htmlFor="units" className="test-base font-medium">
              Units
            </label>
            <select
              id="units"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setUnits(e.target.value)}
              value={units}
            >
              <option value="kg">kg</option>
              <option value="g"> g</option>
              <option value="litre">litre</option>
              <option value="ml">ml</option>
              <option value="pack">pack</option>
              <option value="dozen">dozen</option>
            </select>
          </div>
        </div>
        {/* Category and Stock Quantity*/}
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex flex-1 flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-1 flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="stock-quantity">
              StockQuantity
            </label>
            <input
              type="number"
              name="stockQuantity"
              id="stock-quantity"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              placeholder="100"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 placeholder:tracking-tighter"
              required
            />
          </div>
        </div>
        <button className="px-8 py-2.5 bg-emerald-600 text-white font-medium rounded cursor-pointer">
          Save Changes
        </button>
      </form>
    </div>
  );
};
export default EditProductDetails;
