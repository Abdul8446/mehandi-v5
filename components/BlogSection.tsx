'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The History and Significance of Mehandi in Indian Weddings',
    excerpt: 'Explore the cultural significance and evolution of bridal mehandi traditions across different regions of India.',
    image: 'https://images.pexels.com/photos/3014853/pexels-photo-3014853.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    date: 'May 15, 2025',
    category: 'Culture'
  },
  {
    id: '2',
    title: '7 Tips for Long-Lasting and Vibrant Mehandi',
    excerpt: 'Learn professional secrets to achieve the darkest stain and make your mehandi design last longer.',
    image: 'https://images.pexels.com/photos/10649797/pexels-photo-10649797.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    date: 'April 28, 2025',
    category: 'Tips'
  },
  {
    id: '3',
    title: 'Modern Mehandi Designs for Contemporary Brides',
    excerpt: 'Discover trending fusion designs combining traditional patterns with modern artistic elements.',
    image: 'https://images.pexels.com/photos/8472892/pexels-photo-8472892.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    date: 'April 10, 2025',
    category: 'Inspiration'
  }
];

const BlogSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif text-amber-900 mb-4">From Our Blog</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Insights, inspiration, and expert advice on mehandi art and traditions
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map(post => (
            <article 
              key={post.id} 
              className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <Link href={`/blog/${post.id}`} className="block">
                <div className="aspect-video overflow-hidden">
                  <Image 
                    src={post.image} 
                    alt={post.title}
                    width={1260}
                    height={750}
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <span>{post.date}</span>
                    <span className="mx-2">•</span>
                    <span className="text-amber-700">{post.category}</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>
                  <span className="text-amber-800 font-medium text-sm inline-flex items-center">
                    Read More
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link 
            href="/blog" 
            className="inline-block px-6 py-3 bg-white text-amber-800 font-medium rounded-md border border-amber-800 hover:bg-amber-50 transition-colors"
          >
            View All Articles
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;