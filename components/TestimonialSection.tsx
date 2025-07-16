'use client';

import React from 'react';
import Image, { StaticImageData } from 'next/image';




import salaam from '../public/images/testimonial/salaam.jpg';
import sumayya from '../public/images/testimonial/sumayya.jpg'; 
import amjitha from '../public/images/testimonial/amjitha.jpg';
import ramya from '../public/images/testimonial/ramya.jpg';
import krishna from '../public/images/testimonial/krishna.jpg';
import { id } from 'date-fns/locale';



// interface Testimonial {
//   id: number;
//   name: string;
//   role: string;
//   resultImage: a;
//   profileImage: string;
//   quote: string;
//   rating: number;
// }

const testimonials = [
  {
    id: 1,
    name: 'Salaam',
    // role: 'Bride',
    profileImage: 'S',
    resultImage: salaam,
    quote: 'Naturally gorgeous black!”** Tried so many hair colors, but this one is a game changer. It gave my hair a rich black shade without the dryness or harsh chemicals. Smells earthy and fresh, and my scalp feels soothed after every use. Definitely a repeat buy!',
    rating: 5
  },
  {
    id: 2,
    name: 'Ramya',
    // role: 'Makeup Artist',
    profileImage: 'R',
    resultImage: ramya,
    quote: 'Deep stain and smooth cone flow!”** The color payoff is stunning—dark maroon stain that lasts for days! The cone glides beautifully, perfect for detailed designs. Ideal for festivals and bridal work. No chemical smell, just the lovely aroma of pure henna.',
    rating: 5
  },
  {
    id: 3,
    name: 'Ahaana',
    // role: 'Groom',
    profileImage: 'A',
    // resultImage: amjitha,
    quote: "Mild, cleansing and smells divine”** Love the herbal scent and gentle cleansing! Doesn’t strip the natural oils from my hair, and pairs perfectly with the black henna. Hair feels softer and less frizzy. Would love a bigger bottle version!",
    rating: 4
  },
  {
    id: 4,
    name: 'Sumayya',
    // role: 'Bride',
    profileImage: 'S',
    resultImage: sumayya,
    quote: "Traditional beauty for nails!”** So nostalgic and elegant! Gave my nails a pretty orange-red tint that looked so classy and clean. Great alternative to nail polish, and it conditions the nails too. Totally chemical-free and safe!",
    rating: 5
  },
  {
    id: 5,
    name: 'Amjitha',
    // role: 'Event Planner',
    profileImage: 'A',
    resultImage: amjitha,
    // quote: "",
    rating: 5
  },
  {
    id: 6,
    name: 'Krishna',
    // role: 'Event Planner',
    profileImage: 'k',
    resultImage: krishna,
    // quote: "",
    rating: 5
  },
  {
    id: 7,
    name: 'Saluja',
    role: 'Practice book',
    profileImage: 'SV',
    // resultImage: amjitha,
    quote: "Perfect for beginners and pros!”** A treasure for any mehendi artist! Beautifully printed with step-by-step motifs—from simple flowers to bridal designs. The grid and outline pages are super helpful. Practicing has never been more fun and organized.",
    rating: 5
  },
  {
    id: 8,
    name: 'Naina',
    role: 'Bridal Kit',
    profileImage: 'N',
    quote: 'Everything a bride or artist needs!”** Absolutely loved this kit! It had rich-staining cones, essential oils, aftercare balm, and even glitters. Perfect for doing full bridal hands and feet. The quality is unmatched. A must-have for brides.',
    rating: 5,
  }
];

const TestimonialSection = () => {
  return (
    <section className="py-16 bg-amber-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif text-amber-900 mb-4">Mehandi Transformations</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            See real results from our happy customers and read their experiences
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map(testimonial => (
            <div 
              key={testimonial.id} 
              className="relative rounded-lg overflow-hidden shadow-lg group"
            >
              {/* Result Image Background */}
              <div className="relative sm:h-64 lg:h-64 h-80 md:h-80">
                {testimonial.resultImage && (  
                <Image
                  src={testimonial.resultImage}
                  alt={`Mehndi result for ${testimonial.name}`}
                  fill
                  className="object-contain transition-transform duration-500 group-hover:scale-105"
                />
                )}
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/30" />
              </div>
              
              {/* Testimonial Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-amber-300">
                    {/* <Image
                      src={testimonial.profileImage}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    /> */}
                    <div className="w-full h-full bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white italic font-bold text-xl">{testimonial.profileImage}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{testimonial.name}</h4>
                    <p className="text-sm text-amber-200">{testimonial.role}</p>
                  </div>
                </div>
                
                {testimonial.quote && <blockquote className="italic mb-3 text-amber-100">
                  "{testimonial.quote}"
                </blockquote>}
                
                <div className="flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg 
                      key={i} 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 text-amber-400" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TestimonialSection;
        // {/* Second row with 2 testimonials centered */}
        // <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 max-w-4xl mx-auto">
        //   {testimonials.slice(3, 5).map(testimonial => (
        //     <div 
        //       key={testimonial.id} 
        //       className="relative rounded-lg overflow-hidden shadow-lg group"
        //     >
        //       {/* Result Image Background */}
        //       <div className="relative h-64">
        //         {testimonial.resultImage && (   
        //           <Image
        //             src={testimonial.resultImage}
        //             alt={`Mehndi result for ${testimonial.name}`}
        //             fill
        //             className="object-contain transition-transform duration-500 group-hover:scale-105"
        //           />
        //         )}
        //         {/* Gradient overlay */}
        //         <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/30" />
        //       </div>
              
        //       {/* Testimonial Content */}
        //       <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        //         <div className="flex items-center mb-3">
        //           <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-amber-300">
        //             {/* <Image
        //               src={testimonial.profileImage}
        //               alt={testimonial.name}
        //               width={48}
        //               height={48}
        //               className="w-full h-full object-cover"
        //             /> */}
        //             <div className="w-full h-full bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
        //               <span className="text-white italic font-bold text-xl">{testimonial.profileImage}</span>
        //             </div>
        //           </div>
        //           <div>
        //             <h4 className="font-medium text-white">{testimonial.name}</h4>
        //             <p className="text-sm text-amber-200">{testimonial.role}</p>
        //           </div>
        //         </div>
                
        //         <blockquote className="italic mb-3 text-amber-100">
        //           "{testimonial.quote}"
        //         </blockquote>
                
        //         <div className="flex">
        //           {[...Array(testimonial.rating)].map((_, i) => (
        //             <svg 
        //               key={i} 
        //               xmlns="http://www.w3.org/2000/svg" 
        //               className="h-5 w-5 text-amber-400" 
        //               viewBox="0 0 20 20" 
        //               fill="currentColor"
        //             >
        //               <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        //             </svg>
        //           ))}
        //         </div>
        //       </div>
        //     </div>
        //   ))}
        // </div>