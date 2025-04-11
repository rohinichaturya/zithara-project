import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaChevronDown } from 'react-icons/fa';
import Topbar from '../Components/Layout/Topbar';
import Navbar from '../Components/Layout/Navbar';
import Footer from '../Components/Common/Footer';

const ContactUs = () => {
  const faqs = [
    {
      question: "What are your business hours?",
      answer: "We're open Monday to Friday from 9:00 AM to 6:00 PM and Saturdays from 10:00 AM to 4:00 PM. Closed on Sundays and public holidays."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we ship worldwide with various shipping options available at checkout. Delivery times vary by destination."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for unworn items with original packaging. Custom pieces are final sale."
    },
    {
      question: "How do I care for my jewelry?",
      answer: "Avoid contact with water, chemicals, and perfumes. Store pieces separately in soft pouches and clean with a soft, dry cloth."
    }
  ];

  return (
    <div className="bg-gray-50">
      <Topbar />
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-800 to-blue-600 py-20 px-4 sm:px-6 lg:px-8 text-center mt-28">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-white sm:text-5xl mb-4">Get In Touch</h1>
          <p className="text-xl text-purple-100">Our team is ready to assist you with any questions about our jewelry collections.</p>
        </div>
      </div>

      {/* Contact Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-8 transform transition-all hover:scale-105 hover:shadow-xl">
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaMapMarkerAlt className="text-2xl text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Visit Us</h3>
              <p className="text-gray-600">
                123 Jewelry Avenue<br />
                Vijayawada<br />
                A.P , India
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 transform transition-all hover:scale-105 hover:shadow-xl">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaPhone className="text-2xl text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Call Us</h3>
              <p className="text-gray-600 mb-2">+91 72078 82334</p>
              <p className="text-sm text-gray-500">Mon-Fri: 9am-6pm IST</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 transform transition-all hover:scale-105 hover:shadow-xl">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaEnvelope className="text-2xl text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Email Us</h3>
              <p className="text-gray-600">info@luxuryjewels.com</p>
              <p className="text-sm text-gray-500 mt-2">Response within 24 hours</p>
            </div>
          </div>
        </div>
      </div>

      {/* Visit Our Showroom Section */}
      <div className="bg-gradient-to-r from-amber-50 to-amber-100 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-6">Experience Luxury In Person</h2>
          <p className="text-lg text-gray-700 mb-8">
            Visit our showroom to see our exquisite jewelry collections in person and receive personalized service from our experts.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactUs;