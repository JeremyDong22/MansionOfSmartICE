// Demo Component - Showcases scroll-expansion-hero with luxury restaurant content
// Features restaurant-specific imagery and branding

'use client';

import { useState, useEffect } from 'react';
import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero';

interface MediaAbout {
  overview: string;
  conclusion: string;
}

interface MediaContent {
  src: string;
  poster?: string;
  background: string;
  title: string;
  date: string;
  scrollToExpand: string;
  about: MediaAbout;
}

interface MediaContentCollection {
  [key: string]: MediaContent;
}

const sampleMediaContent: MediaContentCollection = {
  video: {
    src: '/avatar-video.mp4',
    poster:
      '/野百灵poster.jpg',
    background:
      '/野百灵poster.jpg',
    title: 'Culinary Excellence',
    date: 'Natural Luxury Dining',
    scrollToExpand: 'Scroll to Experience',
    about: {
      overview:
        'Welcome to Mansion of SmartICE - where natural luxury meets culinary artistry. Our philosophy embraces authentic, understated elegance inspired by global journeys and local ingredients. Each dish tells a story of places discovered and flavors reimagined.',
      conclusion:
        'Experience dining that transcends the ordinary. Our chefs blend traditional techniques with innovative approaches, creating moments that linger long after the last bite. This is not just a meal; it\'s a journey through taste, texture, and time.',
    },
  },
  image: {
    src: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?q=80&w=1280&auto=format&fit=crop',
    background:
      '/野百灵poster.jpg',
    title: 'Journey Through Flavor',
    date: 'World-Inspired Cuisine',
    scrollToExpand: 'Scroll to Discover',
    about: {
      overview:
        'Our culinary journey spans continents, bringing the world\'s finest flavors to your table. From the markets of Marrakech to the shores of Santorini, every ingredient is carefully selected to create an unforgettable dining experience.',
      conclusion:
        'Each season brings new discoveries, new stories, and new flavors. Our ever-evolving menu reflects the rhythms of nature and the inspirations gathered from our global expeditions. Join us in celebrating the art of natural luxury dining.',
    },
  },
};

const MediaContent = ({ mediaType }: { mediaType: 'video' | 'image' }) => {
  const currentMedia = sampleMediaContent[mediaType];

  return (
    <div className='max-w-4xl mx-auto'>
      <h2 className='text-3xl font-bold mb-6 text-gray-900 dark:text-white'>
        Our Philosophy
      </h2>
      <p className='text-lg mb-8 text-gray-700 dark:text-gray-300'>
        {currentMedia.about.overview}
      </p>

      <div className='grid md:grid-cols-3 gap-8 mb-12'>
        <div className='text-center'>
          <h3 className='text-xl font-semibold mb-2 text-gray-900 dark:text-white'>Farm to Table</h3>
          <p className='text-gray-600 dark:text-gray-400'>
            Locally sourced ingredients, globally inspired preparations
          </p>
        </div>
        <div className='text-center'>
          <h3 className='text-xl font-semibold mb-2 text-gray-900 dark:text-white'>Seasonal Menu</h3>
          <p className='text-gray-600 dark:text-gray-400'>
            Ever-changing offerings that reflect nature&apos;s rhythm
          </p>
        </div>
        <div className='text-center'>
          <h3 className='text-xl font-semibold mb-2 text-gray-900 dark:text-white'>Curated Experience</h3>
          <p className='text-gray-600 dark:text-gray-400'>
            Every detail thoughtfully considered for your journey
          </p>
        </div>
      </div>

      <p className='text-lg mb-8 text-gray-700 dark:text-gray-300'>
        {currentMedia.about.conclusion}
      </p>

      <div className='flex justify-center gap-4'>
        <button className='px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors'>
          View Menu
        </button>
        <button className='px-8 py-3 border border-gray-900 text-gray-900 dark:text-white dark:border-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors'>
          Make Reservation
        </button>
      </div>
    </div>
  );
};

export const VideoExpansionTextBlend = () => {
  const mediaType = 'video';
  const currentMedia = sampleMediaContent[mediaType];

  useEffect(() => {
    window.scrollTo(0, 0);

    const resetEvent = new Event('resetSection');
    window.dispatchEvent(resetEvent);
  }, []);

  return (
    <div className='min-h-screen'>
      <ScrollExpandMedia
        mediaType={mediaType}
        mediaSrc={currentMedia.src}
        posterSrc={currentMedia.poster}
        bgImageSrc={currentMedia.background}
        title={currentMedia.title}
        date={currentMedia.date}
        scrollToExpand={currentMedia.scrollToExpand}
        textBlend
      >
        <MediaContent mediaType={mediaType} />
      </ScrollExpandMedia>
    </div>
  );
};

export const ImageExpansionTextBlend = () => {
  const mediaType = 'image';
  const currentMedia = sampleMediaContent[mediaType];

  useEffect(() => {
    window.scrollTo(0, 0);

    const resetEvent = new Event('resetSection');
    window.dispatchEvent(resetEvent);
  }, []);

  return (
    <div className='min-h-screen'>
      <ScrollExpandMedia
        mediaType={mediaType}
        mediaSrc={currentMedia.src}
        bgImageSrc={currentMedia.background}
        title={currentMedia.title}
        date={currentMedia.date}
        scrollToExpand={currentMedia.scrollToExpand}
        textBlend
      >
        <MediaContent mediaType={mediaType} />
      </ScrollExpandMedia>
    </div>
  );
};

export const VideoExpansion = () => {
  const mediaType = 'video';
  const currentMedia = sampleMediaContent[mediaType];

  useEffect(() => {
    window.scrollTo(0, 0);

    const resetEvent = new Event('resetSection');
    window.dispatchEvent(resetEvent);
  }, []);

  return (
    <div className='min-h-screen'>
      <ScrollExpandMedia
        mediaType={mediaType}
        mediaSrc={currentMedia.src}
        posterSrc={currentMedia.poster}
        bgImageSrc={currentMedia.background}
        title={currentMedia.title}
        date={currentMedia.date}
        scrollToExpand={currentMedia.scrollToExpand}
      >
        <MediaContent mediaType={mediaType} />
      </ScrollExpandMedia>
    </div>
  );
};

export const ImageExpansion = () => {
  const mediaType = 'image';
  const currentMedia = sampleMediaContent[mediaType];

  useEffect(() => {
    window.scrollTo(0, 0);

    const resetEvent = new Event('resetSection');
    window.dispatchEvent(resetEvent);
  }, []);

  return (
    <div className='min-h-screen'>
      <ScrollExpandMedia
        mediaType={mediaType}
        mediaSrc={currentMedia.src}
        bgImageSrc={currentMedia.background}
        title={currentMedia.title}
        date={currentMedia.date}
        scrollToExpand={currentMedia.scrollToExpand}
      >
        <MediaContent mediaType={mediaType} />
      </ScrollExpandMedia>
    </div>
  );
};

const Demo = () => {
  const [mediaType, setMediaType] = useState('video');
  const currentMedia = sampleMediaContent[mediaType];

  useEffect(() => {
    window.scrollTo(0, 0);

    const resetEvent = new Event('resetSection');
    window.dispatchEvent(resetEvent);
  }, [mediaType]);

  return (
    <div className='min-h-screen'>
      <div className='fixed top-4 right-4 z-50 flex gap-2'>
        <button
          onClick={() => setMediaType('video')}
          className={`px-4 py-2 rounded-lg transition-all ${
            mediaType === 'video'
              ? 'bg-white text-black shadow-lg'
              : 'bg-black/50 text-white border border-white/30 hover:bg-black/70'
          }`}
        >
          Video Experience
        </button>

        <button
          onClick={() => setMediaType('image')}
          className={`px-4 py-2 rounded-lg transition-all ${
            mediaType === 'image'
              ? 'bg-white text-black shadow-lg'
              : 'bg-black/50 text-white border border-white/30 hover:bg-black/70'
          }`}
        >
          Image Gallery
        </button>
      </div>

      <ScrollExpandMedia
        mediaType={mediaType as 'video' | 'image'}
        mediaSrc={currentMedia.src}
        posterSrc={mediaType === 'video' ? currentMedia.poster : undefined}
        bgImageSrc={currentMedia.background}
        title={currentMedia.title}
        date={currentMedia.date}
        scrollToExpand={currentMedia.scrollToExpand}
        textBlend
      >
        <MediaContent mediaType={mediaType as 'video' | 'image'} />
      </ScrollExpandMedia>
    </div>
  );
};

export default Demo;