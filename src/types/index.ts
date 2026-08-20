export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  sort_order: number;
  created_at: string;
}

export interface Collection {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  compare_price: number | null;
  category_id: string | null;
  collection_id: string | null;
  material: string | null;
  dimensions: string | null;
  color: string | null;
  in_stock: boolean;
  is_featured: boolean;
  is_new: boolean;
  bestseller: boolean;
  images: string[];
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string | null;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string | null;
  district: string | null;
  note: string | null;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
  payment_method: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_image: string | null;
  price: number;
  quantity: number;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  image_url: string | null;
  published: boolean;
  created_at: string;
}

export interface Promotion {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  discount_text: string | null;
  active: boolean;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  is_admin: boolean;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
