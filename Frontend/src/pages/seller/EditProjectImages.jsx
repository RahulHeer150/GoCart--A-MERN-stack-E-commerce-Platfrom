/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import { useParams } from "react-router-dom";
import sellerApi from "../../api/sellerApi";
import Loading from "../../components/Loading";

const EditProjectImages = () => {
  const { productId } = useParams();

  const { toast, navigate } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  const [currentImages, setCurrentImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const fetchProduct = async () => {
    try {
      const response = await sellerApi.get(`/products/${productId}`);
      if (response.status === 200) {
        const data = response.data.data;
        setCurrentImages(data.images);
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (newImages.length === 0) {
      toast.error("Please upload atleast one image");
      setLoading(false);
      return;
    }
    const formData = new FormData();
    for (const image of newImages) {
      formData.append("images", image);
    }
    try {
      const response = await sellerApi.patch(
        `/products/${productId}/images`,
        formData
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

  useEffect(() => {
    fetchProduct();
  }, []);

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between relative">
      {loading && <Loading />}
      <form
        onSubmit={onSubmitHandler}
        className="md:p-10 p-4 space-y-5 max-w-lg"
      >
        <h1 className="text-2xl font-semibold text-gray-700">
          Edit Project Images
        </h1>
        <div>
          <p className="text-base font-medium">Current Images</p>
          <div className="flex flex-wrap items-center gap-3 mt-2 p-4">
            {currentImages.length > 0 ? (
              currentImages.map((imgUrl, index) => (
                <img
                  key={index}
                  src={imgUrl}
                  alt="current Product"
                  className="w-24 h-24 object-cover rounded-md bg-[#e5f3f3]"
                />
              ))
            ) : (
              <p className="text-sm text-gray-500">No Current Images</p>
            )}
          </div>
        </div>

        <div>
          <p className="text-base font-medium">Upload New Images</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {Array(4)
              .fill("")
              .map((_, index) => (
                <label key={index} htmlFor={`image${index}`}>
                  <input
                    onChange={(e) => {
                      const updatedFiles = [...newImages];
                      updatedFiles[index] = e.target.files[0];
                      setNewImages(updatedFiles.filter((file) => file));
                    }}
                    accept="image/*"
                    type="file"
                    id={`image${index}`}
                    hidden
                  />
                  <img
                    className="max-w-24 cursor-pointer"
                    src={
                      newImages[index]
                        ? URL.createObjectURL(newImages[index])
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

        <button className="px-8 py-2.5 bg-emerald-600 text-white font-medium rounded cursor-pointer">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProjectImages;
