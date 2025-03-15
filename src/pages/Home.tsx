import React from "react";
import happyDragon from "../assets/happy.png";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Recipe } from "../types";
import 'swiper/css';
import 'swiper/css/navigation';

interface HomeProps {
  recipes: Recipe[]
}

const Home: React.FC<HomeProps> = ({ recipes }) => {

  const navigate = useNavigate();
  const isDesktop = window.innerWidth >= 1024;

  return (
    <div className="bg-[url('/background.jpg')] bg-cover bg-center min-h-screen max-h-screen flex flex-col p-8 gap-10 overflow-y-auto lg:px-15 lg:gap-5">
      <h1 className="text-4xl font-black text-[#19243e] lg:text-9xl">Level up your health with Arcane Kitchen</h1>
      <div className="flex flex-col gap-3 lg:flex-row-reverse lg:gap-10">
        {/* Pet Dragon Section */}
        <div className="flex relative lg:flex-1">
          {/* Progress bars */}
          <div className="w-1/2 text-center">
            {/* Protein */}
            <div className="flex w-18/20 justify-between">
              <label htmlFor="protein" className="block text-sm mb-1 lg:text-lg">
                <span className="font-bold">Strength</span> (protein)
              </label>
              <p className="block text-sm mb-1 lg:text-lg">
                <span className="font-bold">
                  Lvl 1
                </span>
              </p>
            </div>
            <progress
              className="w-18/20 block mb-1"
              id="protein"
              value={60}
              max={100}
            ></progress>
            {/* Fat */}
            <div className="flex w-18/20 justify-between">
              <label htmlFor="protein" className="block text-sm mb-1 lg:text-lg">
                <span className="font-bold">Defense</span> (fat)
              </label>
              <p className="block text-sm mb-1 lg:text-lg">
                <span className="font-bold">
                  Lvl 1
                </span>
              </p>
            </div>
            <progress
              className="w-18/20 block "
              id="fat"
              value={40}
              max={100}
            ></progress>
            {/* Carbs */}
            <div className="flex w-18/20 justify-between">
              <label htmlFor="protein" className="block text-sm mb-1 lg:text-lg">
                <span className="font-bold">Dexterity</span> (carbs)
              </label>
              <p className="block text-sm mb-1 lg:text-lg">
                <span className="font-bold">
                  Lvl 1
                </span>
              </p>
            </div>
            <progress
              className="w-18/20 block mb-1"
              id="carbs"
              value={50}
              max={100}
            ></progress>
            {/* Calories */}
            <div className="flex w-18/20 justify-between">
              <label htmlFor="protein" className="block text-sm mb-1 lg:text-lg">
                <span className="font-bold">Stamina</span> (calories)
              </label>
              <p className="block text-sm mb-1 lg:text-lg">
                <span className="font-bold">
                  Lvl 1
                </span>
              </p>
            </div>
            <progress
              className="w-18/20 block mb-1"
              id="calories"
              value={70}
              max={100}
            ></progress>
          </div>
          {/* Overlay dragon image */}
          <img src={happyDragon} alt="dragon" className="size-70 absolute -top-15 -right-15 lg:size-110 lg:-top-40 lg:-right-25" />
        </div>
        {/* Sign up call-to-action */}
        <div className="flex flex-col gap-3 lg:w-1/2 lg:gap-8">
          <p className="text-amber-50 text-2xl lg:text-4xl">Join the adventure and watch your pet grow stronger as you make healthier food choices!</p>
          <button 
            className="text-amber-50 text-xl bg-[#19243e] opacity-80 p-2 w-full rounded-lg cursor-pointer hover:scale-105 hover:shadow-lg hover:text-[#ebd6aa] hover:opacity-100 lg:w-2/3 lg:text-2xl lg:p-4"
            onClick={() => navigate("/signup")}
          >
            Start Your Journey
          </button>
        </div>
      </div>

      {/* Recipe Section */}
      <div className="flex flex-col gap-3">
        <p className="text-amber-50 text-2xl lg:hidden">Browse a list of delicious, healthy recipes that will fuel your pet's growth.</p>
        {/* Recipe Carousel */}
        <div className="flex w-full items-center justify-between">
        
          <Swiper
            modules={[Navigation]}
            slidesPerView={3}
            centeredSlides={false}
            spaceBetween={10}
            navigation={true}
            breakpoints={{
              1024: {
                slidesPerView: 6,
                spaceBetween: 15,
              },
            }}
          >
            {recipes && recipes.slice(0, 5).map((recipe, index) => {
              return recipe.image && (
                <SwiperSlide key={`Recipe-${index}`}>
                  <div className="bg-[url('/paper-box.jpg')] p-1">
                    <img src={recipe.image} alt={`Recipe-${index}`} />
                  </div>
                </SwiperSlide>
              )
            })}

            {/* Add a button in the last slot in desktop view */}
            {isDesktop && 
            <SwiperSlide>
              <button
                className="w-full h-52 p-5 text-amber-50 text-3xl bg-[#19243e] opacity-80 rounded-lg cursor-pointer hover:scale-105 hover:shadow-lg hover:text-[#ebd6aa] hover:opacity-100"
                onClick={() => navigate("/recipes")}
              >
                Explore Healthy Recipes
              </button>
            </SwiperSlide>
            }
          </Swiper>
          
        </div>
        <button 
          className="text-amber-50 text-xl bg-[#19243e] opacity-80 p-2 w-full rounded-lg cursor-pointer hover:scale-105 hover:shadow-lg hover:text-[#ebd6aa] hover:opacity-100 mt-2 lg:hidden"
          onClick={() => navigate("/recipes")}
        >
          Explore Healthy Recipes
        </button>
      </div>
    </div>
  );
};

export default Home;
