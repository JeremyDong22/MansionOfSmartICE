// Locations Page - Mansion of SmartICE
// Restaurant locations with details and imagery

'use client';

import { useState } from 'react';

const locations = [
  {
    id: 1,
    name: '绵阳1958店',
    city: '绵阳',
    address: '四川省绵阳市涪城区工区街道跃进路50号九洲跃进路1958 6栋1层',
    phone: '+86 (816) 123-4567',
    coordinates: [31.4674, 104.6817] as [number, number], // 需要更新为准确坐标
    hours: {
      '每天': '11:00 - 14:00, 17:00 - 21:30'
    },
    features: ['私人包房', '酒窖'],
    image: '/location_mianyang1958.jpg',
    description: '我们在绵阳的1958店融合了传统与现代，为您带来独特的美食体验。',
    capacity: '120位客人',
    established: '1958'
  },
  {
    id: 2,
    name: '绵阳上马店',
    city: '绵阳',
    address: '四川省绵阳市',
    phone: '+86 (816) 123-4568',
    coordinates: [31.4774, 104.6917] as [number, number], // 需要更新为准确坐标
    hours: {
      '每天': '11:00 - 14:00, 17:00 - 21:30'
    },
    features: ['私人包房', '酒窖'],
    image: '/location_mianyang1958.jpg',
    description: '绵阳上马店为您提供舒适的用餐环境和精致的美食体验。',
    capacity: '100位客人',
    established: '2022'
  },
  {
    id: 3,
    name: '德阳1958店',
    city: '德阳',
    address: '四川省德阳市',
    phone: '+86 (838) 123-4567',
    coordinates: [31.1289, 104.3979] as [number, number], // 需要更新为准确坐标
    hours: {
      '每天': '11:00 - 14:00, 17:00 - 21:30'
    },
    features: ['私人包房', '酒窖'],
    image: '/location_mianyang1958.jpg',
    description: '德阳1958店传承经典，为您带来地道的美食享受。',
    capacity: '110位客人',
    established: '2023'
  },
  {
    id: 4,
    name: '常熟店',
    city: '常熟',
    address: '江苏省常熟市',
    phone: '+86 (512) 123-4567',
    coordinates: [31.6547, 120.7489] as [number, number], // 需要更新为准确坐标
    hours: {
      '每天': '11:00 - 14:00, 17:00 - 21:30'
    },
    features: ['私人包房', '酒窖'],
    image: '/location_mianyang1958.jpg',
    description: '常熟店将江南风味与现代美食完美融合。',
    capacity: '90位客人',
    established: '2024'
  }
];

export default function LocationsPage() {
  const [selectedCity, setSelectedCity] = useState('绵阳');
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);

  // Get unique cities
  const cities = [...new Set(locations.map(loc => loc.city))];
  
  // Get locations for selected city
  const cityLocations = locations.filter(loc => loc.city === selectedCity);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <div className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40 z-10" />
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1920"
            alt="Locations"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-20 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-light mb-4">门店位置</h1>
          <p className="text-xl font-light opacity-90">品味云贵川风味，尽在野百灵</p>
        </div>
      </div>

      {/* Location Selector */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* City Selector */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => {
                setSelectedCity(city);
                const firstLocationInCity = locations.find(loc => loc.city === city);
                if (firstLocationInCity) setSelectedLocation(firstLocationInCity);
              }}
              className={`px-6 py-3 rounded-lg transition-all ${
                selectedCity === city
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                  : 'border border-gray-300 dark:border-gray-700 hover:border-gray-900 dark:hover:border-white'
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Store Selector for selected city (only show if city has multiple stores) */}
        {cityLocations.length > 1 && (
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {cityLocations.map((location) => (
              <button
                key={location.id}
                onClick={() => setSelectedLocation(location)}
                className={`px-4 py-2 text-sm rounded transition-all ${
                  selectedLocation.id === location.id
                    ? 'bg-gray-700 text-white dark:bg-gray-300 dark:text-gray-900'
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {location.name}
              </button>
            ))}
          </div>
        )}

        {/* Selected Location Details */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <img
              src={selectedLocation.image}
              alt={selectedLocation.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-black/90 backdrop-blur px-4 py-2 rounded">
              <p className="text-sm">Established {selectedLocation.established}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-light mb-2">{selectedLocation.name}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {selectedLocation.description}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Capacity: {selectedLocation.capacity}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">地址 Address</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedLocation.address}
                </p>
                <a 
                  href={`https://maps.apple.com/?q=${encodeURIComponent(selectedLocation.name)}&address=${encodeURIComponent(selectedLocation.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-900 dark:text-white underline-offset-4 hover:underline mt-2 inline-block"
                >
                  查看地图 →
                </a>
              </div>

              <div>
                <h3 className="font-medium mb-3">联系方式 Contact</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedLocation.phone}
                </p>
                <button className="text-sm text-gray-900 dark:text-white underline-offset-4 hover:underline mt-2">
                  预约用餐 →
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">营业时间 Hours</h3>
              <div className="space-y-1">
                {Object.entries(selectedLocation.hours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{day}</span>
                    <span>{hours}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">特色服务 Features</h3>
              <div className="flex flex-wrap gap-2">
                {selectedLocation.features.map((feature) => (
                  <span key={feature} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="space-y-4">
          <h3 className="text-2xl font-light text-center mb-4">店铺位置</h3>
          <div className="w-full h-[450px] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(selectedLocation.address)}&zoom=16&maptype=roadmap`}
              allowFullScreen
            ></iframe>
          </div>
          <div className="flex justify-center gap-4">
            <a 
              href={`https://maps.apple.com/?q=${encodeURIComponent(selectedLocation.name)}&address=${encodeURIComponent(selectedLocation.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-2 bg-gray-900 text-white dark:bg-white dark:text-gray-900 rounded hover:opacity-90 transition-opacity"
            >
              在苹果地图中查看 →
            </a>
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedLocation.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-2 border border-gray-900 dark:border-white text-gray-900 dark:text-white rounded hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition-colors"
            >
              在 Google 地图中查看 →
            </a>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 max-w-2xl mx-auto">
          <h3 className="text-3xl font-light mb-4">欢迎光临 Visit Us Today</h3>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            每一家门店都融入了当地特色，为您带来独特的云贵川美食体验。
          </p>
          <div className="flex justify-center gap-4">
            <button className="px-8 py-3 bg-gray-900 text-white dark:bg-white dark:text-gray-900 rounded-lg hover:opacity-90 transition-opacity">
              预约用餐
            </button>
            <button className="px-8 py-3 border border-gray-900 dark:border-white text-gray-900 dark:text-white rounded-lg hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition-colors">
              预约活动
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}