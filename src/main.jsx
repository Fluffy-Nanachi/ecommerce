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
  { path: "Cart", element: <Cart /> },
  { path: "/Products/:id", element: <ProductDetails /> },
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
      <RouterProvider router={router} />
    </CartProvider>
  </StrictMode>
);
