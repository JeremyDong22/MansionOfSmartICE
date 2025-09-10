// Ingredients Page - Mansion of SmartICE
// Showcases ingredient stories, sourcing, and photography

'use client';

import { useState } from 'react';

const ingredients = [
  {
    id: 1,
    name: 'Hokkaido Scallops',
    origin: 'Hokkaido, Japan',
    season: 'Winter',
    story: 'Hand-dived from the pristine waters of Hokkaido, these scallops are selected by our partner fishermen who have been perfecting their craft for three generations.',
    image: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?q=80&w=1280',
    supplier: 'Yamamoto Fisheries',
    certification: 'MSC Certified Sustainable'
  },
  {
    id: 2,
    name: 'Black Winter Truffle',
    origin: 'Périgord, France',
    season: 'December - March',
    story: 'Our truffles are foraged in the ancient oak forests of Périgord by third-generation truffle hunters and their specially trained dogs.',
    image: 'https://images.unsplash.com/photo-1601001815894-4bb6c81416d7?q=80&w=1280',
    supplier: 'Maison Dubois',
    certification: 'Origin Protected'
  },
  {
    id: 3,
    name: 'Wagyu Beef',
    origin: 'Miyazaki, Japan',
    season: 'Year-round',
    story: 'From cattle raised on a diet of rice straw and mineral water, our A5 wagyu represents the pinnacle of marbling and flavor.',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1280',
    supplier: 'Miyazaki Premium Beef Co.',
    certification: 'A5 Grade Certified'
  },
  {
    id: 4,
    name: 'Heirloom Tomatoes',
    origin: 'Local Farms, California',
    season: 'June - October',
    story: 'Grown within 50 miles of our restaurant, these heirloom varieties are cultivated using regenerative farming practices.',
    image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?q=80&w=1280',
    supplier: 'Sunrise Organic Farm',
    certification: 'USDA Organic'
  },
  {
    id: 5,
    name: 'Wild Mushrooms',
    origin: 'Pacific Northwest',
    season: 'Fall',
    story: 'Foraged from the misty forests of Oregon and Washington, our selection includes chanterelles, morels, and porcini.',
    image: 'https://images.unsplash.com/photo-1504545102780-26774c1bb073?q=80&w=1280',
    supplier: 'Forest & Field Co.',
    certification: 'Wild Harvested'
  },
  {
    id: 6,
    name: 'Saffron',
    origin: 'Kashmir, India',
    season: 'October Harvest',
    story: 'The world\'s finest saffron, hand-picked at dawn from the high-altitude fields of Kashmir, where each flower yields only three precious stigmas.',
    image: 'https://images.unsplash.com/photo-1598106820066-440c309b3c52?q=80&w=1280',
    supplier: 'Kashmir Gold Collective',
    certification: 'Fair Trade Certified'
  }
];

export default function IngredientsPage() {
  const [selectedIngredient, setSelectedIngredient] = useState(ingredients[0]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <div className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40 z-10" />
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=1920"
            alt="Ingredients"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-20 text-center text-white max-w-3xl px-6">
          <h1 className="text-5xl md:text-7xl font-light mb-4">Our Ingredients</h1>
          <p className="text-xl font-light opacity-90">
            Every ingredient tells a story of place, tradition, and the passionate people who bring it to your table
          </p>
        </div>
      </div>

      {/* Featured Ingredient */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <img
              src={selectedIngredient.image}
              alt={selectedIngredient.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/90 backdrop-blur px-4 py-2 rounded">
              <p className="text-sm font-medium">{selectedIngredient.season}</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-4xl font-light mb-2">{selectedIngredient.name}</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">{selectedIngredient.origin}</p>
            </div>
            
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              {selectedIngredient.story}
            </p>
            
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-200 dark:border-gray-800">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Supplier</p>
                <p className="font-medium">{selectedIngredient.supplier}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Certification</p>
                <p className="font-medium">{selectedIngredient.certification}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ingredient Grid */}
        <div className="mt-20">
          <h3 className="text-2xl font-light mb-8 text-center">Explore Our Selection</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {ingredients.map((ingredient) => (
              <button
                key={ingredient.id}
                onClick={() => setSelectedIngredient(ingredient)}
                className={`relative aspect-square overflow-hidden rounded-lg transition-all ${
                  selectedIngredient.id === ingredient.id
                    ? 'ring-2 ring-gray-900 dark:ring-white scale-95'
                    : 'hover:scale-105'
                }`}
              >
                <img
                  src={ingredient.image}
                  alt={ingredient.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-2 left-2 right-2 text-white">
                  <p className="text-sm font-medium">{ingredient.name}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Philosophy Section */}
        <div className="mt-20 text-center max-w-3xl mx-auto">
          <h3 className="text-3xl font-light mb-6">Our Sourcing Philosophy</h3>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            We believe in building lasting relationships with producers who share our commitment to quality, 
            sustainability, and ethical practices. Every ingredient is carefully selected not just for its 
            exceptional flavor, but for the story it tells and the people behind it.
          </p>
        </div>
      </div>
    </div>
  );
}