import React from 'react';
import Layout from '../core/Layout';
import { ToastContainer } from 'react-toastify';

const Contact = () => {
    return (
        <Layout>
            <ToastContainer />
            <HeroSection />
            <section className="py-14">
                <div className="container mx-auto px-6">
                    <div className="flex flex-wrap -mx-4">
                        <FormSection />
                        <InfoSection />
                    </div>
                </div>
            </section>
        </Layout>
    );
};

const HeroSection = () => {
    return (
        <section className="bg-gray-600 text-white py-14">
            <div className="container mx-auto px-6 text-center">
                <h1 className="text-5xl font-bold mb-2">
                    Contact
                </h1>
            </div>
        </section>
    );
};

const FormSection = () => {
    return (
        <div className="w-full md:w-1/2 px-4 mb-8 md:mb-0">
            <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
            <form className="bg-slate-100 rounded-lg shadow p-10">
                <div className="mb-4">
                    <input
                        className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                        type="text"
                        id="name"
                        placeholder="Your Name"
                    />
                </div>
                <div className="mb-4">
                    <input
                        className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                        type="email"
                        id="email"
                        placeholder="Your Email"
                    />
                </div>
                <div className="mb-4">
                    <textarea
                        className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                        id="message"
                        rows="5"
                        placeholder="Your Message"
                    ></textarea>
                </div>
                <div className="text-center">
                    <button
                        className="py-2 px-4 text-white font-semibold bg-red-500 hover:opacity-90 shadow rounded"
                        type="submit"
                    >
                        Send Message
                    </button>
                </div>
            </form>
        </div>
    );
};

const InfoSection = () => {
    return (
        <div className="w-full md:w-1/2 md:px-20 px-4 md:pt-0 pt-10">
            <h3 className="text-2xl font-bold mb-4">Contact Information</h3>
            <div className="py-6 gap-4 flex flex-col">
                <p className="text-lg">
                    If you have any questions, feel free to reach out to us at:
                </p>
                <p className="text-lg">
                    <strong>Email:</strong> support@willguard.com
                </p>
                <p className="text-lg">
                    <strong>Phone:</strong> +1 234 567 890
                </p>
                <p className="text-lg">
                    <strong>Address:</strong> 1234 Will Street, Testament City, TX 12345
                </p>
            </div>
        </div>
    );
};

export default Contact;
