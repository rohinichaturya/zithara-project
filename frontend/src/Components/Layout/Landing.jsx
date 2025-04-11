import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Import images
import image1 from "../../Assests/L1.jpg";
import image2 from "../../Assests/L2.jpg";
import image3 from "../../Assests/L3.jpg";

const images = [image1, image2, image3];

const CustomPrevArrow = ({ onClick }) => (
  <div
    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 text-white p-3 rounded-full cursor-pointer z-10"
    onClick={onClick}
  >
    <FaChevronLeft size={25} />
  </div>
);

const CustomNextArrow = ({ onClick }) => (
  <div
    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 text-white p-3 rounded-full cursor-pointer z-10"
    onClick={onClick}
  >
    <FaChevronRight size={25} />
  </div>
);

const Landing = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    dotsClass: "slick-dots bottom-4 flex justify-center space-x-2",
  };

  return (
    <div className="w-full h-auto">
      <Slider {...settings} className="w-full">
        {images.map((src, index) => (
          <div key={index} className="w-full">
            <img
              src={src}
              alt={`Slide ${index + 1}`}
              className="w-full object-cover"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Landing;
