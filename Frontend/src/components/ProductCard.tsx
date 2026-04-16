import { motion } from "framer-motion";
import { ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

interface ProductCardProps {
  id: string;
  image: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  rating: number;
  badge?: string;
  index: number;
}

const ProductCard = ({ id, image, name, category, price, oldPrice, rating, badge, index }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ id, image, name, category, price, oldPrice, rating, badge, index });
    toast.success(`${name} ajouté au panier`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -6 }}
      className="group rounded-xl glass glass-hover overflow-hidden"
    >
      <Link to={`/product/${id}`} className="block">
        <div className="relative aspect-square bg-surface p-6 flex items-center justify-center overflow-hidden">
          {badge && (
            <span className="absolute top-3 left-3 px-2.5 py-1 bg-primary text-primary-foreground text-[10px] font-semibold uppercase tracking-wider rounded-md z-10">
              {badge}
            </span>
          )}
          <img
            src={image}
            alt={name}
            loading="lazy"
            width={512}
            height={512}
            className="w-3/4 h-3/4 object-contain group-hover:scale-110 transition-transform duration-500"
          />
          <button 
            onClick={handleAddToCart}
            className="absolute bottom-3 right-3 p-2.5 rounded-lg bg-primary text-primary-foreground opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 glow-sm z-20"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">{category}</span>
          <h3 className="text-sm font-medium text-foreground mt-1 line-clamp-1">{name}</h3>
          <div className="flex items-center gap-1 mt-2">
            <Star className="w-3 h-3 fill-warning text-warning" />
            <span className="text-xs text-muted-foreground">{rating}</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-base font-display font-semibold text-foreground">
              {price.toLocaleString("fr-FR")} FCFA
            </span>
            {oldPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {oldPrice.toLocaleString("fr-FR")}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
