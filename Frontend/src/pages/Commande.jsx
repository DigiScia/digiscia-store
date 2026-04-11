import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import CommandItem from "../Components/commandItem/CommandItem";
import FadeInOnScroll from "../Components/fadeInOnScroll/FadeInOnScroll";
import { getProfile } from "../api/user";
import { getCommands } from "../api/command";
import "../App.css";

const Commande = () => {
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, ordersData] = await Promise.all([
          getProfile(),
          getCommands(),
        ]);
        setProfile(profileData);
        setOrders(ordersData);
      } catch (err) {
        console.error("Erreur chargement profil/commandes :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center md:items-start md:flex-row p-10 gap-10 h-screen mb-10">
      {/* Sidebar compte / commandes */}
      <div className="w-60">
        <FadeInOnScroll>
          <ul className="flex flex-col items-center gap-2 md:items-start border border-gray-300 p-5 rounded-xl">
            <Link to="/Compte">
              <li className="font-bold">Votre Compte</li>
            </Link>
            <Link to="/Commandes">
              <li className="font-bold text-red-500">Vos Commandes</li>
            </Link>
          </ul>
        </FadeInOnScroll>
      </div>

      {/* Liste des commandes */}
      <div className="sm:flex w-full h-full">
        <FadeInOnScroll>
          <div className="w-full border border-gray-300 p-5 rounded-sm bg-gray-100 border-b-red-300">
            <h2>Commandes en cours</h2>
          </div>

          <div className="h-full flex flex-col overflow-y-auto custom-scroll-hide">
            {loading ? (
              <div className="w-full text-center p-10">
                <p>Chargement des commandes...</p>
              </div>
            ) : orders.length ? (
              orders.map((order) => (
                <div key={order.id} className="border-t-red-300">
                  <CommandItem order={order} profile={profile} />
                </div>
              ))
            ) : (
              <div className="w-full text-center p-10 text-red-400">
                <h1>Vous n&apos;avez aucune commande</h1>
              </div>
            )}
          </div>
        </FadeInOnScroll>
      </div>
    </div>
  );
};

export default Commande;
