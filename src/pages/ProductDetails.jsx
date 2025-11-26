import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import supabase from "../supabase-client";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();
      if (!error) setProduct(data);
    };

    const fetchSimilarProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .neq("id", id)
        .limit(4);
      if (!error) setSimilarProducts(data);
    };

    fetchProduct();
    fetchSimilarProducts();
  }, [id]);

  if (!product) return <p className="text-center mt-10">Loading product...</p>;

  return (
    <div className="relative min-h-screen">
      <Navbar />
      <div className="p-6 max-w-5xl mx-auto mt-10 bg-white/90 backdrop-blur-md rounded-xl shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-96 object-cover rounded-xl"
          />
          <div className="flex flex-col justify-between relative">
            <div>
              <h1 className="text-3xl font-bold drop-shadow-sm">
                {product.name}
              </h1>
              <p className="text-pink-600 font-bold text-xl mt-2 drop-shadow-sm">
                ₱{product.price}
              </p>
              <p className="text-gray-500 mt-1 drop-shadow-sm">
                Stock: {product.stock}
              </p>
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
                onClick={() => {
                  if (quantity > product.stock)
                    return alert("Not enough stock!");
                  addToCart(product, quantity);
                }}
                className={`btn btn-primary ${
                  product.stock === 0 ? "btn-disabled" : ""
                }`}
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
