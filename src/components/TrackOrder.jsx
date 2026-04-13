import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';

const TrackOrder = ({ orderId }) => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
  const { setCurrentPage, addToast, location } = useApp();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapType, setMapType] = useState('visual'); // 'visual' or 'google'

  const statuses = [
    { label: 'Order Placed', icon: '📝', color: 'bg-blue-500' },
    { label: 'Preparing', icon: '👩‍🍳', color: 'bg-yellow-500' },
    { label: 'Out for Delivery', icon: '🛵', color: 'bg-orange-500' },
    { label: 'Delivered', icon: '🏠', color: 'bg-green-500' },
  ];

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/orders/${orderId}/`);
        setOrder(response.data);
      } catch (error) {
        console.error("Fetch order error:", error);
        addToast("Error loading order details.", "error");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
      const interval = setInterval(fetchOrder, 10000);
      return () => clearInterval(interval);
    }
  }, [orderId, addToast]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-bold text-gray-800">Locating your order...</h2>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="text-6xl mb-4">📂</div>
        <h2 className="text-2xl font-bold text-gray-800">Order Not Found</h2>
        <p className="text-gray-500 mt-2 max-w-md mx-auto">We couldn't find the order you're looking for.</p>
        <button onClick={() => setCurrentPage('home')} className="mt-6 bg-orange-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg">GO BACK HOME</button>
      </div>
    );
  }

  const currentStatusIndex = statuses.findIndex(s => s.label === order.status) !== -1 ? statuses.findIndex(s => s.label === order.status) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
        
        {/* Left Side: Order Info */}
        <div className="flex-1 p-8 md:p-12">
          <div className="flex justify-between items-start mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-full">Order Details</span>
              <h1 className="text-3xl font-black text-gray-900 mt-3">Order #{order.id}</h1>
              <p className="text-gray-500 mt-1 font-medium">{new Date(order.created_at).toLocaleString()}</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-gray-900 leading-none">₹{order.total_price}</span>
              <p className="text-xs text-gray-400 mt-1 uppercase tracking-tighter font-bold">Total Paid</p>
            </div>
          </div>

          <div className="space-y-10 relative">
            <div className="absolute left-[1.35rem] top-3 bottom-3 w-1 bg-gray-100 rounded-full"></div>
            {statuses.map((status, index) => (
              <div key={index} className={`flex items-start gap-6 relative z-10 ${index > currentStatusIndex ? 'opacity-40' : 'opacity-100 transition-all transform duration-700'}`}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-xl transition-all ${index <= currentStatusIndex ? `${status.color} text-white ring-4 ring-white` : 'bg-gray-200 text-gray-400'}`}>
                  {status.icon}
                </div>
                <div className="flex-1 pt-2">
                  <h3 className={`font-bold text-lg ${index <= currentStatusIndex ? 'text-gray-900' : 'text-gray-400'}`}>{status.label}</h3>
                  {index === currentStatusIndex && <p className="text-sm text-gray-500 font-medium animate-pulse mt-0.5">Updated just now</p>}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-dashed border-gray-200">
             <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg"><span>🛍️</span> Order Summary</h4>
             <div className="space-y-4">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between text-base font-medium">
                  <span className="text-gray-600">{item.restaurant_name}</span>
                  <span className="text-gray-900 font-bold">₹{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Map Section */}
        <div className="flex-1 bg-gray-50 p-8 md:p-12 flex flex-col">
          <div className="bg-white p-6 rounded-3xl shadow-lg mb-8 relative">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-3xl">🛵</div>
              <div>
                <h4 className="font-black text-gray-900 text-lg">Sunil Kumar</h4>
                <p className="text-sm text-gray-500 font-bold">Your Delivery Partner</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Map View</h3>
            <div className="bg-gray-200 p-1 rounded-xl flex gap-1">
              <button onClick={() => setMapType('visual')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${mapType === 'visual' ? 'bg-white shadow text-orange-600' : 'text-gray-500'}`}>LIVE</button>
              <button onClick={() => setMapType('google')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${mapType === 'google' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>GOOGLE</button>
            </div>
          </div>

          <div className="aspect-square w-full rounded-[2.5rem] relative overflow-hidden shadow-2xl border-4 border-white">
            {mapType === 'visual' ? (
              <div className="w-full h-full bg-slate-100 relative">
                <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/76.2673,9.9312,13,0/600x600?access_token=pk.eyJ1Ijoiam9obmRvZSIsImEiOiJjbGZ3eXh6eWMwMHN6M3BvM252NGRyNmR5In0.abc')] bg-cover opacity-60"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                  <div className="w-20 h-20 bg-orange-500/20 rounded-full animate-ping"></div>
                  <div className="absolute inset-0 m-auto w-12 h-12 bg-orange-600 border-4 border-white rounded-2xl shadow-2xl flex items-center justify-center text-2xl">🛵</div>
                </div>
                <div className="absolute bottom-1/4 right-1/4 w-8 h-8 bg-blue-600 border-4 border-white rounded-full shadow-2xl flex items-center justify-center text-white z-10">🏠</div>
              </div>
            ) : (
              <div className="w-full h-full"> 
                <iframe
                  title="Google Map"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(location || 'Kochi, Kerala')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                  className="w-full h-full block"
                ></iframe>
              </div>
            )}
          </div>

          <div className="mt-8">
            <button onClick={() => setCurrentPage('home')} className="w-full bg-orange-500 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg hover:bg-orange-600 active:scale-95 transition-all">ORDER MORE</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
