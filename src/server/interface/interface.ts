export interface Transaction {
  id: number;
  userId: number;
  categoryId: number;
  company: string;
  amount: number;
  timestamp: string | null;
}

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string | null;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
}
