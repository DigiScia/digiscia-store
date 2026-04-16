import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Trash2, Minus, Plus, MessageSquare } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, cartCount, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();

  const parsePrice = (p: any): number => {
    if (typeof p === "number") return isNaN(p) ? 0 : p;
    if (!p) return 0;
    const cleaned = String(p).replace(/[^\d.]/g, "");
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  };

  const calculatedTotal = React.useMemo(() => {
    return cart.reduce((acc, item) => {
      const p = parsePrice(item.price) || parsePrice((item as any).current_price);
      const q = Number(item.quantity) || 0;
      return acc + (p * q);
    }, 0);
  }, [cart]);

  const displayTotal = cartTotal || calculatedTotal;

  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return;

    const message = `🧾 *FACTURE DIGISCIA STORE*\n` +
      `--------------------------------\n` +
      `Date: ${new Date().toLocaleDateString("fr-FR")}\n` +
      `--------------------------------\n\n` +
      `*ARTICLES :*\n` +
      cart.map(item => {
        const p = parsePrice(item.price) || parsePrice((item as any).current_price);
        return `• ${item.name}\n  ${item.quantity} x ${p.toLocaleString()} FCFA = *${(p * item.quantity).toLocaleString()} FCFA*`;
      }).join("\n\n") +
      `\n\n--------------------------------\n` +
      `*SOUS-TOTAL :* ${displayTotal.toLocaleString()} FCFA\n` +
      `*LIVRAISON :* GRATUITE\n` +
      `*TOTAL À PAYER : ${displayTotal.toLocaleString()} FCFA*\n` +
      `--------------------------------\n\n` +
      `_Merci de confirmer ma commande. _`;

    const whatsappUrl = `https://wa.me/212605109876?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-md z-[60]"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-background border-l border-border z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-border flex items-center justify-between bg-surface/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-display font-bold">Votre Panier</h2>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest leading-none mt-1">Digiscia Store</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors group">
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                  <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center animate-pulse">
                    <ShoppingCart className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-lg font-medium">Le panier est encore vide</p>
                    <p className="text-sm text-muted-foreground mt-2">Parcourez nos articles premium et commencez votre sélection.</p>
                  </div>
                  <button onClick={onClose} className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold shadow-lg hover:opacity-90 transition-all">
                    Découvrir la boutique
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map((item) => {
                    const currentItemPrice = parsePrice(item.price) || parsePrice((item as any).current_price);
                    return (
                      <div key={item.id} className="flex gap-4 group relative">
                        <div className="w-24 h-24 bg-muted/50 rounded-2xl flex items-center justify-center p-3 flex-shrink-0 group-hover:bg-muted transition-colors border border-border/50">
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <h3 className="text-sm font-bold text-foreground leading-tight line-clamp-2">{item.name}</h3>
                              <button 
                                onClick={() => removeFromCart(item.id)}
                                className="p-1.5 text-muted-foreground hover:text-destructive transition-colors shrink-0"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1 opacity-70">{item.category}</p>
                          </div>
                          
                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center border-2 border-primary/20 rounded-xl bg-muted/50 h-10 overflow-hidden">
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="h-full px-3 hover:bg-primary/10 transition-colors border-r-2 border-primary/10 flex items-center justify-center text-primary font-black text-lg"
                              >
                                -
                              </button>
                              <span className="w-10 text-center text-sm font-bold text-foreground">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="h-full px-3 hover:bg-primary/10 transition-colors border-l-2 border-primary/10 flex items-center justify-center text-primary font-black text-lg"
                              >
                                +
                              </button>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground mb-0.5">{currentItemPrice.toLocaleString()} FCFA /u</p>
                              <p className="text-sm font-bold text-foreground">{(currentItemPrice * item.quantity).toLocaleString()} FCFA</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {/* Debug only - hidden */}
                  <div className="hidden">{JSON.stringify(cart)}</div>
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-8 border-t border-border bg-muted/20 space-y-6 shadow-[0_-15px_40px_-20px_rgba(0,0,0,0.15)] rounded-t-3xl">
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">Caisse de facturation</span>
                  </div>
                  
                  <div className="space-y-3 bg-background/50 p-5 rounded-3xl border border-border/50">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Articles ({cartCount})</span>
                      <span className="font-bold text-foreground">{(displayTotal || 0).toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Livraison</span>
                      <span className="text-primary font-bold uppercase text-[10px] tracking-widest">Inclus (Gratuit)</span>
                    </div>
                    
                    <div className="pt-4 border-t border-border/50 flex justify-between items-end">
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest block mb-1">Total TTC</span>
                        <span className="text-3xl font-display font-black text-primary leading-none">
                          {(displayTotal || 0).toLocaleString()}
                        </span>
                        <span className="text-xs font-bold text-primary ml-1">FCFA</span>
                      </div>
                      <div className="text-right pb-1">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Net à payer</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <button 
                    onClick={handleWhatsAppCheckout}
                    className="w-full flex items-center justify-center gap-4 bg-[#25D366] text-white py-5 rounded-2xl font-black text-lg hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_15px_30px_-10px_rgba(37,211,102,0.5)] group"
                  >
                    <MessageSquare className="w-6 h-6 fill-white group-hover:scale-125 transition-transform" />
                    CONFIRMER LA COMMANDE
                  </button>
                  <button 
                    onClick={clearCart}
                    className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground hover:text-destructive transition-colors py-1 font-bold uppercase tracking-widest"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Réinitialiser le panier
                  </button>
                </div>
                <p className="text-[9px] text-center text-muted-foreground uppercase tracking-[0.3em] font-medium opacity-50">
                  Digiscia Store • Paiement Sécurisé • Authenticité Garantie
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
