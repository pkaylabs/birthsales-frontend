export interface User {
    id: number;
    last_login: string;        // ISO timestamp
    email: string;
    phone: string;
    name: string;
    address: string | null;
    avatar: string | null;
    deleted: boolean;
    user_type: 'CLIENT' | 'VENDOR' | 'ADMIN' | 'DELIVERY';
    is_active: boolean;
    is_staff: boolean;
    is_superuser: boolean;
    created_from_app: boolean;
    phone_verified: boolean;
    email_verified: boolean;
    created_at: string;        // ISO timestamp
    updated_at: string;        // ISO timestamp
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
    package_name: string;
    package_description: string;  
    package_price: string;
    created_at: string;
    updated_at: string;
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
    status: 'pending' | 'approved';
  }
  
