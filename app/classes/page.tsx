'use client'

// import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import AnimatedSection from '../../components/AnimatedSection';
import Button from '../../components/ui/Button';
import { Calendar, Clock, Users, BookOpen, Award, Star } from 'lucide-react';

const Classes = () => {
  // const [activeTab, setActiveTab] = useState('all');

  const courses = [
    {
      title: 'Beginner\'s Foundation',
      price: '₹4,999',
      duration: '4 weeks',
      features: [
        'Basic patterns and techniques',
        'Understanding henna consistency',
        'Simple bridal designs',
        'Practice materials included',
        'Certificate of completion'
      ]
    },
    {
      title: 'Professional Course',
      price: '₹9,999',
      duration: '8 weeks',
      popular: true,
      features: [
        'Advanced design techniques',
        'Bridal and party designs',
        'Color mixing and application',
        'Business management basics',
        'Professional kit included',
        'Internship opportunity'
      ]
    },
    {
      title: 'Master Class',
      price: '₹14,999',
      duration: '12 weeks',
      features: [
        'Expert level techniques',
        'Custom design development',
        'Portfolio building',
        'Business establishment',
        'Premium tools included',
        'Placement assistance'
      ]
    }
  ];

  const features = [
    {
      icon: Award,
      title: 'Expert Instructors',
      description: 'Learn from professional artists with years of experience in bridal and contemporary designs.'
    },
    {
      icon: Users,
      title: 'Small Batch Size',
      description: 'Limited students per batch ensuring personal attention and better learning.'
    },
    {
      icon: BookOpen,
      title: 'Comprehensive Curriculum',
      description: 'Well-structured courses covering everything from basics to advanced techniques.'
    },
    {
      icon: Calendar,
      title: 'Flexible Schedule',
      description: 'Choose from weekend or weekday batches to suit your convenience.'
    }
  ];

  return (
    <>
      <Head>
        <title>Mehandi Classes | Learn Henna Art from Experts</title>
        <meta name="description" content="Join our professional mehandi classes and master the art of henna design. Courses available for all skill levels with expert instructors." />
      </Head>
      
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow pt-20">
          {/* Hero Section */}
          <AnimatedSection className="relative py-20">
            <div className="absolute inset-0">
              <Image 
                src="https://images.pexels.com/photos/6690924/pexels-photo-6690924.jpeg"
                alt="Mehandi class background"
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-brown-900/90 to-brown-800/80" />
            </div>
            <div className="container mx-auto px-4 relative">
              <div className="max-w-2xl text-white">
                <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
                  Master the Art of Mehandi
                </h1>
                <p className="text-xl mb-8">
                  Learn from expert artists and start your journey in the beautiful world of mehandi design
                </p>
                <Button variant="primary" size="lg">
                  Enroll Now
                </Button>
              </div>
            </div>
          </AnimatedSection>

          {/* Courses Section */}
          <AnimatedSection className="py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-serif text-brown-900 mb-4">Our Courses</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Choose from our carefully crafted courses designed for all skill levels
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {courses.map((course, index) => (
                  <div 
                    key={index}
                    className={`relative bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-[1.02] ${
                      course.popular ? 'border-2 border-green-500' : 'border border-gray-200'
                    }`}
                  >
                    {course.popular && (
                      <div className="absolute top-0 right-0 bg-green-500 text-white px-4 py-1 text-sm font-medium">
                        Most Popular
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                      <div className="text-3xl font-bold text-brown-800 mb-4">{course.price}</div>
                      <div className="flex items-center text-gray-600 mb-4">
                        <Clock size={16} className="mr-2" />
                        <span>{course.duration}</span>
                      </div>
                      <ul className="space-y-3 mb-6">
                        {course.features.map((feature, i) => (
                          <li key={i} className="flex items-start">
                            <Star size={16} className="text-brown-600 mr-2 mt-1" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button 
                        variant={course.popular ? "secondary" : "primary"} 
                        size="lg"
                        className="w-full"
                      >
                        Enroll Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Features Section */}
          <AnimatedSection className="py-16 bg-brown-50">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-serif text-brown-900 mb-6">Why Learn With Us?</h2>
                  <div className="space-y-6">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-12 h-12 bg-brown-100 rounded-full flex items-center justify-center mr-4">
                          <feature.icon size={24} className="text-brown-700" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 mb-1">{feature.title}</h3>
                          <p className="text-gray-600">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="relative aspect-[4/3]">
                  <Image 
                    src="https://images.pexels.com/photos/8472892/pexels-photo-8472892.jpeg"
                    alt="Mehandi class in session"
                    fill
                    className="rounded-lg shadow-lg object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute -bottom-6 -right-6 w-40 h-40 rounded-full border-8 border-white overflow-hidden shadow-lg hidden md:block">
                    <Image 
                      src="https://images.pexels.com/photos/8472874/pexels-photo-8472874.jpeg"
                      alt="Student work"
                      fill
                      className="object-cover"
                      sizes="160px"
                    />
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* CTA Section */}
          <AnimatedSection className="py-16">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-serif text-brown-900 mb-8">Ready to Start Your Journey?</h2>
              <Button variant="primary" size="lg">
                Enroll Now
              </Button>
            </div>
          </AnimatedSection>
        </main>
      </div>
    </>
  );
};

export default Classes;