/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { MdError } from "react-icons/md";
import { AppContext } from "../../context/AppContext";
import sellerApi from "../../api/sellerApi";
import { useSelector } from "react-redux";

const AddProduct = () => {
  const { toast, navigate } = useContext(AppContext);
  const sellerData = useSelector((state) => state.auth.sellerData);

  const [loading, setLoading] = useState(false);

  const [images, setImages] = useState([]);
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

  useEffect(() => {
    fetchCategories();
  }, []);

  const onSubmitHandle = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (images.length === 0) {
      toast.error("Please upload atleast one image");
      setLoading(false);
      return;
    }

    if (category === "") {
      toast.error("Please select a category");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("offerPrice", offerPrice);
    formData.append("weight", weight);
    formData.append("unit", units);
    formData.append("category", category);
    formData.append("stockQuantity", stockQuantity);

    for (const image of images) {
      formData.append("images", image);
    }
    try {
      const response = await sellerApi.post("/products", formData);
      if (response.status === 201) {
        toast.success(response.data.message);
        navigate("/seller/product-list");
        scrollTo(0, 0);
        setName("");
        setDescription("");
        setPrice("");
        setOfferPrice("");
        setWeight("");
        setUnits("kg");
        setCategory("");
        setStockQuantity("");
        setImages([]);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  if (sellerData?.status === "Pending") {
    return (
      <div className="flex h-[95vh] items-center justify-center w-full">
        <div className="flex items-center justify-between max-w-2/4 w-full bg-red-600/20 text-red-600 px-3 py-1 rounded-sm">
          <div className="flex items-center">
            <MdError className="text-6xl md:text-4xl" />
            <p className="text-base md:text-xl ml-2">
              Your account is under review. You will be notified upon approval.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (sellerData?.status === "Rejected") {
    return (
      <div className="flex h-[95vh] items-center justify-center w-full">
        <div className="flex items-center justify-between max-w-80 w-full bg-red-600/20 text-red-600 px-3 h-10 rounded-sm">
          <div className="flex items-center">
            <MdError className="text-6xl md:text-4xl" />
            <p className="text-base md:text-xl ml-2">
              Your account application was not approved. Please contact support.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between relative">
      {loading && <Loading />}
      <form
        onSubmit={onSubmitHandle}
        className="md:p-10 p-4 space-y-5 max-w-lg"
      >
        <div>
          <p className="text-base font-medium">Product Image</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {Array(4)
              .fill("")
              .map((_, index) => (
                <label key={index} htmlFor={`image${index}`}>
                  <input
                    onChange={(e) => {
                      const updatedFiles = [...images];
                      updatedFiles[index] = e.target.files[0];
                      setImages(updatedFiles.filter((file) => file));
                    }}
                    accept="image/*"
                    type="file"
                    id={`image${index}`}
                    hidden
                  />
                  <img
                    className="max-w-24 cursor-pointer"
                    src={
                      images[index]
                        ? URL.createObjectURL(images[index])
                        : assets.upload_area
                    }
                    alt="uploadArea"
                    width={100}
                    height={100}
                  />
                </label>
              ))}
          </div>
        </div>
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
          ADD
        </button>
      </form>
    </div>
  );
};
export default AddProduct;
