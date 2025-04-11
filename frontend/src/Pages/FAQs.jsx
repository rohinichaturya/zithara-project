import { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import Topbar from '../Components/Layout/Topbar';
import Navbar from '../Components/Layout/Navbar';
import Footer from '../Components/Common/Footer';
import { Link } from 'react-router-dom';

const FAQs = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What types of jewelry do you sell?",
      answer: "We specialize in gold, diamond, silver, and gemstone jewelry including rings, necklaces, earrings, bracelets, and traditional Indian jewelry like mangalsutras and temple jewelry."
    },
    {
      question: "Is your jewelry hallmarked?",
      answer: "Yes, all our gold jewelry is BIS hallmarked as per Indian government standards, ensuring purity and authenticity."
    },
    {
      question: "Do you offer customization services?",
      answer: "Absolutely! We provide custom jewelry design services where you can create personalized pieces with our expert jewelers."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit/debit cards, UPI payments, net banking, EMI options, and cash on delivery (for orders below ₹50,000)."
    },
    {
      question: "How can I verify the authenticity of my jewelry?",
      answer: "All our jewelry comes with certification from recognized Indian assay centers. Gold pieces include BIS hallmark and diamond jewelry comes with IGI or GIA certificates."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 15-day return policy for non-customized items in original condition. Customized pieces and gold coins cannot be returned."
    },
    {
      question: "Do you provide jewelry insurance?",
      answer: "Yes, we offer optional jewelry insurance through our partners. You can add insurance during checkout for high-value purchases."
    },
    {
      question: "How long does delivery take within India?",
      answer: "Standard delivery takes 3-5 business days. Express delivery (2-3 days) is available for metro cities. We ship from multiple locations across India."
    },
    {
      question: "Do you offer gold buyback?",
      answer: "Yes, we have a gold buyback program where you can exchange your old gold jewelry for new pieces with minimal making charges."
    },
    {
      question: "What are your making charges?",
      answer: "Making charges vary from 8% to 20% depending on the complexity of design. We offer transparent pricing with no hidden costs."
    },
    {
      question: "How do I care for my jewelry?",
      answer: "Store each piece separately in soft pouches, avoid contact with perfumes/chemicals, clean with mild soap solution, and get professional cleaning every 6 months."
    },
    {
      question: "Do you offer wedding jewelry collections?",
      answer: "Yes, we have extensive bridal collections including heavy gold sets, polki jewelry, kundan sets, and contemporary bridal designs suitable for Indian weddings."
    },
    {
      question: "What if my jewelry needs repairs?",
      answer: "We provide lifetime free cleaning and 1-year free repair service (excluding accidental damage). After warranty period, nominal charges apply."
    },
    {
      question: "Do you have physical stores?",
      answer: "We currently operate online across India with plans to open experience centers in major cities. Our customer support is available 10AM-8PM daily."
    },
    {
      question: "How do you ensure secure delivery?",
      answer: "All high-value shipments are sent with insurance, tamper-proof packaging, and require OTP-based delivery confirmation. Our logistics partners are carefully vetted."
    }
  ];

  return (
    <div>
        <Topbar />
        <Navbar />
        <div className="bg-gradient-to-b from-gray-50 to-purple-50 py-16 mt-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-purple-600">
            Everything you need to know about our jewelry and services
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="border border-purple-100 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-5 text-left"
              >
                <h3 className="font-medium text-gray-800 text-lg">
                  {faq.question}
                </h3>
                {activeIndex === index ? (
                  <FiChevronUp className="text-purple-600 text-xl" />
                ) : (
                  <FiChevronDown className="text-purple-600 text-xl" />
                )}
              </button>
              
              {activeIndex === index && (
                <div className="px-5 pb-5 pt-2 bg-purple-50">
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-6">
            Still have questions? Our jewelry experts are happy to help.
          </p>
          <Link to ="/contactus" className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-8 rounded-lg shadow-md transition-colors">
            Contact Our Support
          </Link>
        </div>
      </div>
    </div>
        <Footer />
    </div>
  );
};

export default FAQs;