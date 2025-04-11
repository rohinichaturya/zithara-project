import { Link } from "react-router-dom";
import menImg from "../../Assests/men.jpg";
import womenImg from "../../Assests/women.jpg";
import kidsImg from "../../Assests/kids.jpg";

const Gender = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 pt-12">
      <h2 className="text-3xl font-semibold text-center mb-2">Shop by Gender</h2>
      <p className="text-gray-500 text-center mb-8">Find the perfect jewelry for everyone.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GenderCard name="Men" image={menImg} link="/collections/gender/Men" />
        <GenderCard name="Kids" image={kidsImg} link="/collections/gender/Kids" />
        <GenderCard name="Women" image={womenImg} link="/collections/gender/Women" />
      </div>
    </div>
  );
};

const GenderCard = ({ name, image, link }) => {
  return (
    <Link to={link}>
      <div className="flex flex-col items-center cursor-pointer">
        <div className="relative group rounded-xl overflow-hidden shadow-lg w-full">
          <img
            src={image}
            alt={name}
            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="w-full bg-white text-center py-2 rounded-b-xl">
          <span className="text-lg font-medium">{name}</span>
        </div>
      </div>
    </Link>
  );
};

export default Gender;
