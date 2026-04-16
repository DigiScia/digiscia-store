import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import { useEffect, useState } from "react";
import { getProducts } from "@/api/product";
import { Link } from "react-router-dom";

const FeaturedProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des produits:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
      return (
          <section className="py-24 relative">
              <div className="container mx-auto px-4 lg:px-8 text-center">
                  <div className="animate-pulse grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                      {[1, 2, 3, 4, 5, 6].map(i => (
                          <div key={i} className="h-64 bg-muted rounded-2xl"></div>
                      ))}
                  </div>
              </div>
          </section>
      );
  }

  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-14"
        >
          <div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-3">Produits populaires</h2>
            <p className="text-muted-foreground">Sélection de nos meilleures ventes</p>
          </div>
          <Link to="/products" className="hidden sm:inline-flex text-sm text-primary hover:underline">
            Voir tout →
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {products.slice(0, 6).map((product, i) => (
            <ProductCard 
              key={product.id} 
              id={product.id}
              name={product.name}
              image={product.image}
              category={product.category?.name || "Non classé"}
              price={parseFloat(product.discounted_price || product.current_price)}
              oldPrice={product.promotion > 0 ? parseFloat(product.current_price) : undefined}
              rating={5.0} // Fallback since rating isn't in backend yet
              badge={product.promotion > 0 ? `-${Math.round(product.promotion)}%` : undefined}
              index={i} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
