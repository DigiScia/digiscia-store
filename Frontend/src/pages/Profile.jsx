import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const API_BASE_URL = "http://127.0.0.1:8000"; // adapte si besoin (/api, etc.)

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    email: "",
  });
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState("");

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      navigate("/login");
      return;
    }

    const username = localStorage.getItem("username") || "";
    const email = localStorage.getItem("email") || "";
    setUser({ username, email });

    const fetchOrders = async () => {
      try {
        setLoadingOrders(true);
        setOrdersError("");

        const res = await fetch(`${API_BASE_URL}/orders/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) {
          setOrdersError("Impossible de récupérer vos commandes.");
          setOrders([]);
          return;
        }

        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
        setOrdersError("Erreur réseau lors du chargement des commandes.");
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleCancelOrder = async (orderId) => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      navigate("/login");
      return;
    }

    if (!window.confirm("Voulez-vous vraiment annuler cette commande ?")) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/orders/${orderId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ status: "cancelled" }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        console.error("Erreur annulation commande =>", data);
        alert("Impossible d'annuler cette commande.");
        return;
      }

      const updatedOrder = await res.json();
      setOrders((prev) =>
        prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
      );
    } catch (err) {
      console.error(err);
      alert("Erreur réseau lors de l'annulation.");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      navigate("/login");
      return;
    }

    if (!window.confirm("Supprimer définitivement cette commande ?")) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/orders/${orderId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.status === 204) {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
      } else {
        const data = await res.json().catch(() => null);
        console.error("Erreur suppression commande =>", data);
        alert("Impossible de supprimer cette commande.");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur réseau lors de la suppression.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Mon profil</h1>

        {/* Infos utilisateur */}
        <div className="auth-field">
          <label className="auth-label">Nom d&apos;utilisateur</label>
          <div className="auth-input" style={{ pointerEvents: "none" }}>
            {user.username || "-"}
          </div>
        </div>

        <div className="auth-field">
          <label className="auth-label">Email</label>
          <div className="auth-input" style={{ pointerEvents: "none" }}>
            {user.email || "-"}
          </div>
        </div>

        {/* Commandes */}
        <div className="auth-field" style={{ marginTop: "1.5rem" }}>
          <label className="auth-label">Mes commandes</label>
            <p className="text-sm text-gray-500">
              Cliquez sur une commande pour voir le détail.
            </p>
          {loadingOrders ? (
            <p className="auth-field-error">Chargement des commandes...</p>
          ) : ordersError ? (
            <p className="auth-field-error">{ordersError}</p>
          ) : orders.length === 0 ? (
            <p className="auth-field-error">Aucune commande pour le moment.</p>
          ) : (
            <ul className="orders-list">
              {orders.map((order) => (
                <li key={order.id} className="orders-item">
                  <Link to={`/commandes/${order.id}`} className="block">
                    <div className="orders-main">
                      <span className="font-semibold">Commande #{order.id}</span>
                      <span className={`px-2 py-1 rounded-full text-xs status-${order.status}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="orders-meta text-sm text-gray-600">
                      <span>Montant : {order.total_amount} FCFA</span>
                      <span>
                        • Date : {order.order_date
                          ? new Date(order.order_date).toLocaleString("fr-FR")
                          : "-"}
                      </span>
                    </div>

                  </Link>

                  {/* Boutons laissés en dehors du Link */}
                  {(order.status === "pending" || order.status === "processing") && (
                    <button
                      className="orders-action-btn"
                      onClick={() => handleCancelOrder(order.id)}
                    >
                      Annuler la commande
                    </button>
                  )}

                  {order.status === "pending" && (
                    <button
                      className="orders-action-btn delete"
                      onClick={() => handleDeleteOrder(order.id)}
                    >
                      Supprimer la commande
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
