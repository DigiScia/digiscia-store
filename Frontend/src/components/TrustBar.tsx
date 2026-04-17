import { motion } from "framer-motion";
import { Truck, ShieldCheck, RefreshCw, Headphones } from "lucide-react";

const items = [
  { icon: Truck, title: "Livraison rapide", desc: "24-48h partout" },
  { icon: ShieldCheck, title: "Paiement à la livraison", desc: "100% sécurisé" },
  { icon: RefreshCw, title: "Retour sous 14 jours", desc: "Satisfait ou remboursé" },
  { icon: Headphones, title: "Support 24/7", desc: "Toujours disponible" },
];

const TrustBar = () => (
  <section className="py-16 border-y border-border/40">
    <div className="container mx-auto px-4 lg:px-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-4"
          >
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <item.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">{item.title}</div>
              <div className="text-xs text-muted-foreground">{item.desc}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TrustBar;
