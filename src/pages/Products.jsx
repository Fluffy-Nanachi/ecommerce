import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import supabase from "../supabase-client";
import Navbar from "../components/Navbar";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from("products").select("*");
      if (error) console.error(error);
      else setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading products...</p>;

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="card cursor-pointer bg-white shadow-lg rounded-lg overflow-hidden"
            onClick={() => navigate(`/products/${product.id}`)}
          >
            <img
              src={product.image}
              alt={product.name}
              className="h-52 w-full object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-black text-lg">
                {product.name}
              </h3>
              <p className="text-pink-600 font-bold">₱{product.price}</p>
              <p className="text-gray-500">Stock: {product.stock}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
