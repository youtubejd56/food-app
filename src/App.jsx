import React from 'react';
import AppContext, { AppProvider } from './context/AppContext';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import Help from './components/Help';
import Navbar from './components/Navbar/Navbar';
import CartDrawer from './components/Cart/CartDrawer';
import Footer from './components/Navbar/footer';
import TrackOrder from './components/TrackOrder';


const AppContent = () => {
  const { cart, isCartOpen, setIsCartOpen, currentPage, toasts, currentOrderId } = React.useContext(AppContext);

  return (
    <div className="App w-full overflow-x-hidden min-h-screen bg-white">
      <Navbar />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* --- Floating "View Cart" Bar (Zomato Style) --- */}
      {cart.length > 0 && currentPage === 'home' && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-md animate-slide-up">
          <div className="bg-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center font-bold">
                {cart.length}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold leading-none">{cart.length} {cart.length === 1 ? 'item' : 'items'} added</span>
                <span className="text-[10px] text-green-100 font-medium opacity-80 uppercase tracking-wider">From top restaurants</span>
              </div>
            </div>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-1.5 bg-white text-green-700 px-4 py-2 rounded-xl text-sm font-bold shadow-lg active:scale-95 transition-all"
            >
              View Cart
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-md animate-slide-up ${toast.type === 'error'
              ? 'bg-red-500/90 text-white border-red-400'
              : 'bg-gray-900/90 text-white border-gray-700'
              }`}
          >
            <span className="text-lg">{toast.type === 'error' ? '❌' : '✅'}</span>
            <span className="text-sm font-bold">{toast.message}</span>
          </div>
        ))}
      </div>

      <main className="min-h-[80vh]">
        {currentPage === 'home' && <Home />}
        {currentPage === 'login' && <Login />}
        {currentPage === 'register' && <Register />}
        {currentPage === 'profile' && <Profile />}
        {currentPage === 'help' && <Help />}
        {currentPage === 'track-order' && <TrackOrder orderId={currentOrderId} />}
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
