'use client'

import { useParams } from 'next/navigation';
import Head from 'next/head';
import Image from 'next/image';
import AnimatedSection from '../../../components/AnimatedSection';

interface BlogPost {
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  category: string;
  author: string;
}

// Define valid IDs as a type
type BlogPostId = '1' | '2' | '3';

// This would typically come from an API or CMS
const blogPosts: Record<BlogPostId, BlogPost> = {
  '1': {
    title: 'The History and Significance of Mehandi in Indian Weddings',
    excerpt: 'Explore the cultural significance and evolution of bridal mehandi traditions across different regions of India.',
    content: `
      <p>Mehandi, also known as Henna, has been an integral part of Indian weddings for centuries. This ancient art form not only adorns the bride's hands and feet but also carries deep cultural significance and meaning.</p>
      
      <h2>The Origins</h2>
      <p>The tradition of applying mehandi dates back to ancient Egypt, but it found its deepest roots in Indian culture. The intricate patterns and designs symbolize the deep bond between the bride and groom, with many believing that the darker the color, the stronger the love will be.</p>
      
      <h2>Regional Variations</h2>
      <p>Different regions of India have their own unique mehandi styles and patterns. While North Indian designs often feature fine lines and floral patterns, South Indian mehandi tends to be bold with geometric shapes. Western Indian designs are known for their dense coverage and intricate details.</p>
      
      <h2>Modern Interpretations</h2>
      <p>Today's brides are experimenting with fusion designs that combine traditional motifs with contemporary elements. Some popular trends include portrait mehandi, architectural elements, and personalized story-telling through designs.</p>
    `,
    image: 'https://images.pexels.com/photos/3014853/pexels-photo-3014853.jpeg',
    date: 'May 15, 2025',
    category: 'Culture',
    author: 'Priya Sharma'
  },
  '2': {
    title: '7 Tips for Long-Lasting and Vibrant Mehandi',
    excerpt: 'Learn professional secrets to achieve the darkest stain and make your mehandi design last longer.',
    content: `
      <p>Getting that perfect dark mehandi stain requires more than just good quality henna. Here are seven professional tips to help your designs last longer:</p>
      
      <h2>1. Pre-Application Preparation</h2>
      <p>Exfoliate your skin a day before application to remove dead skin cells. Avoid using oils or lotions on the application area as they create a barrier.</p>
      
      <h2>2. The Right Consistency</h2>
      <p>The henna paste should be smooth like toothpaste. Too watery and it will run; too thick and it will crack.</p>
      
      <h2>3. Keep It Warm</h2>
      <p>After application, keep the area warm (but not hot) to help the dye release. Some people use a hair dryer on low heat.</p>
      
      <h2>4. The Longer, The Better</h2>
      <p>Leave the paste on for at least 6-8 hours, ideally overnight. The longer the contact time, the darker the stain.</p>
      
      <h2>5. Post-Care Matters</h2>
      <p>After removing the paste, avoid water contact for 24 hours. Apply a mixture of lemon juice and sugar to help set the stain.</p>
      
      <h2>6. Avoid Soap</h2>
      <p>For the first 48 hours, clean the area with just water or use an oil-based cleanser.</p>
      
      <h2>7. Moisturize Carefully</h2>
      <p>After the first two days, use natural oils like coconut or olive oil to maintain the stain.</p>
    `,
    image: 'https://images.pexels.com/photos/10649797/pexels-photo-10649797.jpeg',
    date: 'April 28, 2025',
    category: 'Tips',
    author: 'Aisha Khan'
  },
  '3': {
    title: 'Modern Mehandi Designs for Contemporary Brides',
    excerpt: 'Discover trending fusion designs combining traditional patterns with modern artistic elements.',
    content: `
      <p>Your mehandi should reflect your personal style while honoring tradition. Here are the latest trends for modern brides:</p>
      
      <h2>1. Minimalist Designs</h2>
      <p>Delicate, sparse patterns with negative space are gaining popularity among contemporary brides who prefer subtle elegance.</p>
      
      <h2>2. Fusion Patterns</h2>
      <p>Combining traditional Indian motifs with elements from other cultures creates unique, personalized designs.</p>
      
      <h2>3. Storytelling Through Henna</h2>
      <p>Many brides now incorporate meaningful symbols, dates, or even portraits into their designs.</p>
      
      <h2>4. Asymmetrical Patterns</h2>
      <p>Breaking from traditional symmetry, these designs create dynamic visual interest.</p>
      
      <h2>5. Glitter and Embellishments</h2>
      <p>Some brides are adding subtle glitter or small jewels to highlight certain design elements.</p>
    `,
    image: 'https://images.pexels.com/photos/8472892/pexels-photo-8472892.jpeg',
    date: 'April 10, 2025',
    category: 'Inspiration',
    author: 'Meera Patel'
  }
};

const BlogPost = () => {
  const params = useParams();
  const id = params.id as BlogPostId;
  const post = blogPosts[id] || blogPosts['1']; // Default to first post if ID not found

  return (
    <>                
      <Head>
        <title>{post.title} | Mehndi Insights</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:image" content={post.image} />
      </Head>
      
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow pt-20">
          <AnimatedSection className="relative h-96">
            <div className="w-full h-full relative">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="container mx-auto px-4 pb-12">
                  <h1 className="text-3xl md:text-4xl font-serif text-white font-bold mb-4">
                    {post.title}
                  </h1>
                  <div className="flex items-center text-white/80 text-sm">
                    <span>{post.date}</span>
                    <span className="mx-2">•</span>
                    <span>{post.category}</span>
                    <span className="mx-2">•</span>
                    <span>By {post.author}</span>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection className="py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto prose prose-lg">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>
            </div>
          </AnimatedSection>
        </main>
      </div>
    </>
  );
};

export default BlogPost;