import React, { useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cartItems, loading, updateQuantity, removeItem, total } = useCart();
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState([]);

  if (loading) return <p>Loading cart...</p>;

  const toggleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const buySelectedItems = () => {
    if (selectedItems.length === 0) return alert("Select items to buy!");
    const itemsToBuy = cartItems.filter((item) =>
      selectedItems.includes(item.id)
    );

    // Validate stock
    for (const item of itemsToBuy) {
      if (item.quantity > item.product.stock)
        return alert(`Not enough stock for ${item.product.name}`);
    }

    localStorage.setItem("checkoutItems", JSON.stringify(itemsToBuy));
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 bg-white p-4 rounded-lg shadow mb-4"
              >
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => toggleSelectItem(item.id)}
                  disabled={item.product.stock === 0}
                  className="checkbox checkbox-primary"
                />
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h2 className="font-bold">{item.product.name}</h2>
                  <p className="text-pink-600 font-semibold">
                    ₱{item.product.price} x {item.quantity} = ₱
                    {item.product.price * item.quantity}
                  </p>
                  <p className="text-gray-500">Stock: {item.product.stock}</p>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <div className="flex gap-2">
                    <button
                      className="btn btn-sm"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="px-2">{item.quantity}</span>
                    <button
                      className="btn btn-sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="btn btn-error btn-sm mt-2"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <div className="mt-6 flex justify-between items-center">
              <p className="text-xl font-bold">Total: ₱{total}</p>
              <button className="btn btn-primary" onClick={buySelectedItems}>
                Buy Selected
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
