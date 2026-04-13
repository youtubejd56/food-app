import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [location, setLocation] = useState(localStorage.getItem('userLocation') || 'Select Location');
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('foodCart')) || []);
  const [restaurants, setRestaurants] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  useEffect(() => {
    localStorage.setItem('foodCart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('userLocation', location);
  }, [location]);

  const mockRestaurants = [
    {
      id: 7,
      name: 'Paragon Restaurant',
      rating: 4.8,
      time: '30-40 min',
      priceRange: '$$',
      priceForTwo: '₹600 for two',
      category: 'South Indian',
      image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
      featured: true,
    },
    {
      id: 8,
      name: 'Dhe Puttu',
      rating: 4.6,
      time: '25-35 min',
      priceRange: '$$',
      priceForTwo: '₹400 for two',
      category: 'Kerala Special',
      image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80',
      featured: false,
    },
    {
      id: 9,
      name: 'Rahmath Hotel Kozhikode',
      rating: 4.9,
      time: '40-50 min',
      priceRange: '$$',
      priceForTwo: '₹500 for two',
      category: 'Malabar Biryani',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
      featured: true,
    },
    {
      id: 10,
      name: 'Villa Maya Trivandrum',
      rating: 4.7,
      time: '45-60 min',
      priceRange: '$$$',
      priceForTwo: '₹2000 for two',
      category: 'Heritage Fine Dine',
      image: 'https://images.unsplash.com/photo-1596797038530-2c39fa81b487?auto=format&fit=crop&w=800&q=80',
      featured: true,
    },
    {
      id: 11,
      name: "Adam's Petti Kozhikode",
      rating: 4.5,
      time: '30-45 min',
      priceRange: '$$',
      priceForTwo: '₹800 for two',
      category: 'Malabar Fusion',
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
      featured: false,
    },
    {
      id: 12,
      name: 'Grand Pavilion Kochi',
      rating: 4.4,
      time: '20-35 min',
      priceRange: '$$',
      priceForTwo: '₹700 for two',
      category: 'Kerala Continental',
      image: 'https://images.unsplash.com/photo-1606471191009-63994c53433b?auto=format&fit=crop&w=800&q=80',
      featured: false,
    },
    {
      id: 13,
      name: 'Salkara Kozhikode',
      rating: 4.6,
      time: '25-40 min',
      priceRange: '$$',
      priceForTwo: '₹550 for two',
      category: 'Traditional Malabar',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
      featured: false,
    },
    {
      id: 14,
      name: 'Pathayam Trivandrum',
      rating: 4.3,
      time: '30-40 min',
      priceRange: '$',
      priceForTwo: '₹300 for two',
      category: 'Healthy Kerala',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      featured: false,
    },
    {
      id: 2,
      name: 'Pizza Napoletana',
      rating: 4.9,
      time: '25-35 min',
      priceRange: '$$',
      priceForTwo: '₹600 for two',
      category: 'Pizza',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
      featured: true,
    },
    {
      id: 3,
      name: 'Sushi Zen',
      rating: 4.7,
      time: '30-45 min',
      priceRange: '$$$',
      priceForTwo: '₹1200 for two',
      category: 'Sushi',
      image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
      featured: false,
    },
    {
      id: 1,
      name: 'Gourmet Burger Kitchen',
      rating: 4.8,
      time: '20-30 min',
      priceRange: '$$',
      priceForTwo: '₹500 for two',
      category: 'Burgers',
      image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=800&q=80',
      featured: true,
    },
    {
      id: 4,
      name: 'Hyderabadi Dum Biryani',
      rating: 4.8,
      time: '35-45 min',
      priceRange: '$$',
      priceForTwo: '₹450 for two',
      category: 'Biryani',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
      featured: true,
    },
    {
      id: 5,
      name: 'Classic Cheeseburger',
      rating: 4.5,
      time: '15-25 min',
      priceRange: '$',
      priceForTwo: '₹350 for two',
      category: 'Burgers',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
      featured: false,
    },
    {
      id: 6,
      name: 'Spicy Noodles',
      rating: 4.3,
      time: '20-30 min',
      priceRange: '$$',
      priceForTwo: '₹400 for two',
      category: 'Chinese',
      image: 'https://images.unsplash.com/photo-1612929633738-8fe01f72810c?auto=format&fit=crop&w=800&q=80',
      featured: false,
    }
  ];

  const fetchRealRestaurants = async (query) => {
    if (!query || query.length < 2) return;
    try {
      setLoading(true);
      setLocation(query);
      
        // Helper to get REAL food images from TheMealDB & Unsplash
        const getHDImage = (cat) => {
          const c = cat?.toLowerCase() || '';
          // Using Real Dish Images from TheMealDB library
          if (c.includes('biryani') || c.includes('indian')) return 'https://www.themealdb.com/images/media/meals/1529444113.jpg'; // Chicken Enchilada-style look for Biryani
          if (c.includes('pizza') || c.includes('italian')) return 'https://www.themealdb.com/images/media/meals/x0v4021587671587.jpg'; // Pizza
          if (c.includes('burger')) return 'https://www.themealdb.com/images/media/meals/vru7m31511720443.jpg'; // Burger
          if (c.includes('chinese') || c.includes('noodle')) return 'https://www.themealdb.com/images/media/meals/1529446352.jpg'; // Chow Mein
          if (c.includes('dessert') || c.includes('sweet')) return 'https://www.themealdb.com/images/media/meals/txpwsf1545639149.jpg'; // Chocolate Cake
          if (c.includes('pasta')) return 'https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg'; // Pasta
          if (c.includes('seafood')) return 'https://www.themealdb.com/images/media/meals/1529442749.jpg'; // Seafood
          return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
        };

        // 1. Try fetching from your NEW PYTHON BACKEND
        let finalRestaurants = [];
        try {
          const backendResponse = await axios.get('http://127.0.0.1:8000/api/restaurants/');
          if (backendResponse.data && backendResponse.data.length > 0) {
            finalRestaurants = backendResponse.data.map(res => ({
              id: res.id,
              name: res.name,
              rating: res.rating,
              time: res.delivery_time,
              priceForTwo: res.price_for_two,
              category: res.category,
              featured: res.is_featured,
              image: res.image_url || getHDImage(res.category),
              offers: res.offers
            }));
          }
        } catch (err) {
          console.log("Python Backend not synced yet, using SerpApi fallback.");
        }

        // 2. Fallback to SerpApi & MealDB
        if (finalRestaurants.length === 0) {
          // A. Fetch from TheMealDB for "Food Only" results
          try {
            const mealResponse = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
            if (mealResponse.data.meals) {
              const meals = mealResponse.data.meals.slice(0, 8).map((meal, idx) => ({
                id: meal.idMeal,
                name: meal.strMeal,
                dishName: meal.strMeal,
                rating: (4.2 + (idx * 0.1)).toFixed(1),
                time: `${15 + (idx * 5)} min`,
                category: meal.strCategory || 'Signature Dish',
                image: meal.strMealThumb,
                priceForTwo: `₹${199 + (idx * 50)} for two`,
                featured: idx === 0,
                offers: 'Free Delivery',
                restaurant: 'Chef Special'
              }));
              finalRestaurants = [...meals];
            }
          } catch (e) { console.log("MealDB Fetch failed"); }

          // B. Fetch from SerpApi for Restaurant data
          const apiKey = import.meta.env.VITE_SERP_API_KEY;
          const targetUrl = `https://serpapi.com/search.json?engine=google_maps&q=restaurants+in+${encodeURIComponent(query)}&type=search&api_key=${apiKey}`;
          try {
            const response = await axios.get(`https://corsproxy.io/?${encodeURIComponent(targetUrl)}`);
            const data = response.data;
            const results = data.place_results || data.local_results || [];
            
            const restaurants = results.map((res, index) => ({
              id: res.place_id || `res-${index}`,
              name: res.title,
              rating: res.rating || (4 + Math.random()).toFixed(1),
              time: `${20 + Math.floor(Math.random() * 20)} min`,
              priceRange: res.price_level || '$$',
              priceForTwo: res.price_level ? `₹${res.price_level * 300} for two` : '₹500 for two',
              category: res.type || 'Restaurant',
              image: res.thumbnail || getHDImage(res.type),
              featured: index < 3,
              offers: index % 4 === 0 ? '50% OFF up to ₹100' : null,
              cuisines: [res.type || 'Indian', 'Global']
            }));
            finalRestaurants = [...finalRestaurants, ...restaurants];
          } catch (e) { console.log("SerpApi Fetch failed"); }
        }

      setRestaurants(finalRestaurants.length ? finalRestaurants : mockRestaurants);
    } catch (error) {
      console.error("Fetch Error:", error);
      setRestaurants(mockRestaurants);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location && location !== 'Select Location') {
      fetchRealRestaurants(location);
    } else {
      setRestaurants(mockRestaurants);
      setLoading(false);
    }
  }, [location]);

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
    addToast(`${product.name} added to cart!`);
  };

  const removeFromCart = (productId) => {
    setCart((prev) => {
      const itemToRemove = prev.find(item => item.id === productId);
      if (itemToRemove) {
        addToast(`Removed ${itemToRemove.name} from cart`, 'error');
      }
      return prev.filter(item => item.id !== productId);
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('foodCart');
  };

  return (
    <AppContext.Provider value={{
      location, setLocation,
      cart, addToCart, removeFromCart, clearCart,
      isCartOpen, setIsCartOpen,
      currentPage, setCurrentPage,
      restaurants, loading,
      toasts, addToast,
      fetchRealRestaurants,
      currentOrderId, setCurrentOrderId,
      token, setToken
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
export default AppContext;
