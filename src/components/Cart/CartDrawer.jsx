import React, { useState } from 'react';
import axios from 'axios';
import { useApp } from '../../context/AppContext';

const CartDrawer = ({ isOpen, onClose }) => {
        const { setCurrentPage, setCurrentOrderId } = useApp();
        const { cart, removeFromCart, clearCart, addToast } = useApp();
        const [isOrdering, setIsOrdering] = useState(false);
        const [orderSuccess, setOrderSuccess] = useState(false);

        const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);

        const handlePlaceOrder = async () => {
          try {
            setIsOrdering(true);
            
            // Real API Call to your Python Backend
            const response = await axios.post('http://127.0.0.1:8000/api/orders/', {
              items: cart.map(item => ({
                name: item.name,
                price: item.price || 0
              })),
              total_price: total
            });

            if (response.status === 201) {
                const orderId = response.data.order_id;
                setCurrentOrderId(orderId);
                setOrderSuccess(true);
                addToast("Order Placed Successfully!");
                
                setTimeout(() => {
                clearCart();
                setOrderSuccess(false);
                onClose();
                // Navigate to tracking page
                setCurrentPage('track-order');
                }, 2000);
            }
          } catch (error) {
            console.error("Order error:", error);
            addToast("Failed to place order. Is your backend running?", "error");
          } finally {
            setIsOrdering(false);
          }
        };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-fade-in-right">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0">
          <h2 className="text-xl font-bold font-heading">Your Cart</h2>
          <button onClick={onClose} className="text-2xl hover:text-orange-500 transition-colors">✕</button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {orderSuccess ? (
            <div className="text-center py-20 animate-bounce">
              <div className="text-7xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-gray-900">Order Placed!</h3>
              <p className="text-gray-500 mt-2">Your food is being prepared. <br/> Get ready for some deliciousness!</p>
            </div>
          ) : cart.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <div className="text-6xl">🥘</div>
              <p className="text-gray-400 font-medium">Your cart is empty. <br />Go ahead and order some yummy food!</p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={item.id ?? idx} className="flex gap-4 items-center animate-fade-in">
                <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm">{item.name}</h4>
                  <p className="text-sm font-black mt-1 text-gray-900">₹{item.price}</p>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && !orderSuccess && (
          <div className="p-6 border-t border-gray-100 space-y-4 bg-gray-50/50">
            <div className="flex justify-between font-bold text-lg">
              <span className="text-gray-600">Total Bill</span>
              <span className="text-orange-600">₹{total}</span>
            </div>
            <button 
              disabled={isOrdering}
              onClick={handlePlaceOrder}
              className={`w-full ${isOrdering ? 'bg-orange-300' : 'bg-orange-500'} text-white py-4 rounded-xl font-bold text-lg shadow-lg active:scale-[0.98] transition-all`}
            >
              {isOrdering ? 'PLACING ORDER...' : 'PLACE ORDER'}
            </button>
            <p className="text-[10px] text-center text-gray-400">
              Orders once placed cannot be cancelled.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
