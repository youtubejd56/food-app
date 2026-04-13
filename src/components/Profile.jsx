import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';

const Profile = () => {
  const { token, addToast } = useApp();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/profile/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(res.data);
      } catch (err) {
        addToast('Session expired. Please login again.', 'error');
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchProfile();
  }, [token]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await axios.patch('http://127.0.0.1:8000/api/profile/', profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      addToast('Profile updated successfully!');
    } catch (err) {
      addToast('Update failed.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-orange-500 px-8 py-10 text-white">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold">
              {profile?.user.username[0].toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{profile?.user.first_name || profile?.user.username}</h2>
              <p className="text-orange-100">{profile?.user.email}</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Delivery Address</h3>
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-orange-500 focus:border-orange-500 transition-all outline-none"
                  value={profile?.phone || ''}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-orange-500 focus:border-orange-500 transition-all outline-none"
                  value={profile?.city || ''}
                  onChange={(e) => setProfile({...profile, city: e.target.value})}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Address</label>
                <textarea
                  rows="3"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-orange-500 focus:border-orange-500 transition-all outline-none"
                  value={profile?.address || ''}
                  onChange={(e) => setProfile({...profile, address: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Zip Code</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-orange-500 focus:border-orange-500 transition-all outline-none"
                  value={profile?.zip_code || ''}
                  onChange={(e) => setProfile({...profile, zip_code: e.target.value})}
                />
              </div>
            </div>
            
            <button
              disabled={updating}
              type="submit"
              className="px-8 py-3 bg-orange-500 text-white font-bold rounded-xl shadow-lg hover:bg-orange-600 active:scale-95 transition-all"
            >
              {updating ? 'SAVING...' : 'SAVE ADDRESS'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
