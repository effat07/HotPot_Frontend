import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import CartPage from "./pages/user/CartPage";
import CheckoutPage from "./pages/user/CheckoutPage";
import AddressPage from "./pages/user/AddressPage"; 
import UserOrderPage from "./pages/user/UserOrderPage";
import HomePage from "./pages/auth/HomePage";
import AppFooter from "./components/layout/AppFooter";
import AdminDashboard from "./pages/admin/AdminDashboardPage";
import OwnerDashboardPage from "./pages/restaurantOwner/OwnerDashboardPage";
import UserHomePage from "./pages/user/UserHomePage";
import UserProfilePage from "./pages/user/UserProfilePage";
import OwnerMenuPage from "./pages/restaurantOwner/OwnerMenuPage";
import MenuForm from "./components/forms/MenuForm";
import RestaurantMenuPage from "./pages/user/RestaurantMenuPage";
import { AuthProvider } from "./context/AuthContext";
import OwnerOrdersPage from "./pages/restaurantOwner/OwnerOrdersPage";
function App() {
  return (
    <AuthProvider>
<BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/Address" element={<AddressPage />} />
          <Route path="/MyOrder" element={<UserOrderPage />} />
          <Route path="/AdminDashBoard" element={<AdminDashboard />} />
          <Route path="/UserHome" element={<UserHomePage />} />
          <Route path="/RestaurantDashBoard" element={<OwnerDashboardPage />} />
          <Route path="/MenuPage" element={<OwnerMenuPage />} />
          <Route path="/OwnerOrderPage" element={<OwnerOrdersPage />} />
          <Route path="/Profile" element={<UserProfilePage />} />
          <Route path="/owner/menu/add" element={<MenuForm />} />  
        <Route path="/owner/menu/edit/:id" element={<MenuForm />} /> 
        <Route path="/restaurants/:restaurantId/menus" element={<RestaurantMenuPage />} />

        </Routes>
        
        <AppFooter />
      </div>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
