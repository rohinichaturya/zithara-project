import { FaFilter } from "react-icons/fa";

const FilteredSidebar = ({ filters, setFilters }) => {
  const handleCheckboxChange = (event, category, option) => {
    const isChecked = event.target.checked;

    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };

      if (isChecked) {
        updatedFilters[category] = [...(updatedFilters[category] || []), option];
      } else {
        updatedFilters[category] = updatedFilters[category].filter((item) => item !== option);
      }

      return updatedFilters;
    });
  };

  return (
    <div className="bg-gray-100 p-5 shadow-lg rounded-xl w-full max-w-xs md:max-w-sm lg:max-w-md">
      <div className="flex items-center justify-between border-b pb-3 mb-4">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
          <FaFilter className="mr-2 text-blue-600" /> Filters
        </h3>
      </div>

      {[
        { title: "weight", options: ["1g - 2g", "2g - 3g", "3g - 4g", "4g - 6g"] },
        { title: "price", options: ["₹5,000 - ₹10,000", "₹10,000 - ₹20,000", "₹20,000 - ₹50,000"] },
        { title: "metal", options: ["Gold", "Diamond", "Silver", "Platinum"] },
        { title: "occasion", options: ["Wedding", "Engagement", "Daily Wear", "Festive"] },
        { title: "shopFor", options: ["Men", "Women", "Kids", "Unisex"] },
        { title: "rating", options: ["⭐⭐⭐⭐⭐ (5 Stars)", "⭐⭐⭐⭐ (4 Stars & Above)", "⭐⭐⭐ (3 Stars & Above)"] },
      ].map((filter, index) => (
        <div key={index} className="mb-5">
          <h4 className="font-semibold text-gray-700 text-lg mb-2">{filter.title.replace(/([A-Z])/g, " $1")}</h4>
          <div className="flex flex-col gap-2 text-gray-600">
            {filter.options.map((option, idx) => (
              <label key={idx} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters[filter.title]?.includes(option)}
                  className="form-checkbox text-blue-600 border-gray-400 focus:ring-blue-500 focus:outline-none"
                  onChange={(e) => handleCheckboxChange(e, filter.title, option)}
                />
                {option}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FilteredSidebar;
