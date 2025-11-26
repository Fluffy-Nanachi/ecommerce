import React, { useEffect, useState } from "react";
import supabase from "../supabase-client";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router";

export default function Checkout() {
  const { clearCart } = useCart();
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [address, setAddress] = useState("");
  const [shippingFee, setShippingFee] = useState(50);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("checkoutItems") || "[]");
    setCheckoutItems(items);
  }, []);

  useEffect(() => {
    const fetchAddress = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;
      const userId = session.user.id;
      const { data } = await supabase
        .from("shipping_addresses")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      if (data) setAddress(data.shipping_address);
    };
    fetchAddress();
  }, []);

  const handlePlaceOrder = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return alert("Please log in first!");
    const userId = session.user.id;

    setLoading(true);
    try {
      for (const item of checkoutItems) {
        // Insert order
        await supabase.from("orders").insert([
          {
            user_id: userId,
            item_name: item.product.name,
            item_price: item.product.price + shippingFee / checkoutItems.length,
            quantity: item.quantity,
            status: "on_process",
          },
        ]);
        // Update stock
        await supabase
          .from("products")
          .update({ stock: item.product.stock - item.quantity })
          .eq("id", item.product.id);
      }
      alert("Order placed successfully!");
      clearCart();
      localStorage.removeItem("checkoutItems");
      navigate("/MyOrders");
    } catch (error) {
      console.error(error);
      alert("Failed to place order: " + error.message);
    }
    setLoading(false);
  };

  const totalAmount = checkoutItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow space-y-4 mt-10">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <p>
          <strong>Shipping Address:</strong> {address || "No address found"}
        </p>
        <p>
          <strong>Subtotal:</strong> ₱{totalAmount}
        </p>
        <p>
          <strong>Shipping Fee:</strong> ₱{shippingFee}
        </p>
        <p className="text-lg font-bold">Total: ₱{totalAmount + shippingFee}</p>
        <button
          className="btn btn-primary w-full mt-4"
          onClick={handlePlaceOrder}
          disabled={loading || !checkoutItems.length}
        >
          Place Order
        </button>
      </div>
    </div>
  );
}
