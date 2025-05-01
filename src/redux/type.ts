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
}

export interface Product {
  id: number;
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
  price: number | string;
  image?: string;
  bookings?: number;
  provider: number;
  category: string;
}

export interface Vendor {
  id: number;
  user: number;
  name: string;
  email: string;
  address: string;
  phone: string;
}

export interface VendorForm {
  user: number;
  vendor_name: string;
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

export interface DashboardData {
  products: number;
  balance: number;
  users: number;
  orders: number;
  latest_transactions: {
    id: number;
    product: string;
    customer: string;
    date: string;
    image: string;
    amount: number;
    method: string;
    status: string;
  }[];
  sales_today: number;
}
