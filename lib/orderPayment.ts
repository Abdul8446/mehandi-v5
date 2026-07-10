import dbConnect from './mongoose';
import Order from '@/models/Order';
import Product from '@/models/Product';
import Cart from '@/models/Cart';

export async function processSuccessfulPayment(orderId: string) {
  await dbConnect();

  // Find the order
  const order = await Order.findOne({ orderId });
  if (!order) {
    console.error(`[Payment Processing] Order not found: ${orderId}`);
    return null;
  }

  // Check if it's already Paid to ensure idempotency
  if (order.paymentStatus === 'Paid') {
    console.log(`[Payment Processing] Order ${orderId} is already marked as Paid. Skipping stock update.`);
    return order;
  }

  console.log(`[Payment Processing] Processing successful payment for order: ${orderId}`);

  // 1. Update payment status and order status
  order.paymentStatus = 'Paid';
  order.status = 'Confirmed';
  await order.save();

  // 2. Fulfill stock and release reservations
  try {
    for (const item of order.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.stock = Math.max(0, product.stock - item.quantity);
        product.reserved = Math.max(0, (product.reserved || 0) - item.quantity);
        if (product.stock <= 0) {
          product.inStock = false;
        }
        await product.save();
        console.log(`[Payment Processing] Updated stock for product ${item.productId}: stock=${product.stock}, reserved=${product.reserved}`);
      } else {
        console.warn(`[Payment Processing] Product ${item.productId} not found during stock update.`);
      }
    }
  } catch (error) {
    console.error(`[Payment Processing] Failed to update product stock for order ${orderId}:`, error);
  }

  // 3. Clear database cart for the user
  try {
    await Cart.findOneAndUpdate(
      { userId: order.userId },
      { $set: { items: [], expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } }
    );
    console.log(`[Payment Processing] Cleared cart in DB for user: ${order.userId}`);
  } catch (error) {
    console.error(`[Payment Processing] Failed to clear DB cart for user ${order.userId}:`, error);
  }

  return order;
}
