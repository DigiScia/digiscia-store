import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchPage() {
  const query = useQuery().get("q") || "";
  const [searchQuery, setSearchQuery] = useState(query);
  const [products, setProducts] = useState([]); // doit être un tableau
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
      const fetchProducts = async () => {
        setLoading(true);
        try {
          // ✅ On utilise juste le endpoint correct
          const res = await axios.get("http://localhost:8000/products/");

          // Vérifier ce que renvoie l'API
          console.log("API response:", res.data);

          // Vérifier si c'est bien un tableau
          const productsList = Array.isArray(res.data) ? res.data : res.data.results || [];
          setProducts(productsList);
        } catch (err) {
          console.error(err);
          setProducts([]);
        } finally {
          setLoading(false);
        }
      };

      fetchProducts();
    }, []);


  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };
  const filteredProducts = searchQuery
  ? products.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  : products;


  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Barre de recherche centrée */}
      <form onSubmit={handleSearch} className="flex justify-center mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher un produit..."
          className="w-1/2 px-4 py-2 border rounded-l shadow"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-r"
        >
          Rechercher
        </button>
      </form>

      {/* Résultats produits */}
      {filteredProducts.length === 0 ? (
          <p className="text-center">Aucun produit trouvé.</p>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {filteredProducts.map((p) => (
              <div key={p.id} className="border rounded p-3 hover:shadow-lg transition">
                <img src={p.image} alt={p.name} className="w-full h-40 object-cover mb-2" />
                <h2 className="font-semibold">{p.name}</h2>
                <p>{p.price} FCFA</p>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
