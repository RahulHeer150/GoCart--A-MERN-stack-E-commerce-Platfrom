import { Route, Routes, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./components/Login";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";

// User Pages
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import AllProducts from "./pages/AllProducts";
import ProductCategory from "./pages/ProductCategory";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import AddAddress from "./pages/AddAddress";
import Addresses from "./pages/Addresses";
import EditAddressDetails from "./pages/EditAddressDetails";
import UserProfile from "./pages/UserProfile";
import EditUserDetails from "./pages/EditUserDetails";
import ChangeUserPassword from "./pages/ChangeUserPassword";
import Order from "./pages/Order";
import ViewSeller from "./pages/ViewSeller";

// Seller Pages
import SellerLogin from "./components/seller/SellerLogin";
import SellerDashboard from "./pages/seller/SellerDashboard";
import ProfilePage from "./pages/seller/ProfilePage";
import EditSellerDetails from "./pages/seller/EditSellerDetails";
import ChangePassword from "./pages/seller/ChangePassword";
import AddProduct from "./pages/seller/AddProduct";
import ProductList from "./pages/seller/ProductList";
import EditProduct from "./pages/seller/EditProduct";
import EditProductDetails from "./pages/seller/EditProductDetails";
import EditProjectImages from "./pages/seller/EditProjectImages";
import Orders from "./pages/seller/Orders";

// Admin Pages
import AdminLayout from "./pages/admin/AdminLayout";
import AdminLogin from "./components/admin/AdminLogin";
import SellersList from "./pages/admin/SellersList";
import AddCategory from "./pages/admin/AddCategory";
import CategoryList from "./pages/admin/CategoryList";
import EditCategory from "./pages/admin/EditCategory";
import OrdersList from "./pages/admin/OrdersList";

// Other
import PageNotFound from "./pages/PageNotFound";

const App = () => {
  const location = useLocation();
  const showUserLogin = useSelector((state) => state.ui.showUserLogin);
  const isSellerPath = location.pathname.includes("/seller");
  const isAdminPath = location.pathname.includes("/admin");
  const isSeller = useSelector((state) => state.auth.isSeller);
  const isAdmin = useSelector((state) => state.auth.isAdmin);

  const showNavbarFooter = !isSellerPath && !isAdminPath;

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col">
      {showNavbarFooter && <Navbar />}

      {showUserLogin && <Login />}

      <Toaster position="top-center" toastOptions={{ duration: 2500 }} />

      <main
        className={`flex-1 transition-all ${
          showNavbarFooter ? "px-4 md:px-12 lg:px-20 xl:px-28 py-6" : ""
        }`}
      >
        <Routes>
          {/*  User Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/products/:category" element={<ProductCategory />} />
          <Route path="/products/:category/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/view/:sellerId" element={<ViewSeller />} />

          {/*  Protected User Routes */}
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-account"
            element={
              <ProtectedRoute>
                <EditUserDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangeUserPassword />
              </ProtectedRoute>
            }
          />
          <Route
            path="/address"
            element={
              <ProtectedRoute>
                <AddAddress />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addresses"
            element={
              <ProtectedRoute>
                <Addresses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addresses/edit/:addressId"
            element={
              <ProtectedRoute>
                <EditAddressDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Order />
              </ProtectedRoute>
            }
          />

          {/*  Seller Routes */}
          <Route
            path="/seller"
            element={isSeller ? <SellerDashboard /> : <SellerLogin />}
          >
            <Route index element={<ProfilePage />} />
            <Route path="edit-seller" element={<EditSellerDetails />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="product-list" element={<ProductList />} />
            <Route path="orders" element={<Orders />} />
            <Route path="product-list/:productId" element={<EditProduct />} />
            <Route
              path="product-list/:productId/details"
              element={<EditProductDetails />}
            />
            <Route
              path="product-list/:productId/images"
              element={<EditProjectImages />}
            />
          </Route>

          {/*  Admin Routes */}
          <Route
            path="/admin"
            element={isAdmin ? <AdminLayout /> : <AdminLogin />}
          >
            <Route index element={<SellersList />} />
            <Route path="add-category" element={<AddCategory />} />
            <Route path="categories" element={<CategoryList />} />
            <Route path="orders" element={<OrdersList />} />
            <Route path="categories/:categoryId" element={<EditCategory />} />
          </Route>

          {/*  404 */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </main>

      {/*  Footer */}
      {showNavbarFooter && <Footer />}
    </div>
  );
};

export default App;
