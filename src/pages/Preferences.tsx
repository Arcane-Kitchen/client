import { useState, useRef } from "react";
import { UserProfile, DailyCaloriesAndMacros, Pet } from "../types";
import { calculateDailyCaloriesAndMacrosIntake } from "../util/caloriesAndMacrosCalculator";
import NutritionChart from "../components/nutritionChart";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper as SwiperType } from "swiper";
import { useAuth } from "../Auth/AuthContext";
import { updateUserCalorieAndMacrosGoal, updateUserPet } from "../api/userApi"

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Preferences = () => {

    const [userProfile, setUserProfile] = useState<UserProfile>({
        gender: "",
        age: "",
        weight: "",
        height: "",
        activityLevel: "Little or no exercise",
        goal: "Maintain weight"
    });
    const [dailyCaloriesAndMacros, setDailyCaloriesAndMacros] = useState<DailyCaloriesAndMacros | null>(null);
    const [page, setPage] = useState<number>(1);
    const [pet, setPet] = useState<Pet>({ 
        name: "", 
        imageUrl: { 
            happy: "/orange-dragon-happy.png", 
            neutral: "/orange-dragon-neutral.png", 
            sad: "/orange-dragon-sad.png"
        }
    });
    
    const happyPetsImageUrls = ["/orange-dragon-happy.png", "/unicorn.png", "/werewolf.png"];
    const neutralPetsImageUrls = ["/orange-dragon-neutral.png", "/unicorn.png", "/werewolf.png"];
    const sadPetsImageUrls = ["/orange-dragon-sad.png", "/unicorn.png", "/werewolf.png"];

    const { user, session } = useAuth();
    const formRef = useRef<HTMLFormElement | null>(null);
    
    const handleNextClick = async (event: React.MouseEvent) => {
        console.log(formRef.current)
        if (page === 1) {
            event.preventDefault();

            if (formRef.current) {
                formRef.current.reportValidity();
                const recommendedCaloriesAndMacros = calculateDailyCaloriesAndMacrosIntake(userProfile);
                setDailyCaloriesAndMacros(recommendedCaloriesAndMacros);
            }
        } else if (page === 3) {
            event.preventDefault();

            if (formRef.current && user && session) {
                formRef.current.reportValidity();
                await updateUserCalorieAndMacrosGoal(user.id, session.access_token, dailyCaloriesAndMacros);
                await updateUserPet(user.id, session.access_token, pet);
                return;
            }
        }
        setPage(page + 1);
    }

    const handleBackClick = () => {
        setPage(page - 1);
    }

    const handleUserProfileChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        const key = name as keyof UserProfile;

        const updatedUserProfile = { ...userProfile };
        updatedUserProfile[key] = value;

        setUserProfile(updatedUserProfile);
    }

    const handleSlideChange = (swiper: SwiperType) => {
        const index = swiper.activeIndex;
        const newPet = { ...pet };
        newPet.imageUrl.happy = happyPetsImageUrls[index];
        newPet.imageUrl.neutral = neutralPetsImageUrls[index];
        newPet.imageUrl.sad = sadPetsImageUrls[index];
        console.log(newPet)
        setPet(newPet);
    }

    const handlePetNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;

        const newPet = { ...pet };
        newPet.name = value;
        console.log(newPet)
        setPet(newPet);
    }

    // const handleRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const { id, value } = event.target;
    //     const key = id as keyof DailyCaloriesAndMacros;
        
    //     if(dailyCaloriesAndMacros)
    //     const updatedMacros = { ...dailyCaloriesAndMacros };
    //     updatedMacros[key].percentage = parseInt(value, 10);
    // }

    return (
        <div className="flex-1 flex flex-col items-center px-2 py-10">
            <div className="bg-[url('/wizard.jpg')] bg-cover bg-center rounded-full w-3/5 aspect-square lg:p-15">
            </div>
            <div className="h-65 w-full p-4 flex flex-col items-center justify-center relative">
                <img src="/sign-up-box.svg" className="w-full transform scale-y-210 lg:w-4/5 lg:scale-y-110" />
                <div className="absolute top-6/11 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full flex flex-col items-center justify-center lg:w-4/5">
                    {page === 1 ? (
                        <form ref={formRef} className="px-6 w-4/5 lg:w-3/5">
                            <h1 className="text-white text-center text-2xl mb-3">Enter your details</h1>

                            {/* Gender Input */}
                            <div className="flex gap-2 items-center">
                                <label
                                    className="block text-white text-sm font-bold mb-2 flex-1"
                                    htmlFor="gender"
                                >
                                    Gender
                                </label>
                                <fieldset className="flex justify-around w-2/3 mb-2">
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="radio"
                                            id="gender-female"
                                            name="gender"
                                            value="Female"
                                            required={true}
                                            checked={userProfile.gender === "Female"}
                                            onChange={handleUserProfileChange}
                                            className='border-solid border-gray-200 border-1 inset-shadow-xs p-1' 
                                        />
                                        <label className="block text-white font-bold flex-1" htmlFor="Female"> Female</label>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="radio"
                                            id="gender-male"
                                            name="gender"
                                            value="Male"
                                            required={true}
                                            checked={userProfile.gender === "Male"}
                                            onChange={handleChange}
                                            className='border-solid border-gray-200 border-1 inset-shadow-xs p-1' 
                                        />
                                        <label className="block text-white font-bold flex-1" htmlFor="Male"> Male</label>
                                    </div>
                                </fieldset>
                            </div>

                            {/* Age Input */}
                            <div className="flex gap-2 items-center">
                                <label
                                    className="block text-white text-sm font-bold mb-2 flex-1"
                                    htmlFor="age"
                                >
                                    Age
                                </label>
                                <input
                                    className="shadow appearance-none rounded w-2/3 py-2 px-3 text-gray-700 mb-2 leading-tight focus:outline-none focus:shadow-outline bg-white"
                                    id="age"
                                    name="age"
                                    type="number"
                                    placeholder="e.g. 27"
                                    value={userProfile.age}
                                    required={true}
                                    onChange={handleUserProfileChange}
                                />
                            </div>

                            {/* Weight Input */}
                            <div className="flex gap-2 items-center">
                            <label
                                className="block text-white text-sm font-bold mb-2 flex-1"
                                htmlFor="weight"
                            >
                                Weight (kg)
                            </label>
                            <input
                                className="shadow appearance-none rounded w-2/3 py-2 px-3 text-gray-700 mb-2 leading-tight focus:outline-none focus:shadow-outline bg-white"
                                id="weight"
                                name="weight"
                                type="number"
                                placeholder="e.g. 72"
                                value={userProfile.weight}
                                required={true}
                                onChange={handleUserProfileChange}
                            />
                            </div>

                            {/* Height Input */}
                            <div className="flex gap-2 items-center">
                            <label
                                className="block text-white text-sm font-bold mb-2 flex-1"
                                htmlFor="height"
                            >
                                Height (cm)
                            </label>
                            <input
                                className="shadow appearance-none rounded w-2/3 py-2 px-3 text-gray-700 mb-2 leading-tight focus:outline-none focus:shadow-outline bg-white"
                                id="height"
                                name="height"
                                type="number"
                                placeholder="e.g. 173"
                                value={userProfile.height}
                                required={true}
                                onChange={handleUserProfileChange}
                            />
                            </div>
                            
                            {/* Activity Level Dropdown */}
                            <div className="flex gap-2 items-center">
                                <label
                                    className="block text-white text-sm font-bold mb-2 flex-1"
                                    htmlFor="activityLevel"
                                >
                                    Activity Level
                                </label>
                                <select 
                                    id="activityLevel" 
                                    name="activityLevel"
                                    className="shadow appearance-none rounded w-2/3 py-2 px-3 text-gray-700 mb-2 leading-tight focus:outline-none focus:shadow-outline bg-white"
                                    value={userProfile.activityLevel} 
                                    onChange={handleUserProfileChange}
                                >
                                    <option value="Little or no exercise">Little or no exercise</option>
                                    <option value="Light exercise 1-3 days/week">Light exercise 1-3 days/week</option>
                                    <option value="Moderate exercise 3-5 days/week">Moderate exercise 3-5 days/week</option>
                                    <option value="Hard exercise 6-7 days/week">Hard exercise 6-7 days/week</option>
                                    <option value="Intense exercise">Intense exercise</option>
                                </select>
                            </div>

                            {/* Weight Goal Dropdown */}
                            <div className="mb-6 flex gap-2 items-center">
                                <label
                                    className="block text-white text-sm font-bold mb-2 flex-1"
                                    htmlFor="goal"
                                >
                                    Diet Goal
                                </label>
                                <select 
                                    id="goal" 
                                    name="goal"
                                    className="shadow appearance-none rounded w-2/3 py-2 px-3 text-gray-700 mb-2 leading-tight focus:outline-none focus:shadow-outline bg-white"
                                    value={userProfile.goal} 
                                    onChange={handleUserProfileChange}
                                >
                                    <option value="Maintain weight">Maintain weight</option>
                                    <option value="Lose weight">Lose weight</option>
                                    <option value="Gain muscles">Gain muscles</option>
                                </select>
                            </div>
                        </form>
                    ) : page === 2 ? (
                        <div className="px-6 w-4/5">
                            <h1 className="text-white text-center text-2xl mb-3">Recommended Daily Calories and Macros</h1>
                            {dailyCaloriesAndMacros && (
                                <div className="flex flex-col w-full items-center gap-3">
                                    {/* Macros Chart */}
                                    <div className="w-full relative">
                                        <h1 className="text-white text-center text-3xl/5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">{dailyCaloriesAndMacros.calories}<br /><span className="text-lg/0">kcal</span></h1>
                                        <NutritionChart dataValues={dailyCaloriesAndMacros} labels={["carbs", "fats", "protein"]}/>
                                    </div>
                                    {/* Adjust the macros if necessary */}
                                    {/* <div className="flex-1">
                                        <input id="carbs" type="range" min={1} max={100} value={dailyCaloriesAndMacros?.carbs.percentage} />
                                    </div> */}
                                </div>
                            )}
                            
                        </div>
                    ) : (
                        <div className="px-6 w-4/5 flex flex-col gap-3">
                            <h1 className="text-white text-center text-2xl">Choose your pet</h1>
                            {/* Pet carousel */}
                            <div className="flex-1">
                                <Swiper
                                    slidesPerView={1}
                                    spaceBetween={30}
                                    // loop={true}
                                    pagination={{
                                      clickable: true,
                                    }}
                                    navigation={true}
                                    onSlideChange={handleSlideChange}
                                    modules={[Pagination, Navigation]}
                                >
                                    {happyPetsImageUrls.map((pet, index) => {
                                    return (
                                        <SwiperSlide key={`Pet-${index}`}>
                                            <div className="flex items-center h-50">
                                                <img src={pet} alt={`Pet-${index}`} className="w-full h-full object-contain"/>
                                            </div>
                                        </SwiperSlide>
                                    )
                                    })}
                                </Swiper>  
                            </div>
                            <form ref={formRef} className="px-6 w-full lg:w-3/5">
                                <div className="flex gap-2 items-center">
                                    <label
                                        className="block text-white text-lg font-bold mb-2 flex-1"
                                        htmlFor="petName"
                                    >
                                        Pet name: 
                                    </label>
                                    <input
                                        className="shadow appearance-none rounded w-2/3 py-2 px-3 text-gray-700 mb-2 leading-tight focus:outline-none focus:shadow-outline bg-white"
                                        id="petName"
                                        name="petName"
                                        type="text"
                                        placeholder="e.g. Dino"
                                        value={pet.name}
                                        required={true}
                                        onChange={handlePetNameChange}
                                    />
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>

            {/* Next Button */}
            <div className="mt-25 flex items-center justify-center gap-5">
                <button className={`bg-[url('/button-box.svg')] bg-cover bg-center h-20 w-30 cursor-pointer ${page === 1 ? "hidden" : "block"}`} onClick={handleBackClick}>
                    <h1 className="text-white">Back</h1>
                </button>
                <button className="bg-[url('/button-box.svg')] bg-cover bg-center h-20 w-30 cursor-pointer" onClick={handleNextClick}>
                    <h1 className="text-white">Next</h1>
                </button>
            </div>
        
        </div>
    )
}

export default Preferences
