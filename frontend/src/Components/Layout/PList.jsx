import { useNavigate } from "react-router-dom";
import { GiCrystalEarrings, GiNecklace, GiPearlNecklace, GiCrownCoin, GiGemChain } from "react-icons/gi";
import { LiaLifeRingSolid, LiaRingSolid } from "react-icons/lia";
import { GiBigDiamondRing } from "react-icons/gi";
import { TbAnkh } from "react-icons/tb";

const PList = () => {
  const navigate = useNavigate();

  const categories = [
    { name: "Rings", icon: <GiBigDiamondRing size={18} />, path: "rings" },
    { name: "Earrings", icon: <GiCrystalEarrings size={18} />, path: "earrings" },
    { name: "Necklaces", icon: <GiNecklace size={18} />, path: "necklaces" },
    { name: "Bracelets", icon: <LiaLifeRingSolid size={18} />, path: "bracelets" },
    { name: "Brooches", icon: <GiCrownCoin size={18} />, path: "brooches" },
    { name: "Pendants", icon: <GiPearlNecklace size={18} />, path: "pendants" },
    { name: "Anklets", icon: <TbAnkh size={18} />, path: "anklets" },
    { name: "Bangles", icon: <LiaRingSolid size={18} />, path: "bangles" },
    { name: "Chains", icon: <GiGemChain size={18} />, path: "chains" },
  ];

  return (
    <div className="bg-white pt-1 md:pt-28 pb-5 px-6 md:px-16 shadow-md">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-wrap justify-between items-center gap-4">
          {categories.map((category, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 text-gray-800 text-sm md:text-base cursor-pointer hover:text-gray-600 transition duration-300"
              onClick={() => navigate(`/collections/${category.path.toLowerCase()}`)} // ✅ Fixed navigation
            >
              <div className="text-gray-500">{category.icon}</div>
              <span>{category.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PList;
