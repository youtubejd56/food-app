import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const categories = [
  'Biryani',
  'Pizza',
  'Burgers',
  'Chinese',
  'North Indian',
  'Sushi',
  'Wraps',
  'Desserts',
];

const filters = ['Sort by', 'Ratings 4.0+', 'Offers', 'Under Rs150', 'Pure Veg', 'Fast delivery'];

const RestaurantCard = ({ res, onAdd }) => {
  // Logic to show the DISH name as the main headline
  const getDishName = (category, resName) => {
    if (category?.toLowerCase().includes('biryani')) return 'Special Hyderabadi Biryani';
    if (category?.toLowerCase().includes('pizza')) return 'Signature Cheese Pizza';
    if (category?.toLowerCase().includes('burger')) return 'Grilled Chicken Burger';
    if (category?.toLowerCase().includes('chinese')) return 'Authentic Schezwan Noodles';
    if (category?.toLowerCase().includes('indian')) return 'Classic Paneer Butter Masala';
    return `${resName} Signature Dish`;
  };

  const dishName = getDishName(res.category, res.name);

  return (
    <div className="group bg-white cursor-pointer rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
      <div className="relative h-48 bg-orange-100 overflow-hidden">
        {res.image ? (
          <img
            src={res.image}
            alt={dishName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={(e) => {
              e.target.onerror = null; // Prevent infinite loops
              e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
            }}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-4xl text-orange-300">🥘</div>
        )}
        {res.offers && (
          <div className="absolute bottom-3 left-3 bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg">
            {res.offers}
          </div>
        )}
      </div>
      <div className="p-5 space-y-1.5">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <h3 className="font-black text-base text-gray-900 leading-tight truncate">{dishName}</h3>
            <p className="text-xs text-orange-500 font-bold opacity-80 truncate">{res.name}</p>
          </div>
          <span className="bg-green-700 text-white text-[10px] font-black px-1.5 py-0.5 rounded-lg flex items-center gap-1 shrink-0 ml-2">
            {res.rating}
            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-gray-500 font-bold tracking-tight pb-3">
          <p className="truncate mr-4 text-gray-400">{res.category || 'Restaurant'} • {res.time}</p>
          <p className="shrink-0 text-gray-900">{res.priceForTwo || '₹400 for two'}</p>
        </div>

        <div className="pt-2 flex items-center justify-end border-t border-gray-50">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdd({ ...res, dishName }); // Send the dish name to cart
            }}
            className="bg-orange-500 cursor-pointer text-white text-[11px] font-black px-4 py-2 rounded-xl hover:bg-orange-600 active:scale-95 transition-all shadow-md shadow-orange-100 uppercase tracking-wider"
          >
            Add Cart
          </button>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const { restaurants, loading, location, addToCart, fetchRealRestaurants } = useApp();
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeFilters, setActiveFilters] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRestaurants = restaurants.filter((res) => {
    // Search filter
    const stopWords = ['and', 'or', 'the', 'in', 'with', 'at'];
    const normalizeStr = (str) => str ? str.toLowerCase().replace(/[^a-z0-9 ]/g, '') : '';
    const normalizedQuery = normalizeStr(searchQuery);
    const queryTokens = normalizedQuery.split(/\s+/).filter(token => token.length > 0 && !stopWords.includes(token));

    const matchesSearch = searchQuery
      ? queryTokens.some(token =>
        normalizeStr(res.name).includes(token) ||
        normalizeStr(res.category).includes(token)
      ) || normalizeStr(res.name).includes(normalizedQuery)
      : true;

    // Category filter
    const matchesCategory = activeCategory
      ? res.category.toLowerCase() === activeCategory.toLowerCase() ||
      res.name.toLowerCase().includes(activeCategory.toLowerCase())
      : true;

    // Filter buttons logic
    const matchesFilters = activeFilters.every((filter) => {
      if (filter === 'Ratings 4.0+') return parseFloat(res.rating) >= 4.0;
      if (filter === 'Under Rs150') return (res.price || 400) <= 150; // Mock price check
      if (filter === 'Pure Veg') return res.category.toLowerCase().includes('veg');
      if (filter === 'Fast delivery') return parseInt(res.time) <= 30;
      return true;
    });

    return matchesSearch && matchesCategory && matchesFilters;
  });

  const toggleFilter = (filterName) => {
    setActiveFilters((prev) =>
      prev.includes(filterName) ? prev.filter((f) => f !== filterName) : [...prev, filterName]
    );
  };

  const handleAddToCart = (restaurant) => {
    addToCart({
      id: Date.now() + Math.floor(Math.random() * 1000),
      name: `${restaurant.name} Special`,
      price: 299 + Math.floor(Math.random() * 200),
      image: restaurant.image,
      restaurant: restaurant.name,
    });
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-orange-500 font-medium text-lg animate-pulse">Loading GoodDash...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-lg w-full">
            <span className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
              30 min delivery guaranteed
            </span>
            <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 leading-tight tracking-tight mb-3">
              Craving something <span className="text-orange-500 italic">delicious</span> today?
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Order from 500+ restaurants near you. Fresh, fast, and delivered right to your door.
            </p>

            <div className="flex overflow-hidden bg-white border border-gray-200 rounded-xl max-w-md shadow-sm">
              <input
                type="text"
                placeholder="Search Pala, Kottayam, Pizza, etc..."
                className="flex-1 px-4 py-3 text-sm text-gray-800 outline-none placeholder-gray-400"
                value={searchQuery}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    // Trigger global fetch from SerpApi
                    fetchRealRestaurants(searchQuery);
                  }
                }}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeCategory) setActiveCategory(null);
                }}
              />
              <button
                onClick={() => {
                  setActiveCategory(null);
                  fetchRealRestaurants(searchQuery);
                }}
                className="bg-orange-500 text-white px-5 text-sm font-medium hover:bg-orange-600 transition-colors"
              >
                Search
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-6 mt-6">
              {[
                { val: '500+', label: 'Restaurants' },
                { val: '30 min', label: 'Avg. delivery' },
                { val: '4.8', label: 'Avg. rating' },
              ].map((s, i, arr) => (
                <React.Fragment key={s.label}>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{s.val}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                  </div>
                  {i < arr.length - 1 && <div className="w-px h-8 bg-gray-200" />}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="w-72 max-w-full bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xl shadow-orange-100/50 transform hover:-translate-y-1 transition-all">
            <div className="relative h-44">
              <img
                src="https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80"
                alt="Featured Biryani"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-orange-600 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                FEATURED
              </div>
            </div>
            <div className="p-4">
              <p className="font-semibold text-sm text-gray-900 mb-1">Kerala Biryani Special</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="bg-green-700 text-white px-1.5 py-0.5 rounded text-[10px] font-semibold">4.9</span>
                <span>25 min</span>
                <span>|</span>
                <span>Rs299</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Zomato-Style Sticky Filter Bar */}
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 py-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-3 overflow-x-auto no-scrollbar items-center">
            <button
              onClick={() => {
                setActiveFilters([]);
                setActiveCategory(null);
                setSearchQuery('');
              }}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all whitespace-nowrap"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              <span>Clear</span>
            </button>

            {[
              'Rating 4.0+',
              'Fast Delivery',
              'Pure Veg',
              'Less than Rs.500'
            ].map(filter => (
              <button
                key={filter}
                onClick={() => toggleFilter(filter)}
                className={`px-4 py-2 border rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeFilters.includes(filter)
                  ? 'border-orange-500 bg-orange-50 text-orange-600 shadow-sm'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
              >
                {filter}
                {activeFilters.includes(filter) && <span className="ml-1.5 font-black">×</span>}
              </button>
            ))}
          </div>
        </div>

        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900">What's on your mind?</h2>
          </div>
          <div className="flex gap-5 overflow-x-auto  no-scrollbar pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory((prev) => (prev === cat ? null : cat))}
                className="flex-shrink-0 flex flex-col items-center gap-2 group"
              >
                <div className={`w-20 h-20 rounded-full flex items-center justify-center p-3 transition-all duration-200 ${activeCategory === cat ? 'bg-orange-100 ring-2 ring-orange-500' : 'bg-gray-50 group-hover:bg-gray-100'
                  }`}>
                  <span className="text-3xl cursor-pointer">
                    {cat === 'Biryani' ? '🍛' : cat === 'Pizza' ? '🍕' : cat === 'Burgers' ? '🍔' : cat === 'Chinese' ? '🍜' : cat === 'North Indian' ? '🥘' : '🍲'}
                  </span>
                </div>
                <span className={`text-sm font-medium ${activeCategory === cat ? 'text-orange-600' : 'text-gray-700'}`}>{cat}</span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Restaurants with online food delivery in {location}
            </h2>
            <span className="text-xs text-gray-400">{restaurants.length} places</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredRestaurants.length > 0 ? (
              filteredRestaurants.map((res) => (
                <RestaurantCard key={`all-${res.id}`} res={res} onAdd={handleAddToCart} />
              ))
            ) : (
              <div className="col-span-full text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No results matching your criteria</h3>
                <p className="text-gray-500 mb-6 max-w-xs mx-auto text-sm">We couldn't find any restaurants. Try searching for something else or clearing your filters.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory(null);
                    setActiveFilters([]);
                  }}
                  className="px-6 py-2 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors"
                >
                  Reset all filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* --- Multi-Column Testimonials Section --- */}
        <section className="py-16 border-t border-gray-100">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">What our customers say</h2>
            <p className="text-gray-500">Join thousands of happy foodies in Kerala</p>
          </div>
          <div className="grid grid-cols-1 cursor-pointer md:grid-cols-3 gap-8">
            {[
              {
                name: 'Ajay Kumar',
                review: 'The fastest delivery I have ever experienced in Kochi. The biryani arrived steaming hot!',
                role: 'Food Blogger',
                rating: 5
              },
              {
                name: 'Sona Rose',
                review: 'Amazing variety of restaurants. I can find everything from local Malabar food to premium Sushi.',
                role: 'Verified Customer',
                rating: 5
              },
              {
                name: 'Vinayak NV',
                review: 'Very professional app. The real-time tracking and easy checkout make ordering a breeze.',
                role: 'Software Engineer',
                rating: 4
              }
            ].map((t) => (
              <div key={t.name} className="bg-gray-50 p-8 rounded-3xl border border-gray-100 hover:shadow-lg transition-all">
                <div className="flex text-orange-400 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>
                <p className="text-gray-700 italic mb-6">"{t.review}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{t.name}</h4>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
