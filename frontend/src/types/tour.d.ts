export interface Tour {
  _id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  price: number;
  desc: string;
  link: string;
  image: string;
  location?: string;
  maxParticipants?: number;
  included?: string[];
  excluded?: string[];
  highlights?: string[];
  itinerary?: {
    day: number;
    title: string;
    description: string;
  }[];
  rating?: number;
  reviews?: {
    user: string;
    rating: number;
    comment: string;
    date: string;
  }[];
}