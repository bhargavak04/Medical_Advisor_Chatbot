import React from 'react';
import { SignIn } from '@clerk/clerk-react';

const Login = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <SignIn 
  appearance={{
    elements: {
      rootBox: "mx-auto w-full max-w-md",
      card: "bg-white shadow-md rounded-lg p-6",
      socialButtonsBlockButton: "w-full",
      formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
    }
  }}
  routing="path"
  path="/login"
  signUpUrl="/signup"
  fallbackRedirectUrl="https://medical-advisor-chatbot-pied.vercel.app/dashboard"
/>
    </div>
  );
};

export default Login;