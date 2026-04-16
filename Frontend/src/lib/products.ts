import productHeadphones from "@/assets/product-headphones.png";
import productPhone from "@/assets/product-phone.png";
import productEarbuds from "@/assets/product-earbuds.png";
import productArduino from "@/assets/product-arduino.png";
import productCable from "@/assets/product-cable.png";
import productCharger from "@/assets/product-charger.png";

export interface Product {
  id: string;
  image: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  rating: number;
  badge?: string;
  description?: string;
}

export const products: Product[] = [
  {
    id: "1",
    image: productHeadphones,
    name: "Casque Bluetooth Pro ANC",
    category: "Audio",
    price: 45000,
    oldPrice: 59000,
    rating: 4.8,
    badge: "Promo",
    description: "Expérience sonore immersive avec réduction de bruit active de pointe."
  },
  {
    id: "2",
    image: productPhone,
    name: "Smartphone Ultra 256Go",
    category: "Téléphones",
    price: 185000,
    rating: 4.9,
    badge: "Nouveau",
    description: "Le summum de la technologie mobile avec un écran OLED splendide."
  },
  {
    id: "3",
    image: productEarbuds,
    name: "Écouteurs sans fil TWS",
    category: "Audio",
    price: 18500,
    oldPrice: 25000,
    rating: 4.6,
    description: "Liberté totale de mouvement avec une qualité sonore cristalline."
  },
  {
    id: "4",
    image: productArduino,
    name: "Kit Arduino Mega Starter",
    category: "Arduino & DIY",
    price: 32000,
    rating: 4.7,
    description: "Tout ce dont vous avez besoin pour commencer vos projets électroniques."
  },
  {
    id: "5",
    image: productCable,
    name: "Câble USB-C Tressé 2m",
    category: "Câbles",
    price: 4500,
    rating: 4.5,
    description: "Durabilité exceptionnelle et charge ultra-rapide pour tous vos appareils."
  },
  {
    id: "6",
    image: productCharger,
    name: "Chargeur Rapide 65W GaN",
    category: "Chargeurs",
    price: 15000,
    oldPrice: 19000,
    rating: 4.8,
    badge: "Best-seller",
    description: "Technologie GaN pour une charge puissante dans un format compact."
  },
];
