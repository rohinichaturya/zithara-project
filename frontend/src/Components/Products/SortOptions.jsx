import { useState, useEffect } from "react";

const SortOptions = ({ onSortChange }) => {
  const [sortOption, setSortOption] = useState("relevance");

  const handleSortChange = (event) => {
    const selectedOption = event.target.value;
    setSortOption(selectedOption);
    if (onSortChange) {
      onSortChange(selectedOption); // Pass selected option to parent component
    }
  };

  // ✅ Log the selected sort option when it changes
  useEffect(() => {
    console.log("Selected Sort Option:", sortOption);
  }, [sortOption]);

  return (
    <div className="bg-white p-2 rounded-lg shadow-md flex items-center space-x-2">
      <label className="font-semibold text-gray-700">Sort By:</label>
      <select
        className="p-2 border rounded focus:ring focus:ring-blue-300 transition"
        value={sortOption}
        onChange={handleSortChange}
      >
        <option value="relevance">Relevance</option>
        <option value="price-low-high">Price: Low to High</option>
        <option value="price-high-low">Price: High to Low</option>
      </select>
    </div>
  );
};

export default SortOptions;
