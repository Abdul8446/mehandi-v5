'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import AnimatedSection from '../../components/AnimatedSection';
import { Search, Package } from 'lucide-react';

const TrackOrder = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle order tracking with Next.js router
    router.push(`/track/${orderNumber}`);
  };

  const trackingSteps = [
    {
      title: 'Enter Details',
      description: 'Provide your order number and email address'
    },
    {
      title: 'Track Progress',
      description: 'View real-time updates on your order status'
    },
    {
      title: 'Get Updates',
      description: 'Receive notifications about your delivery'
    }
  ];

  return (
    <>
      <Head>
        <title>Track Your Order | Mehandi Mansion</title>
        <meta name="description" content="Track your order status and shipment details" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow pt-20">
          <AnimatedSection className="bg-brown-900 text-white py-16">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">Track Your Order</h1>
              <p className="max-w-2xl mx-auto">
                Enter your order details below to track your shipment
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection className="py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-xl mx-auto">
                {/* Tracking Form */}
                <div className="bg-white p-8 rounded-lg shadow-lg">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-2">
                        Order Number
                      </label>
                      <input
                        type="text"
                        id="orderNumber"
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
                        placeholder="Enter your order number"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
                        placeholder="Enter your email address"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center px-6 py-3 bg-brown-800 text-white rounded-md hover:bg-brown-700 transition-colors"
                    >
                      <Search size={20} className="mr-2" />
                      Track Order
                    </button>
                  </form>
                </div>

                {/* Tracking Steps */}
                <div className="mt-12">
                  <h2 className="text-2xl font-serif text-brown-900 mb-6 text-center">How to Track Your Order</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {trackingSteps.map((step, index) => (
                      <div 
                        key={index} 
                        className="text-center p-6 bg-brown-50 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="w-12 h-12 bg-brown-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-brown-800 font-medium">{index + 1}</span>
                        </div>
                        <h3 className="font-medium text-gray-900 mb-2">{step.title}</h3>
                        <p className="text-gray-600">{step.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </main>
      </div>
    </>
  );
};

export default TrackOrder;