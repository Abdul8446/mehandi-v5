'use client'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, Users, ShoppingBag, Calendar, 
  DollarSign, Package, ArrowUpRight, ArrowDownRight,
  Truck
} from 'lucide-react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

interface DashboardData {
  stats: {
    title: string;
    value: string;
    change: string;
    isPositive: boolean;
    icon: React.ComponentType<any>;
    color: string;
  }[];
  recentOrders: {
    id: string;
    customer: string;
    date: string;
    amount: string;
    status: string;
  }[];
  recentBookings: {
    id: string;
    customer: string;
    type: string;
    date: string;
    amount: string;
    status: string;
  }[];
  topProducts: {
    id: number;
    name: string;
    sales: number;
    revenue: string;
  }[];
  quickStats: {
    products: number;
    artists: number;
    classes: number;
    inventoryStatus: number;
    lowStockProducts: number;
    todaysBookings: number;
  };
  charts?: {
    revenueTrends?: {
      last7Days?: { date: string; value: number }[];
      last30Days?: { date: string; value: number }[];
    };
    salesByCAtegory?: {
      last7Days?: { category: string; revenue: number }[];
      last30Days?: { category: string; revenue: number }[];
      last90Days?: { category: string; revenue: number }[];
    }
    bookingTrends?: { date: string; value: number }[];
  };
  categorySalesPeriods?: {
    last7Days: { category: string; revenue: number }[];
    last30Days: { category: string; revenue: number }[];
    last90Days: { category: string; revenue: number }[];
  };
  shippingCosts?: {
    last7Days: number;
    last30Days: number;
    last90Days: number;
  };
  revenuePeriods?: {
    last7Days: number;
    last30Days: number;
    last90Days: number;
  };
}

const DashboardPage = () => {
  const { isAdminAuthenticated, adminLoading } = useAdminAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revenueTimeRange, setRevenueTimeRange] = useState<'7days' | '30days' | '90days'>('7days');
  const [categoryTimeRange, setCategoryTimeRange] = useState<'7days' | '30days' | '90days'>('7days');

  useEffect(() => {
    if (isAdminAuthenticated) {
      fetchDashboardData();
    }
  }, [isAdminAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/dashboard');
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      
      const data = await response.json();

      console.log(data,'data')

      // Format the data from the backend
      const formattedData: DashboardData = {
        stats: [
          { 
            title: 'Total Revenue', 
            value: `₹${data.totalRevenue?.toLocaleString('en-IN') || '0'}`, 
            change: `${data.productRevenueChange >= 0 ? '+' : ''}${data.productRevenueChange || 0}%`, 
            isPositive: data.productRevenueChange >= 0,
            icon: DollarSign,
            color: 'bg-green-100 text-green-600'
          },
          { 
            title: 'Total Orders', 
            value: data.totalOrders?.toString() || '0', 
            change: `${data.ordersChange >= 0 ? '+' : ''}${data.ordersChange || 0}%`, 
            isPositive: data.ordersChange >= 0,
            icon: ShoppingBag,
            color: 'bg-blue-100 text-blue-600'
          },
          { 
            title: 'Total Customers', 
            value: data.totalCustomers?.toLocaleString('en-IN') || '0', 
            change: `${data.customersChange >= 0 ? '+' : ''}${data.customersChange || 0}%`, 
            isPositive: data.customersChange >= 0,
            icon: Users,
            color: 'bg-purple-100 text-purple-600'
          },
          { 
            title: 'Total Bookings', 
            value: data.totalBookings?.toString() || '0', 
            change: `${data.bookingsChange >= 0 ? '+' : ''}${data.bookingsChange || 0}%`, 
            isPositive: data.bookingsChange >= 0,
            icon: Calendar,
            color: 'bg-yellow-100 text-yellow-600'
          }
        ],
        recentOrders: data.recentOrders?.map((order: any) => ({
          id: order.id,
          customer: order.customerName,
          date: new Date(order.date).toISOString().split('T')[0],
          amount: `₹${order.amount?.toLocaleString('en-IN') || '0'}`,
          status: order.status || 'Pending'
        })) || [],
        recentBookings: data.recentBookings?.map((booking: any) => ({
          id: booking.id,
          customer: booking.customerName,
          type: booking.type || 'Unknown',
          date: new Date(booking.date).toISOString().split('T')[0],
          amount: `₹${booking.amount?.toLocaleString('en-IN') || '0'}`,
          status: booking.status || 'Pending'
        })) || [],
        topProducts: data.topProducts?.map((product: any) => ({
          id: product.id,
          name: product.name || 'Unknown Product',
          sales: product.salesCount || 0,
          revenue: `₹${product.revenue?.toLocaleString('en-IN') || '0'}`
        })) || [],
        quickStats: {
          products: data.productsCount || 0,
          artists: data.artistsCount || 0,
          classes: data.classesCount || 0,
          inventoryStatus: data.inventoryStatus || 0,
          lowStockProducts: data.lowStockProducts || 0,
          todaysBookings: data.todaysBookings || 0
        },
        charts: {
          revenueTrends: {
            last7Days: data.charts?.revenueTrends?.last7Days || [],
            last30Days: data.charts?.revenueTrends?.last30Days || []
          },
          // salesByCategory: {
          //   last7Days: data.categorySalesPeriods?.last7Days || [],
          //   last30Days: data.categorySalesPeriods?.last30Days || []
          // },
          bookingTrends: data.charts?.bookingTrends || []
        },
        categorySalesPeriods: {
          last7Days: data.categorySalesPeriods?.last7Days || [],
          last30Days: data.categorySalesPeriods?.last30Days || [],
          last90Days: data.categorySalesPeriods?.last90Days || []
        },
        shippingCosts: data.shippingCosts || {
          last7Days: 0,
          last30Days: 0,
          last90Days: 0
        },
        revenuePeriods: data.revenuePeriods || {
          last7Days: 0,
          last30Days: 0,
          last90Days: 0
        }
      };
      
      setDashboardData(formattedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (adminLoading || loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
  }

  if (!dashboardData) {
    return null;
  }

  // Prepare revenue trends chart data
  const revenueChartData = {
    labels: dashboardData.charts?.revenueTrends?.[revenueTimeRange === '7days' ? 'last7Days' : 'last30Days']?.map(item => 
      new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ) || [],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: dashboardData.charts?.revenueTrends?.[revenueTimeRange === '7days' ? 'last7Days' : 'last30Days']?.map(item => item.value) || [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1
      }
    ]
  };

  const categoryChartData = {
    labels: dashboardData.categorySalesPeriods?.[categoryTimeRange === '7days' ? 'last7Days' : 'last30Days'].map(item => item.category) || [],
    datasets: [
      {
        data: dashboardData.categorySalesPeriods?.[categoryTimeRange === '7days' ? 'last7Days' : 'last30Days'].map(item => item.revenue) || [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)'
        ],
        borderWidth: 1
      }
    ]
  };

  console.log(categoryChartData, 'categoryChartData')

  // Get shipping cost for current time range
  const getShippingCost = () => {
    switch (revenueTimeRange) {
      case '7days': return dashboardData.shippingCosts?.last7Days || 0;
      case '30days': return dashboardData.shippingCosts?.last30Days || 0;
      case '90days': return dashboardData.shippingCosts?.last90Days || 0;
      default: return 0;
    }
  };

  // Get revenue for current time range
  const getRevenue = () => {
    switch (revenueTimeRange) {
      case '7days': return dashboardData.revenuePeriods?.last7Days || 0;
      case '30days': return dashboardData.revenuePeriods?.last30Days || 0;
      case '90days': return dashboardData.revenuePeriods?.last90Days || 0;
      default: return 0;
    }
  };

  return (
    <>
      {isAdminAuthenticated && dashboardData && (
        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {dashboardData.stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                    <div className={`flex items-center mt-2 text-sm ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.isPositive ? 
                        <ArrowUpRight size={16} className="mr-1" /> : 
                        <ArrowDownRight size={16} className="mr-1" />
                      }
                      <span>{stat.change} from last month</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <stat.icon size={24} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Revenue Overview</h3>
                <div className="relative">
                  <select
                    value={revenueTimeRange}
                    onChange={(e) => setRevenueTimeRange(e.target.value as '7days' | '30days' | '90days')}
                    className="appearance-none bg-white border border-gray-300 rounded-md py-1 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="7days">Last 7 Days</option>
                    <option value="30days">Last 30 Days</option>
                    <option value="90days">Last 90 Days</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="h-64">
                <Line 
                  data={revenueChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => `₹${Number(context.raw).toLocaleString('en-IN') || '0'}`
                        }
                      }
                    },
                    scales: {
                      y: {
                        ticks: {
                          callback: (value) => `₹${value?.toLocaleString('en-IN') || '0'}`
                        }
                      }
                    }
                  }}
                />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-full mr-3">
                      <DollarSign size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Total Revenue</p>
                      <p className="font-semibold">₹{getRevenue().toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-full mr-3">
                      <Truck size={20} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Shipping Costs</p>
                      <p className="font-semibold">₹{getShippingCost().toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Sales by Category</h3>
                <div className="relative">
                  <select
                    value={categoryTimeRange}
                    onChange={(e) => setCategoryTimeRange(e.target.value as '7days' | '30days' | '90days')}
                    className="appearance-none bg-white border border-gray-300 rounded-md py-1 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="7days">Last 7 Days</option>
                    <option value="30days">Last 30 Days</option>
                    <option value="90days">Last 90 Days</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>  
              </div>
              <div className="h-64">
                <Pie
                  data={categoryChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                            const percentage = total > 0 ? Math.round((Number(value) / total) * 100) : 0;
                            return `${label}: ₹${typeof value === 'number' ? value.toLocaleString('en-IN') : value || '0'} (${percentage}%)`;
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
            {/* Category Sales */}
             {/* <div className="bg-white rounded-lg shadow-sm p-6">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="text-lg font-semibold">Category Sales</h3>
                 <div className="flex space-x-2">
                   <button 
                     onClick={() => setCategoryTimeRange('7days')} 
                     className={`text-sm px-3 py-1 rounded-md ${categoryTimeRange === '7days' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                   >
                     7 Days
                   </button>
                   <button 
                     onClick={() => setCategoryTimeRange('30days')} 
                     className={`text-sm px-3 py-1 rounded-md ${categoryTimeRange === '30days' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                   >
                     30 Days
                   </button>
                   <button 
                     onClick={() => setCategoryTimeRange('90days')} 
                     className={`text-sm px-3 py-1 rounded-md ${categoryTimeRange === '90days' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                   >
                     90 Days
                   </button>
                 </div>
               </div>
               <div className="h-64">
                 <Pie
                   data={categoryChartData}
                   options={{
                     responsive: true,
                     maintainAspectRatio: false,
                     plugins: {
                       legend: {
                         position: 'right',
                       },
                       tooltip: {
                         callbacks: {
                           label: (context) => {
                             const label = context.label || '';
                             const value = context.raw || 0;
                             const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                             const percentage = total > 0 ? Math.round((Number(value) / total) * 100) : 0;
                             return `${label}: ₹${typeof value === 'number' ? value.toLocaleString('en-IN') : value || '0'} (${percentage}%)`;
                           }
                         }
                       }
                     }
                   }}
                 />
               </div>
             </div> */}
           {/* </div> */}
          </div>
          
          {/* Rest of the component remains the same */}
          {/* Recent Orders & Bookings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Recent Orders</h3>
                  <a href="/admin/orders" className="text-sm text-red-900 hover:text-red-700">View All</a>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dashboardData.recentOrders.map(order => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-900">{order.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.customer}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{order.amount}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>          
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Recent Bookings</h3>
                  <a href="/admin/bookings" className="text-sm text-red-900 hover:text-red-700">View All</a>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dashboardData.recentBookings.map(booking => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-900">{booking.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{booking.customer}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{booking.amount}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden lg:col-span-2">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Top Selling Products</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units Sold</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dashboardData.topProducts.map(product => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sales}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.revenue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>          
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-6">Quick Stats</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Products</span>
                    <span className="text-sm font-medium">{dashboardData.quickStats.products}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-red-900 h-2 rounded-full" style={{ width: `${(dashboardData.quickStats.products / 30) * 100}%` }}></div>
                  </div>
                </div>              
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Artists</span>
                    <span className="text-sm font-medium">{dashboardData.quickStats.artists}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-600 h-2 rounded-full" style={{ width: `${(dashboardData.quickStats.artists / 15) * 100}%` }}></div>
                  </div>
                </div>              
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Classes</span>
                    <span className="text-sm font-medium">{dashboardData.quickStats.classes}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: `${(dashboardData.quickStats.classes / 20) * 100}%` }}></div>
                  </div>
                </div>              
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Inventory Status</span>
                    <span className="text-sm font-medium">{dashboardData.quickStats.inventoryStatus}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${dashboardData.quickStats.inventoryStatus}%` }}></div>
                  </div>
                </div>
              </div>            
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 bg-red-100 rounded-full mr-3">
                      <Package size={20} className="text-red-900" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Low Stock</p>
                      <p className="font-semibold">{dashboardData.quickStats.lowStockProducts} Products</p>
                    </div>
                  </div>
                </div>              
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-full mr-3">
                      <Calendar size={20} className="text-yellow-700" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Today's Bookings</p>
                      <p className="font-semibold">{dashboardData.quickStats.todaysBookings} Bookings</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardPage;