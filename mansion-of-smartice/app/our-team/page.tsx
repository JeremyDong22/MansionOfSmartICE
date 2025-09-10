// Our Team Page - Mansion of SmartICE
// Team members, chef profiles, and contact information

'use client';

import { useState } from 'react';

const teamMembers = [
  {
    id: 1,
    name: 'Jean-Pierre Dubois',
    role: 'Executive Chef',
    bio: 'With three Michelin stars and 25 years of culinary excellence, Chef Dubois brings his passion for ingredient-driven cuisine to Mansion of SmartICE. Trained in Lyon and Paris, his philosophy centers on respecting tradition while embracing innovation.',
    specialties: ['French haute cuisine', 'Molecular gastronomy', 'Seasonal menus'],
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=800',
    awards: ['3 Michelin Stars', 'James Beard Award', 'Bocuse d\'Or Silver'],
    contact: 'chef@mansionofsmartice.com'
  },
  {
    id: 2,
    name: 'Akiko Tanaka',
    role: 'Head Pastry Chef',
    bio: 'Award-winning pastry chef Akiko brings artistry and precision to our dessert program. Her creations balance Eastern and Western techniques, resulting in desserts that are both visually stunning and perfectly balanced.',
    specialties: ['Japanese-French fusion', 'Chocolate artistry', 'Seasonal fruit desserts'],
    image: 'https://images.unsplash.com/photo-1595475038784-bbe439ff41e6?q=80&w=800',
    awards: ['World Pastry Champion 2022', 'Relais Desserts Member'],
    contact: 'pastry@mansionofsmartice.com'
  },
  {
    id: 3,
    name: 'Marcus Chen',
    role: 'Sous Chef',
    bio: 'Marcus brings his expertise in Asian fusion and farm-to-table cooking to our kitchen. His innovative approach to traditional techniques has earned recognition from critics and guests alike.',
    specialties: ['Asian fusion', 'Fermentation', 'Zero-waste cooking'],
    image: 'https://images.unsplash.com/photo-1558137623-ce933996c730?q=80&w=800',
    awards: ['Rising Star Chef 2023', 'Sustainable Chef Award'],
    contact: 'kitchen@mansionofsmartice.com'
  },
  {
    id: 4,
    name: 'Isabella Romano',
    role: 'Head Sommelier',
    bio: 'With a collection of over 3,000 wines, Isabella curates exceptional pairings that elevate every dining experience. Her knowledge spans Old World classics to New World innovations.',
    specialties: ['Wine pairing', 'Rare vintages', 'Natural wines'],
    image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=800',
    awards: ['Master Sommelier', 'Wine Spectator Grand Award'],
    contact: 'wine@mansionofsmartice.com'
  },
  {
    id: 5,
    name: 'David Mitchell',
    role: 'Restaurant Manager',
    bio: 'David ensures every guest experience exceeds expectations. With 15 years in luxury hospitality, he leads our service team with grace and attention to detail.',
    specialties: ['Guest relations', 'Event planning', 'Service excellence'],
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800',
    awards: ['Forbes Travel Guide Five Star'],
    contact: 'reservations@mansionofsmartice.com'
  },
  {
    id: 6,
    name: 'Sarah Kim',
    role: 'Events Director',
    bio: 'Sarah transforms our private dining spaces into unforgettable experiences. Her creative vision and meticulous planning ensure every event is perfectly executed.',
    specialties: ['Private events', 'Corporate dining', 'Wedding celebrations'],
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800',
    awards: ['Event Planner of the Year 2023'],
    contact: 'events@mansionofsmartice.com'
  }
];

export default function OurTeamPage() {
  const [selectedMember, setSelectedMember] = useState<typeof teamMembers[0] | null>(null);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <div className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40 z-10" />
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?q=80&w=1920"
            alt="Our Team"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-20 text-center text-white max-w-3xl px-6">
          <h1 className="text-5xl md:text-7xl font-light mb-4">Our Team</h1>
          <p className="text-xl font-light opacity-90">
            The passionate individuals who bring Mansion of SmartICE to life
          </p>
        </div>
      </div>

      {/* Team Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="group cursor-pointer"
              onClick={() => setSelectedMember(member)}
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg mb-4">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div>
                <h3 className="text-xl font-light mb-1">{member.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-3">{member.role}</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 line-clamp-3">
                  {member.bio}
                </p>
                <button className="mt-3 text-sm text-gray-900 dark:text-white underline-offset-4 hover:underline">
                  View Profile →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-8 lg:p-12">
          <h2 className="text-3xl font-light mb-8 text-center">Get in Touch</h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Reservations</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-3">Daily 10am - 10pm</p>
              <p className="font-medium">+1 (555) 123-4567</p>
              <a href="mailto:reservations@mansionofsmartice.com" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                reservations@mansionofsmartice.com
              </a>
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Private Events</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-3">Monday - Friday 9am - 6pm</p>
              <p className="font-medium">+1 (555) 123-4568</p>
              <a href="mailto:events@mansionofsmartice.com" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                events@mansionofsmartice.com
              </a>
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">General Inquiries</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-3">Monday - Friday 9am - 5pm</p>
              <p className="font-medium">+1 (555) 123-4569</p>
              <a href="mailto:info@mansionofsmartice.com" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                info@mansionofsmartice.com
              </a>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
            <h3 className="text-lg font-medium mb-4 text-center">Visit Us</h3>
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400">
                123 Culinary Boulevard<br />
                San Francisco, CA 94102<br />
                United States
              </p>
              <div className="mt-6">
                <p className="text-sm font-medium mb-2">Hours of Operation</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tuesday - Thursday: 5:30pm - 10:00pm<br />
                  Friday - Saturday: 5:30pm - 11:00pm<br />
                  Sunday: 5:00pm - 9:00pm<br />
                  Monday: Closed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Member Modal */}
      {selectedMember && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 overflow-y-auto"
          onClick={() => setSelectedMember(null)}
        >
          <div 
            className="min-h-screen px-6 py-12"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-w-4xl mx-auto">
              <button
                onClick={() => setSelectedMember(null)}
                className="text-white mb-6 hover:opacity-70 transition-opacity"
              >
                ← Back to Team
              </button>
              
              <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
                <div className="grid md:grid-cols-2">
                  <img
                    src={selectedMember.image}
                    alt={selectedMember.name}
                    className="w-full h-full object-cover"
                  />
                  
                  <div className="p-8 lg:p-12">
                    <h2 className="text-3xl font-light mb-2">{selectedMember.name}</h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">{selectedMember.role}</p>
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                      {selectedMember.bio}
                    </p>
                    
                    <div className="mb-6">
                      <h4 className="font-medium mb-3">Specialties</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedMember.specialties.map((specialty) => (
                          <span key={specialty} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {selectedMember.awards && (
                      <div className="mb-6">
                        <h4 className="font-medium mb-3">Recognition</h4>
                        <ul className="space-y-1">
                          {selectedMember.awards.map((award) => (
                            <li key={award} className="text-gray-600 dark:text-gray-400">
                              • {award}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
                      <a 
                        href={`mailto:${selectedMember.contact}`}
                        className="inline-block px-6 py-2 bg-gray-900 text-white dark:bg-white dark:text-gray-900 rounded hover:opacity-90 transition-opacity"
                      >
                        Contact {selectedMember.name.split(' ')[0]}
                      </a>
                    </div>
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