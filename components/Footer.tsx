'use client';

import React from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Twitter, MessageCircle as WhatsApp } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-brown-900 text-brown-50 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-serif font-bold mb-4">Mehandi Mansion</h3>
            <p className="text-brown-200 mb-4">
              Premium henna products and professional mehandi artist services for all your special occasions.
            </p>
            <div className="flex space-x-4 text-brown-200">
              <a href="#" aria-label="Instagram" className="hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" aria-label="Facebook" className="hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" aria-label="Twitter" className="hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-brown-200 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/shop" className="text-brown-200 hover:text-white transition-colors">Shop</Link></li>
              <li><Link href="/booking" className="text-brown-200 hover:text-white transition-colors">Book Artist</Link></li>
              <li><Link href="/about" className="text-brown-200 hover:text-white transition-colors">About Us</Link></li>
              {/* <li><Link href="/blog" className="text-brown-200 hover:text-white transition-colors">Blog</Link></li> */}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-medium mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><Link href="/contact" className="text-brown-200 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="text-brown-200 hover:text-white transition-colors">FAQs</Link></li>
              <li><Link href="/shipping" className="text-brown-200 hover:text-white transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/terms" className="text-brown-200 hover:text-white transition-colors">Terms and Conditions</Link></li>
              <li><Link href="/privacy" className="text-brown-200 hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* WhatsApp Updates */}
          <div>
            <h4 className="text-lg font-medium mb-4">Get Updates on WhatsApp</h4>
            <p className="text-brown-200 mb-4">Stay updated with our latest products and offers.</p>
            <form className="flex flex-col space-y-2">
              <div className="flex items-center bg-brown-800 rounded-md p-2">+91
                {/* <WhatsApp size={20} className="text-brown-200 mr-2" /> */}
                <input 
                  type="tel" 
                  placeholder="     Your WhatsApp number" 
                  className="bg-transparent border-none text-white placeholder-brown-300 focus:outline-none flex-1"
                />
              </div>
              <button 
                type="submit" 
                className="px-4 py-2 bg-sage-700 text-white rounded-md hover:bg-sage-600 transition-colors flex items-center justify-center"
              >
                {/* <WhatsApp size={16} className="mr-2" /> */}
                <svg className='mr-2' xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
  <path fill="currentColor" d="M16.6 14c-.2-.1-1.5-.7-1.7-.8c-.2-.1-.4-.1-.6.1c-.2.2-.6.8-.8 1c-.1.2-.3.2-.5.1c-.7-.3-1.4-.7-2-1.2c-.5-.5-1-1.1-1.4-1.7c-.1-.2 0-.4.1-.5c.1-.1.2-.3.4-.4c.1-.1.2-.3.2-.4c.1-.1.1-.3 0-.4c-.1-.1-.6-1.3-.8-1.8c-.1-.7-.3-.7-.5-.7h-.5c-.2 0-.5.2-.6.3c-.6.6-.9 1.3-.9 2.1c.1.9.4 1.8 1 2.6c1.1 1.6 2.5 2.9 4.2 3.7c.5.2.9.4 1.4.5c.5.2 1 .2 1.6.1c.7-.1 1.3-.6 1.7-1.2c.2-.4.2-.8.1-1.2l-.4-.2m2.5-9.1C15.2 1 8.9 1 5 4.9c-3.2 3.2-3.8 8.1-1.6 12L2 22l5.3-1.4c1.5.8 3.1 1.2 4.7 1.2c5.5 0 9.9-4.4 9.9-9.9c.1-2.6-1-5.1-2.8-7m-2.7 14c-1.3.8-2.8 1.3-4.4 1.3c-1.5 0-2.9-.4-4.2-1.1l-.3-.2l-3.1.8l.8-3l-.2-.3c-2.4-4-1.2-9 2.7-11.5S16.6 3.7 19 7.5c2.4 3.9 1.3 9-2.6 11.4"/>
</svg>
                Subscribe for Updates
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-brown-800 mt-12 pt-8 text-center text-brown-300 text-sm">
          <p>&copy; {new Date().getFullYear()} Mehandi Mansion. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
