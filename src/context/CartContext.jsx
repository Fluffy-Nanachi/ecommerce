import React, { createContext, useContext, useState, useEffect } from "react";
import supabase from "../supabase-client";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch cart items for current user
  const fetchCart = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("cart")
      .select(
        "id, quantity, product:product_id (id, name, price, stock, image)"
      )
      .eq("user_id", user.id);

    if (error) console.error(error);
    else setCartItems(data);

    setLoading(false);
  };

  useEffect(() => {
    fetchCart();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      fetchCart();
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const addToCart = async (product, quantity = 1) => {
    if (quantity > product.stock) {
      return alert("Not enough stock!");
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return alert("Please log in first!");

    const { error } = await supabase.from("cart").upsert(
      [
        {
          user_id: user.id,
          product_id: product.id,
          quantity,
        },
      ],
      {
        onConflict: ["user_id", "product_id"],
        returning: "minimal",
      }
    );

    if (error) {
      console.error(error);
      return alert("Failed to add to cart");
    }

    fetchCart();
    alert("Added to cart!");
  };

  const updateQuantity = async (cartItemId, quantity) => {
    if (quantity < 1) return;
    await supabase.from("cart").update({ quantity }).eq("id", cartItemId);
    fetchCart();
  };

  const removeItem = async (cartItemId) => {
    await supabase.from("cart").delete().eq("id", cartItemId);
    fetchCart();
  };

  const clearCart = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("cart").delete().eq("user_id", user.id);
    setCartItems([]);
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart, // ✅ now available
        total,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
