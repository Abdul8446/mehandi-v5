'use client'

import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import AnimatedSection from '../../components/AnimatedSection';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <>
      <Head>
        <title>Contact Us | Mehandi Mansion</title>
        <meta name="description" content="Get in touch with our mehandi experts. We're here to answer your questions and help with your henna needs." />
      </Head>
      
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow pt-20">
          <AnimatedSection className="bg-brown-900 text-white py-16">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">Contact Us</h1>
              <p className="max-w-2xl mx-auto">
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                We're here to help! Reach out to us for any questions, concerns, or feedback.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection className="py-16">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Form */}
                <div>
                  <h2 className="text-2xl font-serif text-brown-900 mb-6">Get in Touch</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Your Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Subject</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Message</label>
                      <textarea
                        rows={4}
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
                        required
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="w-full px-6 py-3 bg-brown-800 text-white rounded-md hover:bg-brown-700 transition-colors"
                    >
                      Send Message
                    </button>
                  </form>
                </div>

                {/* Contact Information */}
                <div>
                  <h2 className="text-2xl font-serif text-brown-900 mb-6">Contact Information</h2>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <MapPin className="w-6 h-6 text-brown-700 mr-4 mt-1" />
                      <div>
                        <h3 className="font-medium text-gray-900">Address</h3>
                        <p className="text-gray-600">Punnakkabazar, Mathilakam, Thrissur, 680685</p>
                      </div>
                    </div>
                    {/* <div className="flex items-start">
                      <Phone className="w-6 h-6 text-brown-700 mr-4 mt-1" />
                      <div>
                        <h3 className="font-medium text-gray-900">Phone</h3>
                        <p className="text-gray-600">+91 98765 43210</p>
                      </div>
                    </div> */}
                    <div className="flex items-start">
                      <Mail className="w-6 h-6 text-brown-700 mr-4 mt-1" />
                      <div>
                        <h3 className="font-medium text-gray-900">Email</h3>
                        <p className="text-gray-600">mehandimansion@gmail.com</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Clock className="w-6 h-6 text-brown-700 mr-4 mt-1" />
                      <div>
                        <h3 className="font-medium text-gray-900">Business Hours</h3>
                        <p className="text-gray-600">Monday - Saturday: 10:00 AM - 8:00 PM</p>
                        <p className="text-gray-600">Sunday: 11:00 AM - 6:00 PM</p>
                      </div>
                    </div>
                  </div>

                  {/* Map Section */}
                  <div className="mt-8 p-6 bg-brown-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Store Location</h3>
                    <div className="aspect-video rounded-lg overflow-hidden relative">
                      {/* <Image
                        src="https://images.pexels.com/photos/5669602/pexels-photo-5669602.jpeg"
                        alt="Store location"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      /> */}
                      <iframe
                        src="https://www.google.com/maps?q=10.3005619,76.1535231&z=18&output=embed"
                        title="Store Location Map"
                        width="100%"
                        height="100%"
                        style={{ border: 0, position: 'absolute', top: 0, left: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="w-full h-full"
                      />
                    </div>
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

export default Contact;