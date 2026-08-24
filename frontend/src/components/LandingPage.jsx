import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Map, Users, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-[80vh]">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-fuchsia-600 via-purple-600 to-cyan-600 overflow-hidden rounded-3xl mb-12 shadow-2xl">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover opacity-20 mix-blend-overlay"
            src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="City skyline"
          />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay"></div>
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-fuchsia-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-8 sm:py-32 lg:px-12 flex flex-col md:flex-row items-center">
          <div className="md:w-2/3 text-left">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6 drop-shadow-sm">
              Smart Municipal Issue <br className="hidden lg:block" />
              <span className="text-cyan-300">Reporting Platform</span>
            </h1>
            <p className="mt-6 text-xl text-fuchsia-100 max-w-3xl leading-relaxed mb-10 drop-shadow-sm">
              Empowering citizens to report local issues like potholes, broken streetlights, and water leaks directly to municipal authorities. Together, we can build a better, safer community.
            </p>
            <div className="mt-10 flex gap-4">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-xl text-purple-900 bg-white hover:bg-fuchsia-50 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/signin"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-xl text-white bg-white/20 hover:bg-white/30 backdrop-blur-md shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all border border-white/30"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white/60 backdrop-blur-xl rounded-3xl shadow-lg border border-white/60 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 to-cyan-600">How ResolveHub Works</h2>
            <p className="mt-4 text-lg text-slate-600 font-medium">A seamless process from reporting to resolution.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 group">
              <div className="flex items-center justify-center h-20 w-20 rounded-2xl bg-gradient-to-br from-rose-400 to-orange-400 text-white mx-auto mb-6 shadow-md transform group-hover:rotate-6 transition-transform duration-300">
                <Map className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-3">1. Pin the Location</h3>
              <p className="text-slate-600 font-medium leading-relaxed">
                Use our interactive map or type an address to accurately pinpoint the exact location of the issue.
              </p>
            </div>

            <div className="text-center bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 group">
              <div className="flex items-center justify-center h-20 w-20 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-purple-500 text-white mx-auto mb-6 shadow-md transform group-hover:-rotate-6 transition-transform duration-300">
                <Users className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-3">2. Community Feed</h3>
              <p className="text-slate-600 font-medium leading-relaxed">
                Upload a photo and description. See what others have reported in your area on the community dashboard.
              </p>
            </div>

            <div className="text-center bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 group">
              <div className="flex items-center justify-center h-20 w-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 text-white mx-auto mb-6 shadow-md transform group-hover:rotate-6 transition-transform duration-300">
                <ShieldCheck className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-3">3. Rapid Resolution</h3>
              <p className="text-slate-600 font-medium leading-relaxed">
                Municipal authorities receive the report instantly, assign priority, and update the status until it's verified.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
