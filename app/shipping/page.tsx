import Head from 'next/head';
import Link from 'next/link';
import AnimatedSection from '@/components/AnimatedSection';
import { Truck, Package, Clock, Shield } from 'lucide-react';

const Shipping = () => {
  const shippingFeatures = [
    {
      icon: Truck,
      title: 'Fast Shipping',
      description: 'Kerala: 2-3 days | Other States: 5-10 days'
    },
    {
      icon: Package,
      title: 'Secure Packaging',
      description: 'Carefully packed products'
    },
    {
      icon: Clock,
      title: '48-Hour Returns',
      description: 'Return window closes after 48 hours(2 days)'
    },
    {
      icon: Shield,
      title: 'Easy Refunds',
      description: 'Credited in 3-5 business days'
    }
  ];

  return (
    <>
      <Head>
        <title>Shipping & Returns | Mehandi Mansion</title>
        <meta name="description" content="Our shipping timelines and return policy" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow pt-20">
          <AnimatedSection className="bg-brown-900 text-white py-16">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">Shipping & Returns</h1>
              <p className="max-w-2xl mx-auto">
                Learn about our shipping timelines and return process
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection className="py-16">
            <div className="container mx-auto px-4">
              {/* Shipping Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                {shippingFeatures.map((item, index) => (
                  <div 
                    key={index} 
                    className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <item.icon className="w-12 h-12 text-brown-700 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>

              {/* Main Content */}
              <div className="max-w-3xl mx-auto">
                <div className="space-y-12">
                  {/* Shipping Information */}
                  <section>
                    <h2 className="text-2xl font-serif text-brown-900 mb-6">Shipping Timelines</h2>
                    <div className="space-y-6">
                      <div className="bg-brown-50 p-6 rounded-lg border border-brown-100">
                        <h3 className="font-medium text-brown-900 mb-3">Domestic Shipping</h3>
                        <ul className="space-y-2 text-gray-700">
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span><strong>Kerala:</strong> Orders will be delivered within 2-3 business days</span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span><strong>Other States:</strong> Orders will be delivered within 5-10 business days</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  {/* Track Order Section */}
                  <section>
                    <h2 className="text-2xl font-serif text-brown-900 mb-6">Track Your Order</h2>
                    <div className="bg-brown-50 p-6 rounded-lg border border-brown-100">
                      <h3 className="font-medium text-brown-900 mb-3">How to Track</h3>
                      <ol className="space-y-3 text-gray-700">
                        <li className="flex items-start">
                          <span className="mr-2">1.</span>
                          <span>Once your order status changes to <strong>"Shipped"</strong>, your tracking ID will appear in the order details in <em>"My Orders"</em></span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">2.</span>
                          <span>Copy the Indian Post Office tracking ID</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">3.</span>
                          <span>Click the <strong>"Track"</strong> button which will redirect you to the Indian Post Office website</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">4.</span>
                          <span>Enter your tracking ID on the India Post website to view real-time updates</span>
                        </li>
                      </ol>
                    </div>
                  </section>

                  {/* Return Policy */}
                  <section>
                    <h2 className="text-2xl font-serif text-brown-900 mb-6">Return Policy</h2>
                    
                    <div className="bg-brown-50 p-6 rounded-lg border border-brown-100 mb-6">
                      <h3 className="font-medium text-brown-900 mb-3">How to Request a Return</h3>
                      <ol className="space-y-3 text-gray-700">
                        <li className="flex items-start">
                          <span className="mr-2">1.</span>
                          <span>Click <strong>"Return"</strong> in <em>"My Orders"</em> within <strong>2 days</strong> of delivery</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">2.</span>
                          <span>Select items and describe the issue</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">3.</span>
                          <span>Submit your request</span>
                        </li>
                      </ol>
                    </div>

                    <div className="bg-brown-50 p-6 rounded-lg border border-brown-100 mb-6">
                      <h3 className="font-medium text-brown-900 mb-3">Verification & Refund</h3>
                      <ol className="space-y-3 text-gray-700">
                        <li className="flex items-start">
                          <span className="mr-2">1.</span>
                          <span>Our team contacts you via <strong>WhatsApp</strong> within 24 hours</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">2.</span>
                          <span>Share a short video showing:
                            <ul className="mt-2 space-y-1 pl-5">
                              <li>• The defective/damaged product</li>
                              <li>• Original packaging with labels</li>
                              <li>• Visible order number</li>
                            </ul>
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">3.</span>
                          <span>Once approved: <strong>Refund will be credited in 3-5 business days</strong></span>
                        </li>
                      </ol>
                    </div>

                    <div className="bg-brown-50 p-6 rounded-lg border border-brown-100">
                      <h3 className="font-medium text-brown-900 mb-3">Conditions</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>48-hour return window</strong> (strictly enforced)</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Only <strong>unused, unopened</strong> products in original packaging</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>No returns</strong> for:
                            <ul className="mt-1 space-y-1 pl-5">
                              <li>• Change of mind</li>
                              <li>• Used/opened products</li>
                              <li>• Normal product discoloration</li>
                            </ul>
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Return can be accepted within 2 days</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Refunds are provided only for damaged products</span>
                        </li>
                      </ul>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </main>
      </div>
    </>
  );
};

export default Shipping;