import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import CartPage from "./pages/user/CartPage";
import CheckoutPage from "./pages/user/CheckoutPage";
import AddressPage from "./pages/user/AddressPage"; 
import MenuPage from "./pages/user/MenuPage";
import UserOrderPage from "./pages/user/UserOrderPage";
import HomePage from "./pages/auth/HomePage";
import AppFooter from "./components/layout/AppFooter";
import AdminDashboard from "./pages/admin/AdminDashboardPage";
import OwnerDashboardPage from "./pages/restaurantOwner/OwnerDashboardPage";
import UserHomePage from "./pages/user/UserHomePage";
import UserProfilePage from "./pages/user/UserProfilePage";
function App() {
  return (
    
<BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/Address" element={<AddressPage />} />
          <Route path="/Menu" element={<MenuPage />} />
          <Route path="/MyOrder" element={<UserOrderPage />} />
          <Route path="/AdminDashBoard" element={<AdminDashboard />} />
          <Route path="/UserHome" element={<UserHomePage />} />
          <Route path="/RestaurantDashBoard" element={<OwnerDashboardPage />} />
          <Route path="/Profile" element={<UserProfilePage />} />
        </Routes>
        
        <AppFooter />
      </div>
    </BrowserRouter>
  );
}

export default App;
