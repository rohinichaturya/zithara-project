import { FaShippingFast, FaExchangeAlt, FaCertificate, FaHandsHelping } from "react-icons/fa";
import { GiReturnArrow } from "react-icons/gi"; // Import icons

const Quality = () => {
  const services = [
    { icon: <FaShippingFast size={40} className="text-red-500" />, title: "Free Shipping", description: "Get 100% Free Shipping" },
    { icon: <FaExchangeAlt size={40} className="text-red-500" />, title: "Easy Exchange", description: "Exchange your old designs anytime" },
    { icon: <FaCertificate size={40} className="text-red-500" />, title: "Certified Jewellery", description: "100% Certified Jewellery" },
    { icon: <FaHandsHelping size={40} className="text-red-500" />, title: "Lifetime Product Service", description: "Keep your jewellery in top shape" },
    { icon: <GiReturnArrow size={40} className="text-red-500" />, title: "14 Days Return", description: "14 Days Hassle-Free Returns" },
  ];

  return (
    <div className="bg-white py-12 px-6">
      {/* Heading */}
      <h2 className="text-3xl font-semibold text-center">Quality-First Service</h2>
      <p className="text-gray-500 text-center mb-8">
        We assure you that you will get what you can trust. Always!
      </p>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Top Row (3 Columns) */}
        {services.slice(0, 3).map((service, index) => (
          <div key={index} className="flex flex-col items-center text-center p-6 rounded-lg shadow-lg border border-gray-200">
            {service.icon}
            <h3 className="text-lg font-medium mt-3">{service.title}</h3>
            <p className="text-gray-500">{service.description}</p>
          </div>
        ))}

        {/* Second Row (2 Columns) */}
        <div className="sm:col-span-2 md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
          {services.slice(3).map((service, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6 rounded-lg shadow-lg border border-gray-200">
              {service.icon}
              <h3 className="text-lg font-medium mt-3">{service.title}</h3>
              <p className="text-gray-500">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quality;
