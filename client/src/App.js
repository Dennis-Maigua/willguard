import React from 'react';
import Layout from './core/Layout';
import { ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';
import { isAuth } from './utils/helpers';

const App = () => {
  return (
    <Layout>
      <ToastContainer />
      <HeroSection />
      <HowItWorksSection />
      <TestimonialsSection />
    </Layout>
  );
};

const HeroSection = () => {
  return (
    <section className="bg-gray-600 text-white py-28">
      <div className="m-auto flex flex-col items-center text-center gap-4 px-4">
        <h1 className="text-4xl font-bold mb-2">
          Manage Your Wills Easily Online
        </h1>

        <p className="text-lg">
          Secure, reliable, and easy-to-use platform for your wills and testaments.
        </p>

        {!isAuth() ? (
          <Link to="/signup" className="py-3 px-4 font-semibold text-white bg-red-500 hover:opacity-80 shadow rounded">
            Get Started
          </Link>
        ) : (
          <Link to="/create-will" className="py-3 px-4 font-semibold text-white bg-red-500 hover:opacity-80 shadow rounded">
            Get Started
          </Link>
        )}
      </div>
    </section>
  );
};

const HowItWorksSection = () => {
  return (
    <section className="py-20 bg-slate-100">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-10"> How It Works </h2>

        <div className="flex flex-wrap -mx-4">
          <div className="w-full md:w-1/3 px-4 mb-8">
            <div className="bg-white rounded-lg shadow p-10">
              <h3 className="text-xl font-bold mb-4"> 1. Sign Up </h3>
              <p> Register on our platform to get started. It is quick and easy! </p>
            </div>
          </div>

          <div className="w-full md:w-1/3 px-4 mb-8">
            <div className="bg-white rounded-lg shadow p-10">
              <h3 className="text-xl font-bold mb-4"> 2. Create Will </h3>
              <p> Follow our simple step-by-step process to create your will. </p>
            </div>
          </div>

          <div className="w-full md:w-1/3 px-4 mb-8">
            <div className="bg-white rounded-lg shadow p-10">
              <h3 className="text-xl font-bold mb-4"> 3. Send Will </h3>
              <p> Easily send wills to your beneficiaries anytime, anywhere. </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const TestimonialsSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-10"> Testimonials </h2>

        <div className="flex flex-wrap -mx-4">
          <div className="w-full md:w-1/3 px-4 mb-8">
            <div className="bg-slate-100 rounded-lg shadow p-10">
              <p className="text-lg italic">
                "This platform made it so easy to create my will. I feel at ease knowing my wishes are secured."
              </p>
              <p className="mt-4 font-bold">- Martin Kelly</p>
            </div>
          </div>

          <div className="w-full md:w-1/3 px-4 mb-8">
            <div className="bg-slate-100 rounded-lg shadow p-10">
              <p className="text-lg italic">
                "The process was straightforward, and I was able to save my will effortlessly. Highly recommend!"
              </p>
              <p className="mt-4 font-bold">- Ana Smith</p>
            </div>
          </div>

          <div className="w-full md:w-1/3 px-4 mb-8">
            <div className="bg-slate-100 rounded-lg shadow p-10">
              <p className="text-lg italic">
                "The security and ease of use are top-notch. I trust this platform with my wills and testaments."
              </p>
              <p className="mt-4 font-bold">- Brian Williams</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default App;
