import { useState, useMemo, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useSearchParams } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, FilterX, Loader2 } from "lucide-react";
import { getProducts } from "@/api/product";
import { getCategories } from "@/api/category";
import ScreenSplash from "@/components/ScreenSplash";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState("Tous");
  const [priceRange, setPriceRange] = useState([0, 2000000]); // Augmenté pour la tech premium
  
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodData, catData] = await Promise.all([
          getProducts(),
          getCategories()
        ]);
        setAllProducts(prodData);
        setAllCategories(catData);
        
        // Handle direct category filter from URL if present
        const catId = searchParams.get("category");
        if (catId) {
            const found = catData.find((c: any) => c.id.toString() === catId);
            if (found) setCategory(found.name);
        }
      } catch (error) {
        console.error("Erreur chargement Boutique:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchParams]);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q !== null) {
      setSearch(q);
    }
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                           p.description?.toLowerCase().includes(search.toLowerCase()) ||
                           p.category?.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "Tous" || p.category?.name === category;
      const matchesPrice = p.current_price >= priceRange[0] && p.current_price <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [allProducts, search, category, priceRange]);

  const resetFilters = () => {
    setSearch("");
    setCategory("Tous");
    setPriceRange([0, 2000000]);
    setSearchParams({});
  };

  if (loading) {
    return <ScreenSplash isLoading={loading} message="Chargement de l'inventaire" />;
  }

  return (
    <div className="min-h-screen pt-32">
      <Navbar />
      <main className="container mx-auto px-4 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Search className="w-4 h-4" /> Rechercher
              </h3>
              <div className="relative">
                <Input 
                  placeholder="Nom, modèle..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Catégories</h3>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tous">Tous les produits</SelectItem>
                  {allCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Prix Max</h3>
                <span className="text-sm font-medium text-primary">
                  {priceRange[1].toLocaleString()} FCFA
                </span>
              </div>
              <Slider 
                value={[priceRange[1]]} 
                max={2000000} 
                step={10000}
                onValueChange={(val) => setPriceRange([0, val[0]])}
              />
            </div>

            <button 
              onClick={resetFilters}
              className="w-full flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors border border-dashed rounded-lg"
            >
              <FilterX className="w-4 h-4" /> Réinitialiser
            </button>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">
                {filteredProducts.length} Produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
              </h2>
            </div>
            
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, i) => (
                  <ProductCard 
                    key={product.id} 
                    id={product.id}
                    name={product.name}
                    image={product.image}
                    category={product.category?.name || "Non classé"}
                    price={parseFloat(product.discounted_price || product.current_price)}
                    oldPrice={product.promotion > 0 ? parseFloat(product.current_price) : undefined}
                    rating={5.0} // Fallback
                    badge={product.promotion > 0 ? `-${Math.round(product.promotion)}%` : undefined}
                    index={i} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-muted/30 rounded-2xl border-2 border-dashed">
                <p className="text-muted-foreground">Aucun produit ne correspond à vos critères.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Products;
