import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import supabase from "../supabase-client";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();
      if (error) console.error(error);
      else setProduct(data);
    };
    fetchProduct();
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg"
          />
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <p className="text-pink-600 font-bold text-xl mt-2">
                ₱{product.price}
              </p>
              <p className="text-gray-500 mt-1">Stock: {product.stock}</p>
              <p className="text-gray-700 mt-4">{product.description}</p>
            </div>
            <div className="mt-6 flex items-center gap-4">
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="input input-bordered w-24"
              />
              <button
                onClick={() => addToCart(product, quantity)}
                className="btn btn-primary"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
