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

  return (
    <div className="bg-[url('/background.jpg')] bg-cover bg-center min-h-screen max-h-screen flex flex-col p-8 gap-10">
      <h1 className="text-4xl font-black text-[#19243e]">Level up your health with Arcane Kitchen</h1>
      {/* Pet Dragon Section */}
      <div className="flex relative">
        {/* Progress bars */}
        <div className="w-1/2 text-center">
          {/* Protein */}
          <div className="flex w-18/20 justify-between">
            <label htmlFor="protein" className="block text-sm mb-1">
              <span className="font-bold">Strength</span> (protein)
            </label>
            <p className="block text-sm mb-1">
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
            <label htmlFor="protein" className="block text-sm mb-1">
              <span className="font-bold">Defense</span> (fat)
            </label>
            <p className="block text-sm mb-1">
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
            <label htmlFor="protein" className="block text-sm mb-1">
              <span className="font-bold">Dexterity</span> (carbs)
            </label>
            <p className="block text-sm mb-1">
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
            <label htmlFor="protein" className="block text-sm mb-1">
              <span className="font-bold">Stamina</span> (calories)
            </label>
            <p className="block text-sm mb-1">
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
        <img src={happyDragon} alt="dragon" className="size-70 absolute -top-15 -right-15" />
      </div>
      {/* Sign up call-to-action */}
      <div className="flex flex-col gap-3">
        <p className="text-amber-50 text-2xl">Join the adventure and watch your pet grow stronger as you make healthier food choices!</p>
        <button 
          className="text-amber-50 text-xl bg-[#19243e] opacity-80 p-2 w-full rounded-lg cursor-pointer hover:scale-105 hover:shadow-lg hover:text-[#ebd6aa] hover:opacity-100"
          onClick={() => navigate("/signup")}
        >
          Start Your Journey
        </button>
      </div>

      {/* Recipe Section */}
      <div className="flex flex-col gap-3">
        <p className="text-amber-50 text-2xl">Browse a list of delicious, healthy recipes that will fuel your pet's growth.</p>
        {/* Recipe Carousel */}
        <div className="flex w-full items-center justify-between">
        
          <Swiper
            modules={[Navigation]}
            slidesPerView={3}
            centeredSlides={false}
            spaceBetween={10}
            navigation={true}
          >

            {recipes && recipes.map((recipe, index) => {
              return recipe.image && (
                <SwiperSlide key={`Recipe-${index}`}>
                  <div className="bg-[url('/paper-box.jpg')] p-1">
                    <img src={recipe.image} alt={`Recipe-${index}`} />
                  </div>
                </SwiperSlide>
              )
            })}
          </Swiper>
          
        </div>
        <button 
          className="text-amber-50 text-xl bg-[#19243e] opacity-80 p-2 w-full rounded-lg cursor-pointer hover:scale-105 hover:shadow-lg hover:text-[#ebd6aa] hover:opacity-100 mt-2"
          onClick={() => navigate("/recipes")}
        >
          Explore Healthy Recipes
        </button>
      </div>
    </div>
  );
};

export default Home;
