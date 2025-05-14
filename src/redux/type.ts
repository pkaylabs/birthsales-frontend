export interface User {
  id: number;
  last_login?: string; // ISO timestamp
  email: string;
  phone: string;
  name: string;
  address: string;
  avatar: string | null;
  deleted?: boolean;
  user_type: "VENDOR" | "ADMIN" | "DELIVERY";
  isActive: boolean;
  is_staff?: boolean;
  is_superuser?: boolean;
  created_from_app?: boolean;
  phone_verified?: boolean;
  email_verified?: boolean;
  dateAdded: string; // ISO timestamp
  updated_at?: string; // ISO timestamp
}

export interface UserForm {
  id: number;
  email: string;
  phone: string;
  name: string;
  address: string;
  user_type: string; // for backend on create/update
  password?: string;
  avatarFile: File | null; // for frontend to upload image
  avatarPreview: string | null; // for frontend to show preview of image
}

export interface Business {
  id: number;
  name: string;
  address: string;
  contact_info: string;
  created_at: string;
}

export interface Plan {
  id: string;
  name: string;
  price: string;
  interval: string; // e.g., "month" or "year"
  description: string;
  can_create_product: boolean;
  can_create_service: boolean;
}

export interface Product {
  id: string;
  business_id: number;
  name: string;
  category: string;
  price: number;
  qty: number;
  date_added: string;
  main_image_url: string;
  status: "pending" | "approved";
}

export interface Service {
  id?: number | string;
  name: string;
  description: string;
  price: number;
  image?: string;
  bookings?: number;
  vendor_id: string;
  vendor: Vendor;
  // category: string;
}

export interface Vendor {
  id: number;
  user: number;
  vendor_name: string;
  vendor_id: string;
  vendor_email: string;
  vendor_address: string;
  vendor_phone: string;
}

export interface VendorForm {
  user?: number;
  vendor_name: string;
  // vendor_id: string;
  vendor_email: string;
  vendor_address: string;
  vendor_phone: string;
}

export interface Booking {
  id: number;
  user: number;
  service: number;
  date: string;
  status: string; // e.g., 'PENDING', 'CONFIRMED', 'CANCELLED'
  vendor: number;
}

export interface BookingForm {
  user: number;
  service: number;
  date: string;
  status: string;
  vendor: number;
}

export interface ServiceForm {
  name: string;
  description: string;
  price: string;
  vendor_id: string;
  imageFile?: File | null;
  imagePreview?: string;
}

export interface Banner {
  id: number;
  image: string;
  title: string;
  link: string;
  is_active: boolean;
}

export interface Category {
  id: number | string;
  name: string;
  description: string;
  image?: string;
}

export interface CategoryForm {
  name: string;
  imageFile?: File | null;
  description?: string;
  imagePreview?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  in_stock: boolean;
  vendor: string;
  image?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  original_price?: number;
  discount_percent?: number;
  rating?: number;
  reviews_count?: number;
  available_sizes?: string[];
  available_colors?: string[];
}

export interface ProductForm {
  name: string;
  description: string;
  price: number;
  vendor: number;
  imageFile?: File;
}

export interface HomePageData {
  banners: Banner[];
  categories: Category[];
  products: Product[];
  best_selling_products: Product[];
  new_arrivals: Product[];
}

export interface OrderItem {
  id: number;
  product: number;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  items: OrderItem[];
  payment_status: string;
  total_price: number;
  vendor_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  user: number;
}

export interface Subscriptions {
  id: number;
  vendor_name: string;
  package_name: string;
  expired: boolean;
  payment_status?: null;
  vendor: number;
  package: number;
  package_price: number
}
