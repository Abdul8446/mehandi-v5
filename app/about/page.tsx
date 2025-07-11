import AnimatedSection from '../../components/AnimatedSection';
import Image from 'next/image';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow pt-20">
        <AnimatedSection className="bg-brown-900 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">About Mehandi Mansion</h1>
            <p className="max-w-2xl mx-auto">
              Discover our journey in bringing the art of mehandi to life through premium products and expert services.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-2xl font-serif text-brown-900 mb-6">Our Story</h2>
                <p className="text-gray-700 mb-4">
                  Founded in 2020, Mehandi Mansion began with a simple mission: to preserve and promote the ancient art of mehandi while making it accessible to everyone through quality products and professional services.
                </p>
                <p className="text-gray-700">
                  {/* eslint-disable-next-line react/no-unescaped-entities */}
                  Today, we're proud to be one of the leading providers of premium henna products and professional mehandi services, serving thousands of satisfied customers across the country.
                </p>
              </div>
              <div className="relative">
                <Image
                  src="https://images.pexels.com/photos/2486420/pexels-photo-2486420.jpeg"
                  alt="Mehandi artist at work"
                  width={800}
                  height={600}
                  className="rounded-lg shadow-lg w-full h-auto"
                />
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection className="py-16 bg-brown-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-serif text-brown-900 mb-12 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Quality',
                  description: 'We source only the finest ingredients for our products, ensuring the best results for our customers.'
                },
                {
                  title: 'Tradition',
                  description: 'We honor and preserve the traditional art of mehandi while embracing modern techniques and innovations.'
                },
                {
                  title: 'Customer Service',
                  description: "We're committed to providing exceptional service and support to every customer."
                }
              ].map((value, index) => (
                <div key={index} className="text-center p-6 bg-white rounded-lg shadow-sm">
                  <h3 className="text-xl font-medium text-brown-800 mb-4">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </main>
    </div>
  );
};

export default About;