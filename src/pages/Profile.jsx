import React, { useState, useEffect } from "react";
import { useProfile } from "../context/ProfileContext";
import supabase from "../supabase-client";
import DefaultAvatar from "../assets/default-avatar.png";
import Navbar from "../components/Navbar";

export default function Profile() {
  const { profile, setProfile } = useProfile();
  const [pfpFile, setPfpFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Shipping address form fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // List of addresses
  const [shippingList, setShippingList] = useState([]);

  // Delete & Edit modal states
  const [deleteId, setDeleteId] = useState(null);
  const [editData, setEditData] = useState(null);

  // Fetch user's shipping addresses
  const fetchShippingAddresses = async () => {
    if (!profile) return;
    const { data } = await supabase
      .from("shipping_addresses")
      .select("*")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false });

    if (data) setShippingList(data);
  };

  useEffect(() => {
    fetchShippingAddresses();
  }, [profile]);

  if (!profile) return <p>Loading profile...</p>;

  // Upload profile picture
  const handleUploadPFP = async () => {
    if (!pfpFile) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", pfpFile);
    formData.append("upload_preset", "unsigned_preset");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dgtqkxsnp/image/upload",
      { method: "POST", body: formData }
    );
    const data = await res.json();
    const url = data.secure_url;

    const { data: updated } = await supabase
      .from("profiles")
      .update({ profile_image_url: url })
      .eq("id", profile.id)
      .select()
      .single();

    if (updated) setProfile(updated);
    setLoading(false);
  };

  // Save new shipping address
  const handleSaveAddress = async () => {
    if (!fullName || !phone || !address) {
      alert("Please fill all fields.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("shipping_addresses")
      .insert([
        {
          user_id: profile.id,
          username: profile.full_name || "User",
          full_name: fullName,
          phone_number: phone,
          shipping_address: address,
        },
      ])
      .select();

    if (!error) {
      setShippingList([data[0], ...shippingList]);
      setFullName("");
      setPhone("");
      setAddress("");
      alert("Shipping address added!");
    }

    setLoading(false);
  };

  // Open delete modal
  const handleDeleteAddress = (id) => {
    setDeleteId(id);
    document.getElementById("deleteModal").showModal();
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    const { error } = await supabase
      .from("shipping_addresses")
      .delete()
      .eq("id", deleteId);

    if (!error) {
      setShippingList(shippingList.filter((a) => a.id !== deleteId));
    }

    document.getElementById("deleteModal").close();
  };

  // Open edit modal
  const handleEditAddress = (addr) => {
    setEditData(addr);
    document.getElementById("editModal").showModal();
  };

  // Save edit changes
  const handleSaveEdit = async () => {
    const { error } = await supabase
      .from("shipping_addresses")
      .update({
        full_name: editData.full_name,
        phone_number: editData.phone_number,
        shipping_address: editData.shipping_address,
      })
      .eq("id", editData.id);

    if (!error) {
      setShippingList(
        shippingList.map((a) => (a.id === editData.id ? editData : a))
      );
    }

    document.getElementById("editModal").close();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="max-w-2xl mx-auto p-6 mt-10 border rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">
          Welcome, {profile.full_name || "User"}!
        </h1>

        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={profile.profile_image_url || DefaultAvatar}
            alt="profile"
            className="w-28 h-28 rounded-full object-cover border-4 border-pink-300 mb-4"
          />
          <input
            type="file"
            onChange={(e) => setPfpFile(e.target.files[0])}
            className="mb-2"
          />
          <button
            onClick={handleUploadPFP}
            className="btn btn-sm btn-pink-500"
            disabled={loading || !pfpFile}
          >
            Upload
          </button>
        </div>

        {/* Add Shipping Address */}
        <div className="space-y-4 mb-6">
          <h2 className="text-xl font-semibold">Add Shipping Address</h2>

          <div>
            <label className="font-semibold">Full Name (for delivery)</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="input input-bordered w-full mt-1"
              placeholder="Your real name"
            />
          </div>

          <div>
            <label className="font-semibold">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input input-bordered w-full mt-1"
              placeholder="Phone number"
            />
          </div>

          <div>
            <label className="font-semibold">Shipping Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="input input-bordered w-full mt-1"
              placeholder="Enter your shipping address"
            />
          </div>

          <button
            className="btn btn-primary w-full mt-2"
            onClick={handleSaveAddress}
            disabled={loading}
          >
            Save Shipping Address
          </button>
        </div>

        {/* Existing Addresses */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Your Shipping Addresses</h2>
          {shippingList.length === 0 && <p>No addresses added yet.</p>}

          {shippingList.map((addr) => (
            <div
              key={addr.id}
              className="p-3 border rounded-lg shadow-sm bg-white text-black"
            >
              <p>
                <strong>Username:</strong> {addr.username}
              </p>
              <p>
                <strong>Full Name:</strong> {addr.full_name}
              </p>
              <p>
                <strong>Phone:</strong> {addr.phone_number}
              </p>
              <p>
                <strong>Address:</strong> {addr.shipping_address}
              </p>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleEditAddress(addr)}
                  className="btn btn-sm btn-primary"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDeleteAddress(addr.id)}
                  className="btn btn-sm btn-error"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DELETE MODAL */}
      <dialog id="deleteModal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-center">Delete Address?</h3>
          <p className="text-center mt-2">This action cannot be undone.</p>

          <div className="flex justify-center gap-4 mt-6">
            <button className="btn btn-error" onClick={handleConfirmDelete}>
              Delete
            </button>
            <button
              className="btn"
              onClick={() => document.getElementById("deleteModal").close()}
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>

      {/* EDIT MODAL */}
      <dialog id="editModal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-center mb-4">Edit Address</h3>

          <div className="space-y-3">
            <input
              className="input input-bordered w-full"
              value={editData?.full_name || ""}
              onChange={(e) =>
                setEditData({ ...editData, full_name: e.target.value })
              }
              placeholder="Full name"
            />

            <input
              className="input input-bordered w-full"
              value={editData?.phone_number || ""}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  phone_number: e.target.value,
                })
              }
              placeholder="Phone number"
            />

            <textarea
              className="textarea textarea-bordered w-full"
              value={editData?.shipping_address || ""}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  shipping_address: e.target.value,
                })
              }
              placeholder="Shipping address"
            ></textarea>
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <button className="btn btn-primary" onClick={handleSaveEdit}>
              Save
            </button>
            <button
              className="btn"
              onClick={() => document.getElementById("editModal").close()}
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
