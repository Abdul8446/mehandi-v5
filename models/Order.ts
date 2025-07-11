
// models/Order.ts
import mongoose, { Schema, model, Document } from 'mongoose';

export type OrderStatus = 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Return Requested' | 'Returned';
export type PaymentStatus = 'Paid' | 'Refunded' | 'Failed' | 'Pending';
export type ReturnStatus = 'Pending' | 'Approved' | 'Rejected';

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image: string[];
  returnRequested?: boolean;
  returnQuantity?: number;
  returnedQuantity?: number;
  remainingQuantity?: number;
  returnReason?: string;
  returnStatus?: ReturnStatus;
  originalPrice?: number;
  returnDetails?: string;
}

export interface ShippingAddress {
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Customer {
  name: string;
  email: string;
  phone: string;
}

export interface IOrder extends Document {
  _id: string;
  orderId: string;
  userId: string;
  customer: Customer;
  items: OrderItem[];
  totalAmount: number;
  shippingCost: number;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  trackingId?: string;
  shippedAt?: Date;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  returnWindowEnd?: Date;
}

const OrderSchema = new Schema<IOrder>({
  orderId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  items: [{
    productId: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    image: { type: [String], required: true },
    returnRequested: { type: Boolean, default: false },
    returnQuantity: { type: Number, default: 0 },
    returnedQuantity: { type: Number, default: 0 },
    remainingQuantity: { type: Number },
    returnReason: { type: String },
    returnStatus: { 
      type: String, 
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending'
    },
    originalPrice: { type: Number },
    returnDetails: { type: String }
  }],
  totalAmount: { type: Number, required: true },
  shippingCost: { type: Number, required: true },
  paymentStatus: { 
    type: String, 
    enum: ['Paid', 'Refunded', 'Failed', 'Pending'], 
    default: 'Paid' 
  },
  status: { 
    type: String, 
    enum: ['Confirmed', 'Shipped', 'Delivered', 'Cancelled', 'Return Requested', 'Returned'], 
    default: 'Confirmed' 
  },
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  trackingId: { type: String },
  shippedAt: { type: Date },
  deliveredAt: { type: Date },
  returnWindowEnd: { type: Date }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Calculate remaining quantity before saving
OrderSchema.pre('save', function(next) {
  this.items = this.items.map(item => {
    if (item.returnRequested && item.remainingQuantity === undefined) {
      item.remainingQuantity = item.quantity - (item.returnedQuantity || 0);
    }
    return item;
  });
  next();
});

const Order = mongoose.models?.Order || model<IOrder>('Order', OrderSchema);
export default Order;

