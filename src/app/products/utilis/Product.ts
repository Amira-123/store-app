export interface Product {
  id: number;
  title: string | null;
  price: number;
  category?: string;
  description: string;
  image: string;
}
