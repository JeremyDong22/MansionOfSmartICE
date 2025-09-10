// Gallery Page - Mansion of SmartICE
// Travel narratives, inspiration stories, and brand journey

'use client';

import { useState } from 'react';

const stories = [
  {
    id: 1,
    title: 'Journey to Hokkaido',
    subtitle: 'In Search of Perfect Scallops',
    date: 'Winter 2024',
    location: 'Hokkaido, Japan',
    coverImage: 'https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=1920',
    images: [
      'https://images.unsplash.com/photo-1492571350019-22de08371fd3?q=80&w=1280',
      'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?q=80&w=1280',
      'https://images.unsplash.com/photo-1535189043414-47a3c49a0bed?q=80&w=1280'
    ],
    story: 'Our journey to Hokkaido began at dawn, meeting the fishermen who have been diving these waters for generations. The crystalline waters and sustainable practices ensure each scallop is a testament to the ocean\'s bounty.',
    highlights: ['Met 3rd generation fishermen', 'Learned traditional diving techniques', 'Selected seasonal varieties']
  },
  {
    id: 2,
    title: 'Truffle Forests of Périgord',
    subtitle: 'The Black Diamond Hunt',
    date: 'December 2023',
    location: 'Périgord, France',
    coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1920',
    images: [
      'https://images.unsplash.com/photo-1601001815894-4bb6c81416d7?q=80&w=1280',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1280',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1280'
    ],
    story: 'Deep in the oak forests of Périgord, we joined truffle hunters and their specially trained dogs in search of "black diamonds." The morning mist, the excited barking, the earth\'s aroma - every moment was magical.',
    highlights: ['Traditional truffle hunting', 'Century-old oak forests', 'Family traditions preserved']
  },
  {
    id: 3,
    title: 'California Farm Partners',
    subtitle: 'Growing Together',
    date: 'Summer 2024',
    location: 'Northern California',
    coverImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1920',
    images: [
      'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?q=80&w=1280',
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1280',
      'https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=1280'
    ],
    story: 'Our partnership with local organic farms represents our commitment to sustainability and community. These farms, within 50 miles of our restaurant, practice regenerative agriculture that enriches both soil and soul.',
    highlights: ['Regenerative farming', 'Seasonal harvests', 'Community partnerships']
  },
  {
    id: 4,
    title: 'Spice Markets of Marrakech',
    subtitle: 'Colors and Aromas',
    date: 'Spring 2024',
    location: 'Marrakech, Morocco',
    coverImage: 'https://images.unsplash.com/photo-1534841775-53a6c8a8f0e1?q=80&w=1920',
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=1280',
      'https://images.unsplash.com/photo-1506368144556-593c6d0a3868?q=80&w=1280',
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1280'
    ],
    story: 'The souks of Marrakech awakened our senses to new possibilities. Ancient spice blends, passed down through generations, now inspire our seasonal menu with their complex layers of flavor.',
    highlights: ['Ancient spice routes', 'Traditional blending techniques', 'Cultural exchange']
  }
];

export default function GalleryPage() {
  const [selectedStory, setSelectedStory] = useState<typeof stories[0] | null>(null);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30 z-10" />
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1920"
            alt="Gallery"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-20 text-center text-white max-w-3xl px-6">
          <h1 className="text-5xl md:text-7xl font-light mb-4">Our Journey</h1>
          <p className="text-xl font-light opacity-90">
            Stories from our travels and the inspirations behind every dish
          </p>
        </div>
      </div>

      {/* Stories Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          {stories.map((story) => (
            <div
              key={story.id}
              className="group cursor-pointer"
              onClick={() => setSelectedStory(story)}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-4">
                <img
                  src={story.coverImage}
                  alt={story.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-sm opacity-80 mb-2">{story.date} • {story.location}</p>
                  <h3 className="text-2xl font-light mb-1">{story.title}</h3>
                  <p className="text-sm opacity-90">{story.subtitle}</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 line-clamp-3">{story.story}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Story Modal */}
      {selectedStory && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 overflow-y-auto"
          onClick={() => setSelectedStory(null)}
        >
          <div 
            className="min-h-screen px-6 py-12"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-w-5xl mx-auto">
              <button
                onClick={() => setSelectedStory(null)}
                className="text-white mb-6 hover:opacity-70 transition-opacity"
              >
                ← Back to Gallery
              </button>
              
              <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
                <img
                  src={selectedStory.coverImage}
                  alt={selectedStory.title}
                  className="w-full h-[60vh] object-cover"
                />
                
                <div className="p-8 lg:p-12">
                  <div className="mb-8">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      {selectedStory.date} • {selectedStory.location}
                    </p>
                    <h2 className="text-4xl font-light mb-2">{selectedStory.title}</h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400">{selectedStory.subtitle}</p>
                  </div>
                  
                  <p className="text-lg leading-relaxed mb-8 text-gray-700 dark:text-gray-300">
                    {selectedStory.story}
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-8">
                    {selectedStory.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`${selectedStory.title} ${idx + 1}`}
                        className="w-full aspect-[4/3] object-cover rounded-lg"
                      />
                    ))}
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                    <h4 className="text-lg font-medium mb-3">Journey Highlights</h4>
                    <ul className="space-y-2">
                      {selectedStory.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-gray-400 mr-2">•</span>
                          <span className="text-gray-600 dark:text-gray-400">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}