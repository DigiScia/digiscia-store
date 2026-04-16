import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";
import { ShoppingCart, Star, ArrowLeft, ShieldCheck, Truck, RotateCcw, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getProductById } from "@/api/product";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const data = await getProductById(id);
        // Transformation
        const transformedProduct = {
            ...data,
            price: parseFloat(data.discounted_price || data.current_price),
            oldPrice: data.promotion > 0 ? parseFloat(data.current_price) : undefined,
            categoryName: data.category?.name || "Non classé",
            badge: data.promotion > 0 ? `-${Math.round(data.promotion)}%` : undefined,
            rating: 5.0 // Fallback
        };
        setProduct(transformedProduct);
      } catch (error) {
        console.error("Erreur récupération produit:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    toast.success(`${product.name} ajouté au panier`);
  };

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-muted-foreground">Analyse des spécifications techniques...</p>
        </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Produit introuvable</h2>
          <Link to="/products" className="text-primary hover:underline">Retour à la boutique</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32">
      <Navbar />
      <main className="container mx-auto px-4 lg:px-8 py-12">
        <Link to="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Retour aux produits
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative aspect-square rounded-3xl glass flex items-center justify-center p-12 overflow-hidden shadow-2xl"
          >
            <div className="absolute inset-0 bg-primary/5 blur-3xl" />
            <img 
              src={product.image} 
              alt={product.name} 
              className="relative z-10 w-full h-full object-contain hover:scale-105 transition-transform duration-500"
            />
            {product.badge && (
              <span className="absolute top-6 left-6 px-4 py-1.5 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest rounded-full z-20 shadow-lg">
                {product.badge}
              </span>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-8"
          >
            <div>
              <span className="text-sm text-primary font-semibold uppercase tracking-widest mb-2 block">{product.categoryName}</span>
              <h1 className="text-4xl lg:text-5xl font-display font-bold mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-warning text-warning" />
                  <span className="font-bold text-lg">{product.rating}</span>
                </div>
                <span className="text-muted-foreground">|</span>
                <span className="text-muted-foreground text-sm">Authenticité Certifiée</span>
              </div>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {product.description || "Découvrez une qualité exceptionnelle et une performance inégalée avec ce produit DigiScia Prime. Conçu pour les utilisateurs les plus exigeants."}
            </p>

            <div className="flex items-end gap-4">
              <span className="text-4xl font-display font-bold text-foreground">
                {product.price.toLocaleString()} FCFA
              </span>
              {product.oldPrice && (
                <span className="text-xl text-muted-foreground line-through mb-1">
                  {product.oldPrice.toLocaleString()}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center border border-border/50 rounded-xl overflow-hidden bg-muted/30">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-4 py-3 hover:bg-muted transition-colors"
                >
                  -
                </button>
                <span className="w-12 text-center font-bold">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-4 py-3 hover:bg-muted transition-colors"
                >
                  +
                </button>
              </div>

              <button 
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-3 bg-primary text-primary-foreground py-4 px-8 rounded-xl font-bold hover:opacity-90 transition-all shadow-xl group"
              >
                <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Ajouter au panier
              </button>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-border/30">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Truck className="w-5 h-5 text-primary" />
                <span>Livraison Rapide</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span>Garantie 1 An</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <RotateCcw className="w-5 h-5 text-primary" />
                <span>Retours Gratuits</span>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetails;
