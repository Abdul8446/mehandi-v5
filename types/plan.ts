// types/plan.d.ts
import { Document } from 'mongoose';

export interface IPlan extends Document {
  _id: string;
  name: string;
  description?: string;
  price: number;
  image: string;
}

// For frontend components
export interface Plan {
  _id: string;
  name: string;
  description?: string;
  price: number;
  image: string;
}