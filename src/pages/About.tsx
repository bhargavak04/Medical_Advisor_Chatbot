import React from 'react';

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">About MedAdvisor</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            MedAdvisor is dedicated to making quality healthcare guidance accessible to everyone, 24/7. We combine advanced AI technology with medical knowledge to provide personalized health advice and support when you need it most.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">What We Offer</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-medium text-gray-900 mb-2">24/7 AI Medical Support</h3>
              <p className="text-gray-600">Access instant medical advice through our advanced AI chatbot, available any time of day or night.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-medium text-gray-900 mb-2">Personalized Health Profiles</h3>
              <p className="text-gray-600">Maintain your medical history securely and receive tailored health recommendations.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-medium text-gray-900 mb-2">Secure Platform</h3>
              <p className="text-gray-600">Your health information is protected with state-of-the-art security measures and encryption.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-medium text-gray-900 mb-2">Comprehensive Chat History</h3>
              <p className="text-gray-600">Keep track of all your medical consultations and advice in one convenient location.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Technology</h2>
          <p className="text-gray-600 leading-relaxed">
            MedAdvisor leverages cutting-edge AI technology powered by Groq, combined with a robust FastAPI backend and a responsive React frontend. This ensures a seamless, reliable, and user-friendly experience across all devices.
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;