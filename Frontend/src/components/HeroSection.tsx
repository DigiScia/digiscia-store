import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import heroLaptop from "@/assets/hero-laptop.png";
import { useNavigate } from "react-router-dom";
 
const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass w-fit text-sm"
            >
              <Zap className="w-3.5 h-3.5 text-primary" />
              <span className="text-muted-foreground">Nouveautés disponibles</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold leading-[1.05] tracking-tight">
              La tech qui
              <br />
              <span className="text-gradient">vous inspire</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
              Ordinateurs, téléphones, audio et composants électroniques. Qualité premium, prix accessibles.
            </p>

            <div className="flex flex-wrap gap-4 mt-2">
              <button 
                onClick={() => navigate("/products")}
                className="group inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-all glow-sm"
              >
                Explorer la boutique
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => navigate("/products")}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm text-foreground glass glass-hover"
              >
                Meilleures ventes
              </button>
            </div>

            <div className="flex items-center gap-8 mt-4 pt-4 border-t border-border/50">
              {[
                { value: "2K+", label: "Produits" },
                { value: "4.9★", label: "Avis clients" },
                { value: "24h", label: "Livraison" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-lg font-display font-semibold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative flex justify-center"
          >
            <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-3xl" />
            <img
              src={heroLaptop}
              alt="Ordinateur portable premium"
              width={1024}
              height={768}
              className="relative z-10 w-full max-w-lg animate-float drop-shadow-2xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
