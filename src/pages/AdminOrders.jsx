import React, { useEffect, useState } from "react";
import supabase from "../supabase-client";
import NavbarAdmin from "../components/NavbarAdmin";

export default function AdminOrders() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [orders, setOrders] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Fetch all users from profiles (old working method)
  const fetchUsers = async () => {
    setLoadingUsers(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name");
    if (error) console.error(error);
    else setUsers(data || []);
    setLoadingUsers(false);
  };

  // Fetch orders for selected user
  const fetchOrders = async (userId) => {
    if (!userId) {
      setOrders([]);
      return;
    }
    setLoadingOrders(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) console.error(error);
    else setOrders(data || []);
    setLoadingOrders(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchOrders(selectedUser);
  }, [selectedUser]);

  // Update order status
  const updateStatus = async (orderId, newStatus) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);
    if (!error) fetchOrders(selectedUser);
  };

  const statusBadge = (status) => {
    switch (status) {
      case "on_process":
        return <span className="badge badge-warning">On Process</span>;
      case "on_delivery":
        return <span className="badge badge-info">On Delivery</span>;
      case "delivered":
        return <span className="badge badge-primary">Delivered</span>;
      case "completed":
        return <span className="badge badge-success">Completed</span>;
      default:
        return <span className="badge badge-outline">Unknown</span>;
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <NavbarAdmin />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-pink-600">
          🌸 User Orders
        </h1>

        {/* User Selector */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Select User:</label>
          {loadingUsers ? (
            <p>Loading users...</p>
          ) : (
            <select
              className="select select-bordered w-full max-w-xs"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="">-- Select a User --</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.full_name || "No Name"}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Orders */}
        {loadingOrders ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-500">
            {selectedUser
              ? "No orders for this user."
              : "Select a user to see orders."}
          </p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border rounded-2xl shadow-md p-6 flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-xl transition-shadow"
              >
                <div className="space-y-2">
                  <p>
                    <strong>Item:</strong> {order.item_name}
                  </p>
                  <p>
                    <strong>Price:</strong> ₱{order.item_price}
                  </p>
                  <p>
                    <strong>Quantity:</strong> {order.quantity}
                  </p>
                  <p>
                    <strong>Status:</strong> {statusBadge(order.status)}
                  </p>
                  <p className="text-lg font-bold text-pink-600">
                    Total: ₱{order.item_price * order.quantity}
                  </p>
                </div>

                <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
                  {order.status !== "completed" && (
                    <>
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => updateStatus(order.id, "on_process")}
                      >
                        On Process
                      </button>
                      <button
                        className="btn btn-sm btn-info"
                        onClick={() => updateStatus(order.id, "on_delivery")}
                      >
                        On Delivery
                      </button>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => updateStatus(order.id, "delivered")}
                      >
                        Delivered
                      </button>
                    </>
                  )}
                  {/* Completed orders show only the badge */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
