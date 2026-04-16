import { motion } from "framer-motion";
import { Monitor, Smartphone, Headphones, Cable, Cpu, Plug, Box, Laptop, Tablet, Watch, Speaker, MousePointer2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getCategories } from "@/api/category";
import { Link } from "react-router-dom";

const iconMap: Record<string, any> = {
  "ordinateur": Laptop,
  "laptop": Laptop,
  "téléphone": Smartphone,
  "phone": Smartphone,
  "audio": Headphones,
  "enceinte": Speaker,
  "cable": Cable,
  "câble": Cable,
  "chargeur": Plug,
  "arduino": Cpu,
  "diy": Cpu,
  "composant": Cpu,
  "tablette": Tablet,
  "tablet": Tablet,
  "montre": Watch,
  "accessoire": MousePointer2,
};

const getIcon = (name: string) => {
  const lowerName = name.toLowerCase();
  for (const [key, icon] of Object.entries(iconMap)) {
    if (lowerName.includes(key)) return icon;
  }
  return Box;
};

const CategoriesSection = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-24 relative">
        <div className="container mx-auto px-4 lg:px-8 text-center">
            <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="h-8 w-48 bg-muted rounded mb-2"></div>
                <div className="h-4 w-64 bg-muted rounded mb-8"></div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 w-100">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-32 bg-muted rounded-xl"></div>
                    ))}
                </div>
            </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-3">Nos catégories</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Tout l'univers tech en un seul endroit
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {categories.map((cat, i) => {
            const Icon = getIcon(cat.name);
            return (
              <motion.div
                key={cat.id || cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  to={`/products?category=${cat.id}`}
                  className="group flex flex-col items-center gap-3 p-6 rounded-xl glass glass-hover cursor-pointer h-full"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground text-center line-clamp-1">{cat.name}</span>
                  {cat.products_count !== undefined && (
                    <span className="text-xs text-muted-foreground">{cat.products_count}+</span>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
