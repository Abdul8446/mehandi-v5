// import Head from 'next/head';
// import AnimatedSection from '../../components/AnimatedSection';

// const Privacy = () => {
//   return (
//     <>
//       <Head>
//         <title>Privacy Policy | Mehandi Mansion</title>
//         <meta name="description" content="Learn how we collect, use, and protect your personal information at Mehandi Mansion." />
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//       </Head>
      
//       <div className="min-h-screen flex flex-col">
//         <main className="flex-grow pt-20">
//           <AnimatedSection className="bg-brown-900 text-white py-16">
//             <div className="container mx-auto px-4 text-center">
//               <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">Privacy Policy</h1>
//               <p className="max-w-2xl mx-auto">
//                 Your privacy is important to us. Learn how we collect, use, and protect your personal information.
//               </p>
//             </div>
//           </AnimatedSection>

//           <AnimatedSection className="py-16">
//             <div className="container mx-auto px-4">
//               <div className="max-w-3xl mx-auto prose prose-brown">
//                 <section className="mb-12">
//                   <h2 className="text-2xl font-serif text-brown-900 mb-4">Information We Collect</h2>
//                   <p className="text-gray-700 mb-4">
//                     We collect information that you provide directly to us, including:
//                   </p>
//                   <ul className="list-disc pl-6 text-gray-700 space-y-2">
//                     <li>Name and contact information</li>
//                     <li>Billing and shipping addresses</li>
//                     <li>Payment information</li>
//                     <li>Order history and preferences</li>
//                     <li>Communication preferences</li>
//                   </ul>
//                 </section>

//                 <section className="mb-12">
//                   <h2 className="text-2xl font-serif text-brown-900 mb-4">How We Use Your Information</h2>
//                   <p className="text-gray-700 mb-4">
//                     We use the information we collect to:
//                   </p>
//                   <ul className="list-disc pl-6 text-gray-700 space-y-2">
//                     <li>Process your orders and payments</li>
//                     <li>Communicate with you about your orders</li>
//                     <li>Send you marketing communications (with your consent)</li>
//                     <li>Improve our products and services</li>
//                     <li>Comply with legal obligations</li>
//                   </ul>
//                 </section>

//                 <section className="mb-12">
//                   <h2 className="text-2xl font-serif text-brown-900 mb-4">Information Sharing</h2>
//                   <p className="text-gray-700 mb-4">
//                     We do not sell or rent your personal information to third parties. We may share your information with:
//                   </p>
//                   <ul className="list-disc pl-6 text-gray-700 space-y-2">
//                     <li>Service providers who assist in our operations</li>
//                     <li>Payment processors for secure transactions</li>
//                     <li>Shipping partners for order delivery</li>
//                     <li>Law enforcement when required by law</li>
//                   </ul>
//                 </section>

//                 <section className="mb-12">
//                   <h2 className="text-2xl font-serif text-brown-900 mb-4">Your Rights</h2>
//                   <p className="text-gray-700 mb-4">
//                     You have the right to:
//                   </p>
//                   <ul className="list-disc pl-6 text-gray-700 space-y-2">
//                     <li>Access your personal information</li>
//                     <li>Correct inaccurate information</li>
//                     <li>Request deletion of your information</li>
//                     <li>Opt-out of marketing communications</li>
//                     <li>Lodge a complaint with supervisory authorities</li>
//                   </ul>
//                 </section>

//                 <section>
//                   <h2 className="text-2xl font-serif text-brown-900 mb-4">Contact Us</h2>
//                   <p className="text-gray-700 mb-4">
//                     If you have any questions about our Privacy Policy, please contact us at:
//                   </p>
//                   <div className="space-y-2 text-gray-700">
//                     <p>Email: <a href="mailto:privacy@mehandimansion.com" className="text-brown-700 hover:underline">privacy@mehandimansion.com</a></p>
//                     <p>Phone: <a href="tel:+919876543210" className="text-brown-700 hover:underline">+91 98765 43210</a></p>
//                     <p>Address: 123 Mehandi Street, Artisan District, Mumbai, 400001</p>
//                   </div>
//                 </section>
//               </div>
//             </div>
//           </AnimatedSection>
//         </main>
//       </div>
//     </>
//   );
// };

// export default Privacy;

import Head from 'next/head';
import AnimatedSection from '../../components/AnimatedSection';
import Link from 'next/link';
import Button from '@/components/ui/Button';

const Privacy = () => {
  return (
    <>
      <Head>
        <title>Privacy Policy | Mehandi Mansion</title>
        <meta name="description" content="Learn how we collect, use, and protect your personal information at Mehandi Mansion." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow pt-20">
          <AnimatedSection className="bg-brown-900 text-white py-16">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">Privacy Policy</h1>
              <p className="max-w-2xl mx-auto">
                Your privacy is important to us. Learn how we collect, use, and protect your personal information.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection className="py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto prose prose-brown">
                <section className="mb-12">
                  <h2 className="text-2xl font-serif text-brown-900 mb-4">Information We Collect</h2>
                  <p className="text-gray-700 mb-4">
                    We collect information that you provide directly to us, including:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>Name and contact information</li>
                    <li>Billing and shipping addresses</li>
                    <li>Payment information</li>
                    <li>Order history and preferences</li>
                    <li>Communication preferences</li>
                  </ul>
                </section>

                <section className="mb-12">
                  <h2 className="text-2xl font-serif text-brown-900 mb-4">How We Use Your Information</h2>
                  <p className="text-gray-700 mb-4">
                    We use the information we collect to:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>Process your orders and payments</li>
                    <li>Communicate with you about your orders</li>
                    <li>Send you marketing communications (with your consent)</li>
                    <li>Improve our products and services</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </section>

                <section className="mb-12">
                  <h2 className="text-2xl font-serif text-brown-900 mb-4">Information Sharing</h2>
                  <p className="text-gray-700 mb-4">
                    We do not sell or rent your personal information to third parties. We may share your information with:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>Service providers who assist in our operations</li>
                    <li>Payment processors for secure transactions</li>
                    <li>Shipping partners for order delivery</li>
                    <li>Law enforcement when required by law</li>
                  </ul>
                </section>

                <section className="mb-12">
                  <h2 className="text-2xl font-serif text-brown-900 mb-4">Your Rights</h2>
                  <p className="text-gray-700 mb-4">
                    You have the right to:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>Access your personal information</li>
                    <li>Correct inaccurate information</li>
                    <li>Request deletion of your information</li>
                    <li>Opt-out of marketing communications</li>
                    <li>Lodge a complaint with supervisory authorities</li>
                  </ul>
                </section>

                <section className="text-center">
                  <h2 className="text-2xl font-serif text-brown-900 mb-4">Have Questions?</h2>
                  <p className="text-gray-700 mb-6">
                    If you have any questions about our Privacy Policy, please don't hesitate to contact us.
                  </p>
                  <Link href="/contact">
                    <Button variant='primary'>
                      Contact Us
                    </Button>
                  </Link>
                </section>
              </div>
            </div>
          </AnimatedSection>
        </main>
      </div>
    </>
  );
};

export default Privacy;