import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import supabase from "../supabase-client";
import NavbarAdmin from "../components/NavbarAdmin";

export default function AdminDashboard() {
  const navigate = useNavigate(); // <-- Added
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    image_file: null,
  });

  // Fetch products from Supabase
  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*");
    if (error) console.error(error);
    else setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Upload image to Cloudinary
  const uploadImage = async () => {
    if (!form.image_file) {
      alert("Please choose an image!");
      return null;
    }

    const formData = new FormData();
    formData.append("file", form.image_file);
    formData.append("upload_preset", "unsigned_preset");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dgtqkxsnp/image/upload",
        { method: "POST", body: formData }
      );
      const data = await res.json();
      return data.secure_url;
    } catch (err) {
      console.error(err);
      alert("Image upload failed!");
      return null;
    }
  };

  const addProduct = async () => {
    const imageUrl = await uploadImage();
    if (!imageUrl) return;

    const { error } = await supabase.from("products").insert([
      {
        name: form.name,
        price: form.price,
        stock: form.stock,
        description: form.description,
        image: imageUrl,
      },
    ]);

    if (error) {
      console.error(error);
      alert("Failed to add product: " + error.message);
      return;
    }

    setForm({
      name: "",
      price: "",
      stock: "",
      description: "",
      image_file: null,
    });

    fetchProducts();
  };

  const deleteProduct = async (id) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) console.error(error);
    else fetchProducts();
  };

  const editProduct = async (product) => {
    const newName = prompt("New name", product.name);
    const newPrice = prompt("New price", product.price);
    const newStock = prompt("New stock", product.stock);
    const newDesc = prompt("New description", product.description);

    if (!newName || !newPrice || !newStock || !newDesc) return;

    const { error } = await supabase
      .from("products")
      .update({
        name: newName,
        price: newPrice,
        stock: newStock,
        description: newDesc,
      })
      .eq("id", product.id);

    if (error) console.error(error);
    else fetchProducts();
  };

  return (
    <div className="min-h-screen bg-base-200">
      <NavbarAdmin />

      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>

          {/* Button to go to Admin Orders */}
          <button
            className="btn btn-primary"
            onClick={() => navigate("/admin/orders")} // <-- Navigate to orders page
          >
            View Orders
          </button>
        </div>

        {/* Add Product Form */}
        <div className="card bg-base-100 shadow-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Add Product</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Name"
              className="input input-bordered w-full"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              type="number"
              placeholder="Price"
              className="input input-bordered w-full"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            <input
              type="number"
              placeholder="Stock"
              className="input input-bordered w-full"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
            />
            <input
              type="file"
              accept="image/*"
              className="file-input file-input-bordered w-full"
              onChange={(e) =>
                setForm({ ...form, image_file: e.target.files[0] })
              }
            />
            {form.image_file && (
              <img
                src={URL.createObjectURL(form.image_file)}
                alt="Preview"
                className="h-40 w-full object-cover col-span-1 md:col-span-2 rounded-lg"
              />
            )}
            <textarea
              placeholder="Description"
              className="textarea textarea-bordered col-span-1 md:col-span-2"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <button className="btn btn-primary mt-4" onClick={addProduct}>
            Add Product
          </button>
        </div>

        {/* Product List */}
        <h2 className="text-2xl font-bold mb-4">Product List</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((p) => (
              <div key={p.id} className="card bg-base-100 shadow-md">
                <figure>
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-40 w-full object-cover"
                  />
                </figure>
                <div className="card-body">
                  <h3 className="card-title">{p.name}</h3>
                  <p>₱{p.price}</p>
                  <p>Stock: {p.stock}</p>
                  <p className="text-sm">{p.description}</p>

                  <div className="card-actions justify-end mt-2">
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => editProduct(p)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => deleteProduct(p.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
