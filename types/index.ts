export interface Program {
  id: string;
  title: string;
  description: string;
  rating: string;
  reviews: string;
  duration: string;
  iconName: string;
}

export interface PlacementStep {
  id: number;
  title: string;
  desc: string;
  iconName: string;
}

export interface FAQItem {
  q: string;
  a: string;
}