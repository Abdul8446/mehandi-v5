// app/api/admin/dashboard/route.ts
import { NextResponse } from 'next/server';
import Order from '@/models/Order';
import Booking from '@/models/Booking';
import User from '@/models/User';
import Product from '@/models/Product';
import dbConnect from '@/lib/mongoose';
import { format, subDays } from 'date-fns';

export async function GET() {
  try {
    await dbConnect();

    // Get date ranges for calculations
    const now = new Date();
    const sevenDaysAgo = subDays(now, 7);
    const thirtyDaysAgo = subDays(now, 30);
    const sixtyDaysAgo = subDays(now, 60);
    const ninetyDaysAgo = subDays(now, 90);
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const todayEnd = new Date(now.setHours(23, 59, 59, 999));

    // Parallel data fetching
    const [
      productRevenueCurrent,
      productRevenuePrevious,
      shippingRevenueCurrent,
      shippingRevenuePrevious,
      totalOrdersCurrent,
      totalOrdersPrevious,
      totalCustomersCurrent,
      totalCustomersPrevious,
      totalBookingsCurrent,
      totalBookingsPrevious,
      recentOrders,
      recentBookings,
      topProducts,
      productsCount,
      activePlansCount,
      lowStockProducts,
      todaysBookings,
      revenueLast7Days,
      revenueLast30Days,
      categorySales,
      bookingTrends,
      // New additions for shipping costs
      shippingLast7Days,
      shippingLast30Days,
      shippingLast90Days,
      // New additions for revenue (product only)
      revenueLast90Days,
      // New additions for category sales
      categorySalesLast7Days,
      categorySalesLast30Days,
      categorySalesLast90Days,
    ] = await Promise.all([
      // Product revenue (current period)
      Order.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo }, status: { $ne: 'Cancelled' } } },
        { $unwind: '$items' },
        { $group: { 
          _id: null, 
          total: { $sum: { $multiply: ['$items.quantity', '$items.price'] } } 
        } }
      ]),
      
      // Product revenue (previous period)
      Order.aggregate([
        { $match: { createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }, status: { $ne: 'Cancelled' } } },
        { $unwind: '$items' },
        { $group: { 
          _id: null, 
          total: { $sum: { $multiply: ['$items.quantity', '$items.price'] } } 
        } }
      ]),
      
      // Shipping costs (current period)
      Order.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo }, status: { $ne: 'Cancelled' } } },
        { $group: { _id: null, total: { $sum: '$shippingCost' } } }
      ]),
      
      // Shipping costs (previous period)
      Order.aggregate([
        { $match: { createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }, status: { $ne: 'Cancelled' } } },
        { $group: { _id: null, total: { $sum: '$shippingCost' } } }
      ]),
      
      // Order counts
      Order.countDocuments({ createdAt: { $gte: thirtyDaysAgo }, status: { $ne: 'Cancelled' } }),
      Order.countDocuments({ createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }, status: { $ne: 'Cancelled' } }),
      
      // Customer counts
      User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      User.countDocuments({ createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } }),
      
      // Booking counts
      Booking.countDocuments({ createdAt: { $gte: thirtyDaysAgo }, status: { $nin: ['cancelled', 'rejected'] } }),
      Booking.countDocuments({ createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }, status: { $nin: ['cancelled', 'rejected'] } }),
      
      // Recent orders (last 5)
      Order.find({ status: { $ne: 'Cancelled' } })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('orderId customer.name createdAt totalAmount status shippingCost')
        .lean(),
      
      // Recent bookings (last 5)
      Booking.find({ status: { $nin: ['cancelled', 'rejected'] } })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('_id bookingDetails.name plan.name date plan.price status')
        .lean(),
      
      // Top selling products
      Order.aggregate([
        { $unwind: '$items' },
        { $group: { 
          _id: '$items.productId', 
          name: { $first: '$items.name' },
          salesCount: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } } 
        }},
        { $sort: { revenue: -1 } },
        { $limit: 4 }
      ]),
      
      // Products count
      Product.countDocuments({ status: 'Active' }),
      
      // Count of distinct active plans
      Booking.distinct('plan.id'),
      
      // Low stock products
      Product.countDocuments({ stock: { $lt: 10 } }),
      
      // Today's bookings
      Booking.countDocuments({ 
        date: { $gte: todayStart, $lt: todayEnd },
        status: { $nin: ['cancelled', 'rejected'] }
      }),

      // Revenue data for last 7 days (product revenue only)
      Order.aggregate([
        { 
          $match: { 
            createdAt: { $gte: sevenDaysAgo },
            status: { $ne: 'Cancelled' } 
          } 
        },
        { $unwind: '$items' },
        { 
          $group: { 
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            total: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
          } 
        },
        { $sort: { _id: 1 } }
      ]),

      // Revenue data for last 30 days (product revenue only)
      Order.aggregate([
        { 
          $match: { 
            createdAt: { $gte: thirtyDaysAgo },
            status: { $ne: 'Cancelled' } 
          } 
        },
        { $unwind: '$items' },
        { 
          $group: { 
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            total: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
          } 
        },
        { $sort: { _id: 1 } }
      ]),

      // Sales by category (product revenue only)
      Order.aggregate([
        { $unwind: '$items' },
        { 
          $lookup: {
            from: 'product',
            localField: 'items.productId',
            foreignField: '_id',
            as: 'productDetails'
          }
        },
        { $unwind: '$productDetails' },
        { 
          $group: { 
            _id: '$productDetails.category',
            total: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
            count: { $sum: '$items.quantity' }
          } 
        },
        { $sort: { total: -1 } },
        { 
          $project: {
            category: '$_id',
            revenue: '$total',
            count: 1,
            _id: 0
          }
        }
      ]),

      // Booking trends
      Booking.aggregate([
        { 
          $match: { 
            createdAt: { $gte: thirtyDaysAgo },
            status: { $nin: ['cancelled', 'rejected'] }
          } 
        },
        { 
          $group: { 
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 }
          } 
        },
        { $sort: { _id: 1 } }
      ]),

      // New: Shipping costs (last 7 days)
      Order.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo }, status: { $ne: 'Cancelled' } } },
        { $group: { _id: null, total: { $sum: '$shippingCost' } } }
      ]),
      
      // New: Shipping costs (last 30 days)
      Order.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo }, status: { $ne: 'Cancelled' } } },
        { $group: { _id: null, total: { $sum: '$shippingCost' } } }
      ]),
      
      // New: Shipping costs (last 90 days)
      Order.aggregate([
        { $match: { createdAt: { $gte: ninetyDaysAgo }, status: { $ne: 'Cancelled' } } },
        { $group: { _id: null, total: { $sum: '$shippingCost' } } }
      ]),
      
      // New: Revenue (product only, last 90 days)
      Order.aggregate([
        { $match: { createdAt: { $gte: ninetyDaysAgo }, status: { $ne: 'Cancelled' } } },
        { $unwind: '$items' },
        { $group: { 
          _id: null, 
          total: { $sum: { $multiply: ['$items.quantity', '$items.price'] } } 
        } }
      ]),
      
      // New: Category sales (last 7 days)
      Order.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo }, status: { $ne: 'Cancelled' } } },
        { $unwind: '$items' },
        { 
          $lookup: {
            from: 'product',
            localField: 'items.productId',
            foreignField: '_id',
            as: 'productDetails'
          }
        },
        { $unwind: '$productDetails' },
        { 
          $group: { 
            _id: '$productDetails.category',
            total: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
            count: { $sum: '$items.quantity' }
          } 
        },
        { $sort: { total: -1 } },
        { 
          $project: {
            category: '$_id',
            revenue: '$total',
            count: 1,
            _id: 0
          }
        }
      ]),
      
      // New: Category sales (last 30 days)
      Order.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo }, status: { $ne: 'Cancelled' } } },
        { $unwind: '$items' },
        { 
          $lookup: {
            from: 'product',
            localField: 'items.productId',
            foreignField: '_id',
            as: 'productDetails'
          }
        },
        { $unwind: '$productDetails' },
        { 
          $group: { 
            _id: '$productDetails.category',
            total: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
            count: { $sum: '$items.quantity' }
          } 
        },
        { $sort: { total: -1 } },
        { 
          $project: {
            category: '$_id',
            revenue: '$total',
            count: 1,
            _id: 0
          }
        }
      ]),
      
      // New: Category sales (last 90 days)
      Order.aggregate([
        { $match: { createdAt: { $gte: ninetyDaysAgo }, status: { $ne: 'Cancelled' } } },
        { $unwind: '$items' },
        { 
          $lookup: {
            from: 'product',
            localField: 'items.productId',
            foreignField: '_id',
            as: 'productDetails'
          }
        },
        { $unwind: '$productDetails' },
        { 
          $group: { 
            _id: '$productDetails.category',
            total: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
            count: { $sum: '$items.quantity' }
          } 
        },
        { $sort: { total: -1 } },
        { 
          $project: {
            category: '$_id',
            revenue: '$total',
            count: 1,
            _id: 0
          }
        }
      ])
    ]);

    // Calculate percentage changes
    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return current === 0 ? 0 : 100;
      return ((current - previous) / previous) * 100;
    };

    const productRevenueChange = calculateChange(
      productRevenueCurrent[0]?.total || 0,
      productRevenuePrevious[0]?.total || 0
    );
    
    console.log(revenueLast7Days, 'revenueLast7Days');
    const shippingRevenueChange = calculateChange(
      shippingRevenueCurrent[0]?.total || 0,
      shippingRevenuePrevious[0]?.total || 0
    );


    const ordersChange = calculateChange(
      totalOrdersCurrent,
      totalOrdersPrevious
    );

    const customersChange = calculateChange(
      totalCustomersCurrent,
      totalCustomersPrevious
    );

    const bookingsChange = calculateChange(
      totalBookingsCurrent,
      totalBookingsPrevious
    );

    // Calculate inventory status
    const inventoryStatus = productsCount > 0 
      ? Math.round(((productsCount - lowStockProducts) / productsCount) * 100)
      : 0;

    // Format recent orders
    const formattedRecentOrders = recentOrders.map(order => ({
      id: order.orderId,
      customerName: order.customer.name,
      date: format(new Date(order.createdAt), 'yyyy-MM-dd'),
      amount: order.totalAmount,
      productRevenue: order.totalAmount - order.shippingCost,
      shippingCost: order.shippingCost,
      status: order.status === 'Delivered' ? 'Delivered' :
              order.status === 'Shipped' ? 'Shipped' :
              order.status === 'Confirmed' ? 'Processing' :
              'Pending'
    }));

    // Format recent bookings
    const formattedRecentBookings = recentBookings.map((booking: any) => ({
      id: booking._id.toString(),
      customerName: booking.bookingDetails.name,
      type: booking.plan.name,
      date: format(new Date(booking.date), 'yyyy-MM-dd'),
      amount: booking.plan.price,
      status: booking.status === 'confirmed' || booking.status === 'completed' 
        ? 'Confirmed' 
        : 'Pending'
    }));

    // Format top products
    const formattedTopProducts = topProducts.map(product => ({
      id: product._id,
      name: product.name,
      salesCount: product.salesCount,
      revenue: product.revenue
    }));

    // Format chart data
    const formatChartData = (data: any[], valueKey: string = 'total') => {
      return data.map(item => ({
        date: item._id,
        value: item[valueKey]
      }));
    };

    console.log(categorySales, 'categorySalesLast7Days');
    console.log(formatChartData(revenueLast7Days));

    // Prepare response
    const responseData = {
      // Revenue metrics
      productRevenue: productRevenueCurrent[0]?.total || 0,
      productRevenueChange: parseFloat(productRevenueChange.toFixed(1)),
      shippingRevenue: shippingRevenueCurrent[0]?.total || 0,
      shippingRevenueChange: parseFloat(shippingRevenueChange.toFixed(1)),
      totalRevenue: (productRevenueCurrent[0]?.total || 0) + (shippingRevenueCurrent[0]?.total || 0),
      
      // Order metrics
      totalOrders: totalOrdersCurrent,
      ordersChange: parseFloat(ordersChange.toFixed(1)),
      
      // Customer metrics
      totalCustomers: totalCustomersCurrent,
      customersChange: parseFloat(customersChange.toFixed(1)),
      
      // Booking metrics
      totalBookings: totalBookingsCurrent,
      bookingsChange: parseFloat(bookingsChange.toFixed(1)),
      
      // Recent activity
      recentOrders: formattedRecentOrders,
      recentBookings: formattedRecentBookings,
      
      // Product metrics
      topProducts: formattedTopProducts,
      productsCount,
      plansCount: activePlansCount.length,
      inventoryStatus,
      lowStockProducts,
      
      // Today's metrics
      todaysBookings,
      
      // Chart data
      charts: {
        revenueTrends: {
          last7Days: formatChartData(revenueLast7Days),
          last30Days: formatChartData(revenueLast30Days),
        },
        salesByCategory: categorySales,
        bookingTrends: formatChartData(bookingTrends, 'count')
      },
      
      // New additions
      shippingCosts: {
        last7Days: shippingLast7Days[0]?.total || 0,
        last30Days: shippingLast30Days[0]?.total || 0,
        last90Days: shippingLast90Days[0]?.total || 0,
      },
      revenuePeriods: {
        last7Days:  revenueLast7Days.reduce((sum: any, item: any) => sum + (item.total || 0), 0),
        last30Days: revenueLast30Days.reduce((sum: any, item: any) => sum + (item.total || 0), 0),
        last90Days: revenueLast90Days.reduce((sum: any, item: any) => sum + (item.total || 0), 0),
      },
      categorySalesPeriods: {
        last7Days: categorySalesLast7Days,
        last30Days: categorySalesLast30Days,
        last90Days: categorySalesLast90Days,
      }
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}   