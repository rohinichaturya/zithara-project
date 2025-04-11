import { Link } from "react-router-dom";
import IMG1 from "../../Assests/Ring_210125.webp";
import IMG2 from "../../Assests/Earrings_210125.webp";
import IMG3 from "../../Assests/Mangalsutra_Desktop_210125.webp";
import IMG4 from "../../Assests/Chains_210125.webp";
import IMG5 from "../../Assests/Bracelet_Desktop_210125.webp";
import IMG6 from "../../Assests/Pendant_210125.webp";
import IMG7 from "../../Assests/Necklace_Desktop_210125.webp";

const Category = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* Heading */}
      <h2 className="text-3xl font-semibold text-center mb-2">
        Shop By Categories
      </h2>
      <p className="text-gray-500 text-center mb-8">
        Find the perfect jewelry piece that matches your style.
      </p>

      {/* Grid Layout */}
      <div className="grid grid-cols-[40%_20%_40%] gap-6 h-[200px] md:h-[400px]">
        {/* 1st Column */}
        <div className="grid grid-rows-2 gap-6">
          <div className="grid grid-cols-2 gap-6">
            <CategoryCard name="Rings" image={IMG1} path="/collections/rings" />
            <CategoryCard name="Earrings" image={IMG2} path="/collections/earrings" />
          </div>
          <CategoryCard name="Mangalsutras" image={IMG3} path="/collections/mangalsutra" />
        </div>

        {/* 2nd Column (Single Full Height) */}
        <CategoryCard name="Necklaces" image={IMG7} path="/collections/necklaces" className="h-full" />

        {/* 3rd Column (Reverse of 1st Column) */}
        <div className="grid grid-rows-2 gap-6">
          <CategoryCard name="Bracelets" image={IMG5} path="/collections/bracelets" />
          <div className="grid grid-cols-2 gap-6">
            <CategoryCard name="Pendants" image={IMG6} path="/collections/pendants" />
            <CategoryCard name="Chains" image={IMG4} path="/collections/chains" />
          </div>
        </div>
      </div>
    </div>
  );
};

const CategoryCard = ({ name, image, path, className = "" }) => {
  return (
    <Link to={path} className={`relative group overflow-hidden rounded-xl shadow-lg block ${className}`}>
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute bottom-0 left-0 right-0 text-black py-2 text-center">
        <span className="text-xs md:text-lg font-medium">{name}</span>
      </div>
    </Link>
  );
};

export default Category;
