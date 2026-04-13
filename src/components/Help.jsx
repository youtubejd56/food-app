import React from 'react';

const Help = () => {
  const faqs = [
    {
      question: 'How do I track my order?',
      answer: 'You can track your order in real-time through the orders section in your profile. You will also receive SMS updates.'
    },
    {
      question: 'Can I cancel my order?',
      answer: 'Orders can only be cancelled within 60 seconds of placing them. After that, the restaurant starts preparing your food.'
    },
    {
      question: 'What are the delivery charges?',
      answer: 'Delivery charges vary based on distance and order value. You can see the exact amount at the checkout page.'
    },
    {
      question: 'How do I pay for my order?',
      answer: 'We accept all major credit/debit cards, UPI, and popular digital wallets for a seamless payment experience.'
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Customer Support</h1>
          <p className="text-gray-600 text-lg">We're here to help you with anything you need</p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center group hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-500 mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Call Us</h3>
            <p className="text-gray-500 mb-4">Available 24/7 for urgent queries</p>
            <a href="tel:8075631073" className="text-orange-500 font-bold text-lg hover:underline decoration-2 underline-offset-4">
              +91 8075631073
            </a>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center group hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Email Us</h3>
            <p className="text-gray-500 mb-4">We usually respond within 2 hours</p>
            <a href="mailto:kkvinayak716@gmail.com" className="text-blue-500 font-bold text-lg hover:underline decoration-2 underline-offset-4">
              kkvinayak716@gmail.com
            </a>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {faqs.map((faq, index) => (
              <div key={index} className="p-8 hover:bg-gray-50 transition-colors">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h4>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
