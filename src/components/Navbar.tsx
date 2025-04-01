import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, User, MessageSquare, LogOut } from 'lucide-react';
import { useUser, useClerk, SignedIn, SignedOut } from '@clerk/clerk-react';

const Navbar = () => {
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <Activity className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">MedAdvisor</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/" className="inline-flex items-center px-1 pt-1 text-gray-900">
                Home
              </Link>
              <SignedIn>
                <Link to="/dashboard" className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-900">
                  Dashboard
                </Link>
                <Link to="/chatbot" className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-900">
                  Medical Chat
                </Link>
              </SignedIn>
              <Link to="/about" className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-900">
                About
              </Link>
              <Link to="/contact" className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-900">
                Contact
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <SignedIn>
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="flex items-center text-gray-500 hover:text-gray-900 px-3 py-2">
                  <User className="h-5 w-5 mr-1" />
                  {user?.fullName || 'Profile'}
                </Link>
                <button 
                  onClick={() => signOut()}
                  className="flex items-center text-gray-500 hover:text-gray-900 px-3 py-2"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  Sign Out
                </button>
              </div>
            </SignedIn>
            <SignedOut>
              <Link to="/login" className="text-gray-500 hover:text-gray-900 px-3 py-2">
                Login
              </Link>
              <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Sign Up
              </Link>
            </SignedOut>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;