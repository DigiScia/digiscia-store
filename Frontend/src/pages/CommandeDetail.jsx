import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE_URL = "http://127.0.0.1:8000";

export default function CommandeDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      navigate("/login");
      return;
    }

    const fetchOrderDetail = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API_BASE_URL}/orders/${orderId}/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) {
          setError("Impossible de récupérer cette commande.");
          return;
        }

        const data = await res.json();
        console.log("ORDER DETAIL ===>", data); // pour debug
        setOrder(data);
      } catch (err) {
        console.error(err);
        setError("Erreur réseau lors du chargement de la commande.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId, navigate]);

  if (loading) {
    return <p className="auth-field-error">Chargement de la commande...</p>;
  }

  if (error) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <p className="auth-field-error">{error}</p>
          <button onClick={() => navigate(-1)} className="orders-action-btn">
            Retour
          </button>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">
          Commande #{order.id} – {order.client_username}
        </h1>

        {/* Récap principal */}
        <div className="mb-4 text-sm text-gray-700">
          <p>
            Statut : <span className="font-semibold">{order.status}</span>
          </p>
          <p>
            Montant :{" "}
            <span className="font-semibold">{order.total_amount} FCFA</span>
          </p>
          <p>
            Date de commande :{" "}
            {order.order_date
              ? new Date(order.order_date).toLocaleDateString("fr-FR")
              : "-"}
          </p>
          <p>
            Livraison prévue :{" "}
            {order.delivery_planned_date
              ? new Date(order.delivery_planned_date).toLocaleDateString("fr-FR")
              : "-"}
          </p>
          <p>
            Date de livraison :{" "}
            {order.delivery_date
              ? new Date(order.delivery_date).toLocaleDateString("fr-FR")
              : "Non livrée"}
          </p>
          <p>
            Paiement :{" "}
            {order.payment_status ?? "Non renseigné"}
          </p>
        </div>

        {/* Produits de la commande */}
        {order.order_products && order.order_products.length > 0 ? (
          <div>
            <h2 className="font-semibold mb-2 text-sm">Articles</h2>
            <ul className="divide-y divide-gray-200">
              {order.order_products.map((op) => (
                <li key={op.id ?? `${op.product}-${op.quantity}`} className="py-2 flex justify-between text-sm">
                  <div>
                    <p className="font-medium">
                      {op.product_name ?? op.product}
                    </p>
                    <p className="text-gray-500">
                      Quantité : {op.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p>{op.oneself_price} FCFA</p>
                    {op.oneself_price && op.quantity && (
                      <p className="text-gray-500">
                        Total : {Number(op.oneself_price) * Number(op.quantity)} FCFA
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            Aucun produit trouvé pour cette commande.
          </p>
        )}

        <button
          onClick={() => navigate(-1)}
          className="orders-action-btn mt-4"
        >
          Retour à mes commandes
        </button>
      </div>
    </div>
  );
}
