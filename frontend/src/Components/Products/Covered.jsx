import { Link } from "react-router-dom";
import ringImg from "../../Assests/cov1.webp";
import necklaceImg from "../../Assests/cov2.webp";
import giftImg from "../../Assests/cov3.webp";
import diamondsImg from "../../Assests/cov4.webp";
import bridalImg from "../../Assests/cov5.webp";
import pocketImg from "../../Assests/cov6.webp";
import LImg from "../../Assests/cov7.webp";

const Covered = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Heading */}
      <h2 className="text-3xl font-semibold text-center mb-2">
        We've Got You Covered!
      </h2>
      <p className="text-gray-500 text-center mb-8">
        Whatever you are looking for, we have it.
      </p>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <CategoryCard name="Brilliant Firsts" image={ringImg} link="/collections/pendants" />
        <CategoryCard name="Your mini-me's" image={necklaceImg} link="/collections/chains" />
        <CategoryCard name="Gift Memories" image={giftImg} link="/collections/rings" />
        <CategoryCard name="Daily Diamonds" image={diamondsImg} link="/collections/rings" />
        <CategoryCard name="The Bridal Edit" image={bridalImg} link="/collections/bangles" />
        <CategoryCard name="Pocket Friendly" image={pocketImg} link="/collections/brooches" />
      </div>

      {/* Full-Width Image */}
      <div className="mt-12">
        <img
          src={LImg}
          alt="Full-Screen Cover"
          className="w-full h-auto object-cover rounded-xl"
        />
      </div>
    </div>
  );
};

// Responsive CategoryCard Component
const CategoryCard = ({ name, image, link }) => {
  return (
    <Link to={link} className="flex flex-col items-center w-full">
      <div className="relative group rounded-xl overflow-hidden shadow-lg w-full aspect-[4/3]">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="w-full bg-white text-center py-2 rounded-b-xl">
        <span className="text-base md:text-lg font-medium">{name}</span>
      </div>
    </Link>
  );
};

export default Covered;
