import { Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import CitizenDashboard from './components/CitizenDashboard';
import AuthorityDashboard from './components/AuthorityDashboard';
import SignIn from './components/SignIn';
import Register from './components/Register';
import LandingPage from './components/LandingPage';
import { MapPin, LogOut, User as UserIcon } from 'lucide-react';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/signin');
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col font-sans text-slate-900">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-fuchsia-400/30 blur-[100px] opacity-80 mix-blend-multiply animate-blob"></div>
        <div className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-cyan-400/30 blur-[100px] opacity-80 mix-blend-multiply animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] rounded-full bg-amber-400/30 blur-[100px] opacity-80 mix-blend-multiply animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
      </div>

      <nav className="bg-white/60 backdrop-blur-xl border-b border-white/50 shadow-[0_4px_30px_rgba(0,0,0,0.05)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center gap-2 text-fuchsia-600 hover:text-fuchsia-700 transition-colors">
              <MapPin className="h-8 w-8" />
              <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 to-cyan-600">ResolveHub</span>
            </Link>
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full">
                    <UserIcon className="h-4 w-4" />
                    <span>{user.name} <span className="text-slate-400 font-normal">({user.role === 'AUTHORITY' ? 'Authority' : 'Citizen'})</span></span>
                  </div>
                  <button 
                    onClick={handleLogout} 
                    className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Link to="/signin" className="text-sm font-medium text-slate-700 hover:text-fuchsia-600 px-3 py-2 transition-colors">Sign In</Link>
                  <Link to="/register" className="text-sm font-medium bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white px-5 py-2.5 rounded-xl hover:from-fuchsia-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-fuchsia-500/30 transform hover:-translate-y-0.5">Get Started</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Routes>
          <Route path="/signin" element={<SignIn onLogin={setUser} />} />
          <Route path="/register" element={<Register onLogin={setUser} />} />
          
          <Route path="/" element={
            user ? (
              user.role === 'AUTHORITY' ? <Navigate to="/authority" /> : <CitizenDashboard user={user} />
            ) : <LandingPage />
          } />
          
          <Route path="/authority" element={
            user ? (
              user.role === 'AUTHORITY' ? <AuthorityDashboard user={user} /> : <Navigate to="/" />
            ) : <Navigate to="/signin" />
          } />
        </Routes>
      </main>

      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} ResolveHub. Empowering communities to build better cities together.
        </div>
      </footer>
    </div>
  );
}

export default App;

