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
    <div className="relative min-w-screen min-h-screen">
      <Navbar />
      <div className="px-8 py-8 min-h-screen relative">
        <div className="max-w-7xl mx-auto mb-8">
          <h1 className="text-4xl font-bold text-center bg-linear-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-2 animate-pulse drop-shadow-lg">
            ✨ Anime Merchandise ✨
          </h1>
          <p className="text-center text-gray-600 text-lg drop-shadow-sm">
            Discover Genuine and Authentic Anime Merchandise!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-7xl mx-auto items-start">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex flex-col w-full cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-2 border-black hover:border-pink-400 bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden group h-[420px]"
              onClick={() => navigate(`/products/${product.id}`)}
            >
              <div className="relative overflow-hidden h-65">
                <img
                  className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  src={product.image}
                  alt={product.name}
                />
              </div>
              <div className="p-3 pb-3 flex-1 flex flex-col justify-between relative">
                <div>
                  <h3 className="font-semibold text-sm mb-1 hover:text-pink-600 transition-colors drop-shadow-md">
                    {product.name}
                  </h3>
                  <p className="text-pink-600 font-bold text-lg drop-shadow-sm">
                    ₱{product.price}
                  </p>
                  <p className="text-gray-500 drop-shadow-sm">
                    Stock: {product.stock}
                  </p>
                </div>
                <button className="absolute bottom-3 left-3 right-3 bg-linear-to-r from-pink-500 to-purple-500 text-white font-semibold py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  View Details ✨
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
