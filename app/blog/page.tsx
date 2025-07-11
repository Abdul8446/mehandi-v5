import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import AnimatedSection from '../../components/AnimatedSection';

const blogPosts = [
  {
    id: '1',
    title: 'The History and Significance of Mehandi in Indian Weddings',
    excerpt: 'Explore the cultural significance and evolution of bridal mehandi traditions across different regions of India.',
    image: 'https://images.pexels.com/photos/3014853/pexels-photo-3014853.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    date: 'May 15, 2025',
    category: 'Culture',
    author: 'Priya Sharma'
  },
  {
    id: '2',
    title: '7 Tips for Long-Lasting and Vibrant Mehandi',
    excerpt: 'Learn professional secrets to achieve the darkest stain and make your mehandi design last longer.',
    image: 'https://images.pexels.com/photos/10649797/pexels-photo-10649797.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    date: 'April 28, 2025',
    category: 'Tips',
    author: 'Aisha Khan'
  },
  {
    id: '3',
    title: 'Modern Mehandi Designs for Contemporary Brides',
    excerpt: 'Discover trending fusion designs combining traditional patterns with modern artistic elements.',
    image: 'https://images.pexels.com/photos/8472892/pexels-photo-8472892.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    date: 'April 10, 2025',
    category: 'Inspiration',
    author: 'Meera Patel'
  }
];

const Blog = () => {
  return (
    <>
      <Head>
        <title>Blog & Articles | Mehndi Insights</title>
        <meta name="description" content="Discover tips, traditions, and trends in the art of mehandi" />
      </Head>
      
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow pt-20">
          <AnimatedSection className="bg-brown-900 text-white py-16">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">Blog & Articles</h1>
              <p className="max-w-2xl mx-auto">
                Discover tips, traditions, and trends in the art of mehandi
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection className="py-16">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.map(post => (
                  <article key={post.id} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                    <Link href={`/blog/${post.id}`} className="block">
                      <div className="aspect-video overflow-hidden relative">
                        <Image 
                          src={post.image} 
                          alt={post.title}
                          fill
                          className="object-cover transition-transform hover:scale-105 duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          priority={post.id === '1'} // Only prioritize first image
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <span>{post.date}</span>
                          <span className="mx-2">•</span>
                          <span className="text-brown-700">{post.category}</span>
                        </div>
                        <h2 className="text-xl font-medium text-gray-900 mb-2 hover:text-brown-600 transition-colors">
                          {post.title}
                        </h2>
                        <p className="text-gray-600 mb-4">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center">
                          <div className="text-sm">
                            <p className="text-gray-900 font-medium">By {post.author}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </main>
      </div>
    </>
  );
};

export default Blog;