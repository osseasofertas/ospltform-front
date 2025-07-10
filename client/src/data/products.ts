import { AppProduct } from "@/types";

// Frontend-only product data - no backend dependency
export const mockProducts: AppProduct[] = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    category: "Electronics",
    imageUrl: "/attached_assets/prints/PT2.png",
    minEarning: "2.50",
    maxEarning: "4.00",
    active: true,
  },
  {
    id: 2,
    name: "Smart Home Security Camera",
    category: "Home & Garden",
    imageUrl: "/attached_assets/prints/PT3.png",
    minEarning: "1.80",
    maxEarning: "3.20",
    active: true,
  },
  {
    id: 3,
    name: "Professional Car Care Kit",
    category: "Automotive",
    imageUrl: "/attached_assets/prints/PT10.png",
    minEarning: "3.00",
    maxEarning: "5.00",
    active: true,
  },
  {
    id: 4,
    name: "Multi-Tool Set",
    category: "Tools & Hardware",
    imageUrl: "/attached_assets/prints/PT50.png",
    minEarning: "1.00",
    maxEarning: "2.50",
    active: true,
  },
  {
    id: 5,
    name: "Gaming Mechanical Keyboard",
    category: "Electronics",
    imageUrl: "/attached_assets/prints/PT75.png",
    minEarning: "2.80",
    maxEarning: "4.20",
    active: true,
  },
  {
    id: 6,
    name: "Fitness Tracker Watch",
    category: "Sports & Fitness",
    imageUrl: "/attached_assets/prints/PT100.png",
    minEarning: "1.50",
    maxEarning: "3.50",
    active: true,
  },
  {
    id: 7,
    name: "Skincare Routine Set",
    category: "Beauty & Personal Care",
    imageUrl: "/attached_assets/prints/PT150.png",
    minEarning: "2.20",
    maxEarning: "3.80",
    active: true,
  },
  {
    id: 8,
    name: "Professional Knife Set",
    category: "Kitchen & Dining",
    imageUrl: "/attached_assets/prints/PT200.png",
    minEarning: "1.90",
    maxEarning: "3.60",
    active: true,
  },
];

export const getProducts = (): AppProduct[] => {
  return mockProducts;
};

export const getProduct = (id: number): AppProduct | undefined => {
  return mockProducts.find(product => product.id === id);
};