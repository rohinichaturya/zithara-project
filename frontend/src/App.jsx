import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserLayout from "./Components/Layout/UserLayout";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import Profile from "./Pages/Profile";
import CollectionPage from "./Pages/CollectionPage";
import ProductPage from "./Components/Products/ProductPage";
import Checkout from "./Components/Cart/Checkout";
import { Toaster } from "sonner";
import { CartProvider } from "./Components/Cart/CartContext";
import OrderConfirmationPage from "./Pages/OrderConfirmationPage";
import OrderDetailsPage from "./Pages/OrderDetailsPage";
import AdminLayout from "./Components/Admin/AdminLayout";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import UserManagement from "./Components/Admin/UserManagement";
import ProductManagement from "./Components/Admin/ProductManagement";
import EditProductPage from "./Components/Admin/EditProductPage";
import OrderManagement from "./Components/Admin/OrderManagement";
import { Provider } from "react-redux";
import store from "./redux/store";
import ProductList from "./Components/Products/ProductsList";
import AddProduct from "./Components/Admin/AddProduct";
import ContactUs from "./Pages/ContactUs";
import FAQs from "./Pages/FAQs";
import ScrollToTop from "./Components/Common/ScrollToTop";

function App() {
  return (
    <Provider store={store}>
      <CartProvider>
        <BrowserRouter>
          <ScrollToTop /> {/* Add this right inside BrowserRouter */}
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<UserLayout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/collections/:category" element={<CollectionPage />} />
            <Route path="/collections/gender/:gender" element={<CollectionPage />} />
            <Route path="/collection/products" element={<CollectionPage />} />
            <Route path="/product/:productId" element={<ProductPage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
            <Route path="/order/:orderId" element={<OrderDetailsPage />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/contactus" element={<ContactUs />} />
            <Route path="/faqs" element={<FAQs />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="products" element={<ProductManagement />} />
              <Route path="edit-product/:id" element={<EditProductPage />} />
              <Route path="orders" element={<OrderManagement />} />
              <Route path="add-product" element={<AddProduct />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </Provider>
  );
}

export default App;