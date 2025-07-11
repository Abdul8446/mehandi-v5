'use client'

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AnimatedSection from '../../components/AnimatedSection';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'What type of henna do you use in your products?',
      answer: 'We use 100% natural henna powder sourced from Rajasthan, known for its superior quality and rich color. Our products are free from any chemical additives or synthetic dyes.'
    },
    {
      question: 'How long does the mehandi color last?',
      answer: 'The color typically lasts 1-3 weeks, depending on various factors including skin type, aftercare, and the area where it\'s applied. For best results, follow our aftercare instructions carefully.'
    },
    {
      question: 'Do you offer bridal packages?',
      answer: 'Yes, we offer comprehensive bridal packages that include consultation, trial, and the main bridal application. Our artists specialize in traditional and modern bridal designs.'
    },
    {
      question: 'How do I book a mehandi artist?',
      answer: "You can book an artist through our website's booking section. Choose your preferred date, time slot, and service type. We'll confirm your booking within 24 hours."
    },
    {
      question: 'What is your return policy?',
      answer: 'You can request a return within 2 days of delivery for unused, unopened products in original packaging. For details on the process, conditions, and refunds, please visit our Shipping & Returns page.'
    },
    {
      question: 'Do you ship internationally?',
      answer: 'No, we currently do not offer international shipping. Orders can only be delivered within India.'
    }
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <Head>
        <title>FAQs | Mehandi Mansion</title>
        <meta name="description" content="Find answers to common questions about our henna products, services, and policies." />
      </Head>
      
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow pt-20">
          <AnimatedSection className="bg-brown-900 text-white py-16">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">Frequently Asked Questions</h1>
              <p className="max-w-2xl mx-auto">
                Find answers to common questions about our products and services.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection className="py-16">
            <div className="container mx-auto px-4 max-w-3xl">
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-200"
                  >
                    <button
                      className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 flex items-center justify-between"
                      onClick={() => toggleAccordion(index)}
                      aria-expanded={openIndex === index}
                      aria-controls={`faq-${index}`}
                    >
                      <span className="font-medium text-gray-900 text-left">{faq.question}</span>
                      {openIndex === index ? (
                        <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      )}
                    </button>
                    {openIndex === index && (
                      <div 
                        id={`faq-${index}`}
                        className="px-6 py-4 bg-gray-50 transition-all duration-200"
                      >
                        <p className="text-gray-700">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection className="py-16 bg-brown-50">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-2xl font-serif text-brown-900 mb-4">Still have questions?</h2>
              <p className="text-gray-700 mb-8">
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                We're here to help. Contact our customer support team anytime.
              </p>
              <Link
                href="/contact"
                className="inline-block px-6 py-3 bg-brown-800 text-white rounded-md hover:bg-brown-700 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </AnimatedSection>
        </main>
      </div>
    </>
  );
};

export default FAQ;