import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icon in leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function LocationMarker({ position, setPosition }) {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
    locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, 14);
    },
  });

  useEffect(() => {
    if (!position) {
      map.locate({ setView: true, maxZoom: 14 });
    }
  }, [map, position]);

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

function MapUpdater({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 14);
    }
  }, [position, map]);
  return null;
}

export default function CitizenDashboard({ user }) {
  const [issues, setIssues] = useState([]);
  const [allIssues, setAllIssues] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [addressInput, setAddressInput] = useState('');
  const [position, setPosition] = useState(null); // {lat, lng}
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [formError, setFormError] = useState('');

  const [activeTab, setActiveTab] = useState('community'); // 'community', 'mine', 'report'

  useEffect(() => {
    fetchIssues();
    const interval = setInterval(fetchIssues, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const fetchIssues = async () => {
    try {
      const resAll = await axios.get(`http://localhost:8080/api/issues`);
      setAllIssues(resAll.data);
      
      const resMine = await axios.get(`http://localhost:8080/api/issues/reporter/${user.id}`);
      setIssues(resMine.data);
    } catch (error) {
      console.error("Error fetching issues", error);
    }
  };

  const searchAddress = async () => {
    if (!addressInput) return;
    setGeocoding(true);
    setFormError('');
    try {
      const res = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressInput)}`);
      if (res.data && res.data.length > 0) {
        const { lat, lon } = res.data[0];
        setPosition({ lat: parseFloat(lat), lng: parseFloat(lon) });
      } else {
        setFormError('Address not found. Please try again or click directly on the map.');
      }
    } catch (error) {
      console.error("Geocoding error", error);
      setFormError('Failed to search address. Please try clicking on the map instead.');
    } finally {
      setGeocoding(false);
    }
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim() || !description.trim()) {
      setFormError("Please provide a title and description.");
      return;
    }

    if (!position) {
      setFormError("Please select a location on the map or search for an address.");
      return;
    }
    
    setLoading(true);
    try {
      let photoPath = null;
      if (photoFile) {
        const formData = new FormData();
        formData.append("file", photoFile);
        const uploadRes = await axios.post('http://localhost:8080/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        photoPath = uploadRes.data; // e.g. /uploads/uuid.jpg
      }

      // Use addressInput as the human readable location if available, else coordinates
      const locationString = addressInput || `${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`;
      
      await axios.post('http://localhost:8080/api/issues', {
        title,
        description,
        location: locationString,
        photoPath: photoPath,
        reporter: { id: user.id },
        reporterName: user.name
      });
      setTitle('');
      setDescription('');
      setAddressInput('');
      setPosition(null);
      setPhotoFile(null);
      fetchIssues();
      setActiveTab('mine'); // switch to my issues after submitting
    } catch (error) {
      console.error("Error submitting issue", error);
      setFormError("Failed to submit issue. Please make sure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 relative z-10">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-rose-500 via-fuchsia-600 to-cyan-500 rounded-3xl p-8 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between overflow-hidden relative">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-40 h-40 bg-white opacity-20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-cyan-200 opacity-20 rounded-full blur-2xl animate-blob"></div>
        
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold mb-2 drop-shadow-sm">Welcome back, {user.name}! 👋</h1>
          <p className="text-white/90 text-lg font-medium">Thank you for helping us keep our community safe and beautiful.</p>
        </div>
        <div className="relative z-10 mt-6 md:mt-0 flex gap-4 text-center">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 min-w-[120px] shadow-inner border border-white/30 hover:bg-white/30 transition-colors">
            <p className="text-4xl font-bold">{issues.length}</p>
            <p className="text-white text-sm font-semibold mt-1">Issues Reported</p>
          </div>
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 min-w-[120px] shadow-inner border border-white/30 hover:bg-white/30 transition-colors">
            <p className="text-4xl font-bold">{issues.filter(i => i.status === 'RESOLVED' || i.status === 'VERIFIED').length}</p>
            <p className="text-white text-sm font-semibold mt-1">Issues Resolved</p>
          </div>
        </div>
      </div>

      <div className="flex space-x-2 border-b border-slate-200/60 pb-1 mt-8">
        <button 
          className={`px-6 py-3.5 font-bold rounded-t-2xl flex items-center gap-2 transition-all duration-300 ${activeTab === 'community' ? 'bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white shadow-lg shadow-fuchsia-500/30' : 'bg-white/50 text-slate-600 hover:bg-white hover:text-fuchsia-600'}`}
          onClick={() => setActiveTab('community')}
        >
          Community Feed
        </button>
        <button 
          className={`px-6 py-3.5 font-bold rounded-t-2xl flex items-center gap-2 transition-all duration-300 ${activeTab === 'mine' ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-cyan-500/30' : 'bg-white/50 text-slate-600 hover:bg-white hover:text-cyan-600'}`}
          onClick={() => setActiveTab('mine')}
        >
          My Reported Issues
        </button>
        <button 
          className={`px-6 py-3.5 font-bold rounded-t-2xl flex items-center gap-2 transition-all duration-300 ${activeTab === 'report' ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-white/50 text-slate-600 hover:bg-white hover:text-emerald-600'}`}
          onClick={() => setActiveTab('report')}
        >
          + Report New Issue
        </button>
      </div>

      {activeTab === 'community' && (
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/40">
          <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-3">
            <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg">🌍</span> 
            Community Issues
          </h2>
          {allIssues.length === 0 ? (
            <div className="text-center py-12 bg-slate-50/50 rounded-xl border border-dashed border-slate-300">
              <p className="text-slate-500 font-medium text-lg">No issues reported in the community yet.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {allIssues.map(issue => (
                <div key={issue.id} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-6 justify-between items-start group">
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-slate-900 group-hover:text-indigo-600 transition-colors">{issue.title}</h3>
                    <p className="text-slate-600 text-base mt-2 leading-relaxed">{issue.description}</p>
                    <div className="flex flex-wrap items-center gap-4 mt-4">
                      <span className="inline-flex items-center gap-1.5 text-sm font-bold text-cyan-700 bg-cyan-100 px-3 py-1 rounded-full border border-cyan-200">
                        📍 {issue.location}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-sm font-bold text-fuchsia-700 bg-fuchsia-100 px-3 py-1 rounded-full border border-fuchsia-200">
                        👤 {issue.reporterName || 'Unknown'}
                      </span>
                    </div>
                  </div>
                  {issue.photoPath && (
                    <div className="w-32 h-32 flex-shrink-0">
                      <img src={`http://localhost:8080${issue.photoPath}`} alt="Issue" className="w-full h-full object-cover rounded-xl shadow-sm border border-slate-200" />
                    </div>
                  )}
                  <div className="text-right sm:ml-2 flex flex-col items-end gap-2">
                    <span className={`px-4 py-2 text-sm font-bold rounded-xl shadow-sm border-2
                      ${issue.status === 'REPORTED' ? 'bg-amber-100 text-amber-800 border-amber-300' : 
                        issue.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-cyan-100 text-cyan-800 border-cyan-300'}`}>
                      {issue.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'mine' && (
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/40">
          <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-3">
            <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg">📋</span> 
            My Reported Issues
          </h2>
          {issues.length === 0 ? (
            <div className="text-center py-12 bg-slate-50/50 rounded-xl border border-dashed border-slate-300">
              <p className="text-slate-500 font-medium text-lg">You haven't reported any issues yet.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {issues.map(issue => (
                <div key={issue.id} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-6 justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-slate-900">{issue.title}</h3>
                    <p className="text-slate-600 text-base mt-2 leading-relaxed">{issue.description}</p>
                    <div className="flex flex-wrap items-center gap-4 mt-4">
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                        📍 {issue.location}
                      </span>
                    </div>
                  </div>
                  {issue.photoPath && (
                    <div className="w-32 h-32 flex-shrink-0">
                      <img src={`http://localhost:8080${issue.photoPath}`} alt="Issue" className="w-full h-full object-cover rounded-xl shadow-sm border border-slate-200" />
                    </div>
                  )}
                  <div className="text-right sm:ml-2 flex flex-col items-end gap-3">
                    <span className={`px-4 py-2 text-sm font-bold rounded-xl shadow-sm border-2
                      ${issue.status === 'REPORTED' ? 'bg-amber-100 text-amber-800 border-amber-300' : 
                        issue.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-cyan-100 text-cyan-800 border-cyan-300'}`}>
                      {issue.status.replace('_', ' ')}
                    </span>
                    <span className="px-3 py-1 text-xs font-semibold text-slate-600 bg-slate-100 rounded-full border border-slate-200">
                      Priority: {issue.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'report' && (
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/40 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-3">
            <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg">📝</span> 
            Report a New Issue
          </h2>

          {formError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Issue Title</label>
              <input 
                type="text" 
                required
                placeholder="E.g., Large pothole on Main St"
                className="w-full rounded-xl border-slate-300 shadow-sm p-3 border focus:ring-indigo-500 focus:border-indigo-500 transition-colors" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
              <textarea 
                required
                rows="4"
                placeholder="Please describe the issue in detail..."
                className="w-full rounded-xl border-slate-300 shadow-sm p-3 border focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
              <label className="block text-sm font-semibold text-slate-700 mb-1">Location Details</label>
              <p className="text-xs text-slate-500 mb-4">Search for an address or click directly on the interactive map to precisely drop a location pin.</p>
              
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <input 
                  type="text" 
                  placeholder="Type an address to search (e.g., 123 Main St, NY)"
                  className="flex-1 rounded-xl border-slate-300 shadow-sm p-3 border focus:ring-indigo-500 focus:border-indigo-500 transition-colors" 
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                  onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); searchAddress(); } }}
                />
                <button 
                  type="button"
                  onClick={searchAddress}
                  disabled={geocoding}
                  className="bg-slate-200 text-slate-800 font-semibold px-6 py-3 rounded-xl hover:bg-slate-300 transition-colors disabled:opacity-50"
                >
                  {geocoding ? 'Searching...' : 'Find on Map'}
                </button>
              </div>
              
              <div className="h-72 w-full rounded-xl border-2 border-indigo-100 overflow-hidden relative shadow-inner">
                <MapContainer 
                  center={[11.1271, 78.6569]} 
                  zoom={7} 
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationMarker position={position} setPosition={setPosition} />
                  <MapUpdater position={position} />
                </MapContainer>
              </div>
              {position && (
                <p className="text-sm text-indigo-600 font-medium mt-3 bg-indigo-50 inline-block px-3 py-1 rounded-full">
                  📍 Pin Coordinates: {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Attach a Photo (Optional)</label>
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <input 
                  type="file" 
                  accept="image/*"
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-colors cursor-pointer"
                  onChange={handlePhotoChange}
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="bg-indigo-600 text-white font-semibold px-8 py-4 rounded-xl hover:bg-indigo-700 disabled:bg-indigo-300 w-full transition-colors shadow-lg hover:shadow-xl mt-4 text-lg"
            >
              {loading ? 'Submitting Report...' : 'Submit Issue Report'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
