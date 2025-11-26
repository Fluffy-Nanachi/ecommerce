import React, { useEffect, useState } from "react";
import supabase from "../supabase-client";
import Navbar from "../components/Navbar";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const userId = session.user.id;
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (!error) setOrders(data);
      setLoading(false);
    };

    fetchOrders();
  }, []);

  const markAsReceived = async (orderId) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: "completed" })
      .eq("id", orderId);

    if (!error) {
      setOrders(
        orders.map((o) =>
          o.id === orderId ? { ...o, status: "completed" } : o
        )
      );
    }
  };

  if (loading) return <p>Loading orders...</p>;

  const totalAmount = orders.reduce(
    (sum, order) => sum + order.item_price * order.quantity,
    0
  );

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
        return <span className="badge">Unknown</span>;
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>

        {/* Total summary */}

        {orders.length === 0 && <p>No orders yet.</p>}

        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-4 bg-white rounded-lg shadow flex flex-col md:flex-row justify-between items-start md:items-center"
            >
              <div className="space-y-1">
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
              </div>
              <div className="mt-4 md:mt-0">
                {order.status !== "completed" && (
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => markAsReceived(order.id)}
                  >
                    Mark as Received
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
