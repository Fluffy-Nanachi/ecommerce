import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import App from "./App.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import Products from "./pages/Products.jsx";
import Cart from "./pages/Cart.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import { CartProvider } from "./context/CartContext";
import Profile from "./pages/Profile.jsx";
import { ProfileProvider } from "./context/ProfileContext.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import AdminOrders from "./pages/AdminOrders";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/Login",
    element: <LoginPage />,
  },
  {
    path: "/SignUp",
    element: <SignUpPage />,
  },
  {
    path: "/Products",
    element: <Products />,
  },

  { path: "/checkout", element: <Checkout /> },
  { path: "/MyOrders", element: <MyOrders /> },
  { path: "/reset-password", element: <ResetPassword /> },
  { path: "Cart", element: <Cart /> },
  { path: "/Products/:id", element: <ProductDetails /> },
  { path: "/Profile", element: <Profile /> },
  { path: "/admin/orders", element: <AdminOrders /> },
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminPage />
      </AdminRoute>
    ),
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CartProvider>
      <ProfileProvider>
        <RouterProvider router={router} />
      </ProfileProvider>
    </CartProvider>
  </StrictMode>
);
