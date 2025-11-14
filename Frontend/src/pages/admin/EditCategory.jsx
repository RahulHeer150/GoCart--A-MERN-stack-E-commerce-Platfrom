/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useParams } from "react-router-dom";
import adminApi from "../../api/adminApi";
import Loading from "../../components/Loading";

const EditCategory = () => {
  const { categoryId } = useParams();
  const { toast, navigate } = useContext(AppContext);

  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [path, setPath] = useState("");
  const [image, setImage] = useState(null);
  const [color, setColor] = useState("#e5f3f3");
  const [imagePreview, setImagePreview] = useState(null);

  const fetchCategory = async () => {
    try {
      const response = await adminApi.get(`/categories/${categoryId}`);
      if (response.status === 200) {
        setName(response.data.data.name);
        setPath(response.data.data.path);
        setColor(response.data.data.color);
        setImage(response.data.data.image);
        setImagePreview(response.data.data.image);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("path", path);
    formData.append("color", color);
    if (image && typeof image !== "string") {
      formData.append("image", image);
    }

    try {
      const response = await adminApi.patch(
        `/categories/${categoryId}`,
        formData
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        navigate("/admin/categories");
        scrollTo(0, 0);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  return (
    <div className=" flex-1 p-4 md:8  overflow-y-auto relative">
      {loading && <Loading />}
      <h1 className=" md:px-10 p-4 text-2xl font-medium mb-6">Edit Category</h1>
      <form
        onSubmit={handleSubmit}
        className="md:px-10 px-4 space-y-5 max-w-lg"
        encType="multipart/form-data"
      >
        <div>
          <p className="text-base font-medium">Category Image</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <label htmlFor="image">
              <input
                accept="image/*"
                type="file"
                id="image"
                hidden
                onChange={handleImageChange}
              />
              <img
                className="max-w-24 cursor-pointer"
                src={imagePreview}
                alt="uploadArea"
                width={100}
                height={100}
              />
            </label>
          </div>
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="category-name">
            Category Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            name="name"
            id="category-name"
            type="text"
            placeholder="Enter the name of Category"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            required
          />
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="category-path">
            Category Path
          </label>
          <input
            value={path}
            onChange={(e) => setPath(e.target.value)}
            name="path"
            id="category-path"
            type="text"
            placeholder="Enter Category's Path"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            required
          />
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="category-bg-color">
            Category BackgroundColor
          </label>
          <input
            value={color}
            onChange={(e) => setColor(e.target.value)}
            name="color"
            id="category-bg-color"
            type="color"
            className="w-12 h-10 outline-none border-none"
            required
          />
        </div>
        <button
          type="submit"
          className="px-8 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded cursor-pointer"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditCategory;
