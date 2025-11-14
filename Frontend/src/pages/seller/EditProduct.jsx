import { MdEditDocument } from "react-icons/md";
import { FcEditImage } from "react-icons/fc";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { useParams } from "react-router-dom";

const EditProduct = () => {
  const { productId } = useParams();
  const { navigate } = useContext(AppContext);
  return (
    <div className="flex-1 p-4 md:p-8 overflow-hidden h-[90vh]">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        Edit Product <br />
        <span className="text-base font-medium">
          Choose what you have to Edit?
        </span>
      </h1>
      <div className="flex flex-col md:flex-row h-4/5 items-center justify-center w-full gap-4 md:gap-8">
        <div
          onClick={() => {
            navigate(`/seller/product-list/${productId}/details`);
            scrollTo(0, 0);
          }}
          className="h-48 w-full md:w-56 md:h-56 bg-[#e5f3f3] p-4 rounded-lg flex flex-col items-center justify-center gap-3 cursor-pointer transition-all hover:shadow-lg hover:scale-105"
        >
          <MdEditDocument className="text-7xl text-emerald-500" />
          <p className="text-center font-medium text-gray-700">
            Edit Product Details
          </p>
        </div>
        <div
          onClick={() => {
            navigate(`/seller/product-list/${productId}/images`);
            scrollTo(0, 0);
          }}
          className="h-48 w-full md:w-56 md:h-56 bg-[#e5f3f3] p-4 rounded-lg flex flex-col items-center justify-center gap-3 cursor-pointer transition-all hover:shadow-lg hover:scale-105"
        >
          <FcEditImage className="text-7xl" />
          <p className="text-center font-medium text-gray-700">
            Edit Product Images
          </p>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
