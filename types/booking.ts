import { IPlan } from '@/types/plan';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'rejected';

export interface Booking {
  _id: string;
  user: string;
  plan: IPlan;
  date: Date;
  bookingDetails: {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    occasion: string;
    numberOfPeople: number;
    specialRequirements: string;
  };
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBookingDto {
  plan: {
    id: string;
    name: string;
    price: number;
    image?: string;
  };
  date: Date;
  bookingDetails: {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    occasion: string;
    numberOfPeople: number;
    specialRequirements?: string;
  };
}