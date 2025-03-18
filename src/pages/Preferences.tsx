import { useState, useRef } from "react";
import { UserProfile, DailyCaloriesAndMacros, Pet } from "../types";
import { calculateDailyCaloriesAndMacrosIntake } from "../util/caloriesAndMacrosCalculator";
import NutritionChart from "../components/NutritionChart";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper as SwiperType } from "swiper";
import { useAuth } from "../Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { updateUserCalorieAndMacrosGoal, updateUserPet } from "../api/userApi"
import { activityLevels, goals, pets, petMoods } from "../util/constants";
import UserDetailsForm from "../components/UserDetailsForm";
import { FaDumbbell } from "react-icons/fa6";
import { PiSneakerMoveFill } from "react-icons/pi";
import { FaShieldAlt } from "react-icons/fa";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Preferences = () => {

    const [userProfile, setUserProfile] = useState<UserProfile>({
        gender: "",
        age: "",
        weight: "",
        height: "",
        activityLevel: activityLevels[0],
        goal: goals[0],
    });
    const [dailyCaloriesAndMacros, setDailyCaloriesAndMacros] = useState<DailyCaloriesAndMacros | null>(null);
    const [page, setPage] = useState<number>(1);
    const [pet, setPet] = useState<Pet>({ 
        name: "", 
        imageUrl: { 
            happy: petMoods.orangeDragon.happy, 
            neutral: petMoods.orangeDragon.neutral,
            sad: petMoods.orangeDragon.sad
        }
    });
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const { user, session, setUser } = useAuth();
    const navigate = useNavigate();
    const formRef = useRef<HTMLFormElement | null>(null);
    
    const handleNextClick = async (event: React.MouseEvent) => {
        if (page === 1) {
            event.preventDefault();

            if (formRef.current) {
                formRef.current.reportValidity(); // Validate form fields
                const recommendedCaloriesAndMacros = calculateDailyCaloriesAndMacrosIntake(userProfile);
                setDailyCaloriesAndMacros(recommendedCaloriesAndMacros);

                if (session && user && user.pet_name) {
                    await updateUserCalorieAndMacrosGoal(user.id, session.access_token, recommendedCaloriesAndMacros);

                    const updatedUser = { ...user };
                    updatedUser.daily_calorie_goal = recommendedCaloriesAndMacros.calories;
                    updatedUser.daily_carb_goal = recommendedCaloriesAndMacros.carbs.percentage;
                    updatedUser.daily_fat_goal = recommendedCaloriesAndMacros.fats.percentage;
                    updatedUser.daily_protein_goal = recommendedCaloriesAndMacros.protein.percentage;
                    setUser(updatedUser);
                    
                    setIsEditing(false);
                    setPage(1);
                    return;
                }
            }

        } else if (page === 3) {
            event.preventDefault();

            if (formRef.current && user && session) {
                const isFormValid = formRef.current.checkValidity(); // Check if the form is valid

                // Trigger browser validation messages if invalid
                if (!isFormValid) {
                    formRef.current.reportValidity(); 
                    return;
                }

                await updateUserCalorieAndMacrosGoal(user.id, session.access_token, dailyCaloriesAndMacros); // Update user's macros in the database
                await updateUserPet(user.id, session.access_token, pet); // Update user's pet data in the database
                navigate("/profile");
            }
        }
        setPage(page + 1);
    }

    const handleBackClick = () => {
        setPage(page - 1);
    }

    const handleEditClick = () => {
        setIsEditing(true);
    }

    // Handle changes in the user profile form fields
    const handleUserProfileChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        const key = name as keyof UserProfile;

        const updatedUserProfile = { ...userProfile };
        updatedUserProfile[key] = value;

        setUserProfile(updatedUserProfile);
    }

    // Handle changes in the pet selection carousel
    const handleSlideChange = (swiper: SwiperType) => {
        const index = swiper.activeIndex; // Get the current slide index
        const petType = pets[index];
        
        const newPet = { ...pet };
        newPet.imageUrl.happy = petMoods[petType].happy;
        newPet.imageUrl.neutral = petMoods[petType].neutral;
        newPet.imageUrl.sad = petMoods[petType].sad;
        setPet(newPet);
    }
    
    // Handle changes in the pet name input field
    const handlePetNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;

        const newPet = { ...pet };
        newPet.name = value;
        setPet(newPet);
    }

    return (
        <div className="flex-1 flex flex-col items-center px-2 py-10">
            <div className="bg-[url('/wizard.jpg')] bg-cover bg-center rounded-full w-3/5 aspect-square lg:p-15"></div>
            <div className="h-65 w-full p-4 flex flex-col items-center justify-center relative">
                <img src="/sign-up-box.svg" className="w-full transform scale-y-210 lg:w-4/5 lg:scale-y-110" />
                <div className="absolute top-6/11 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full flex flex-col items-center justify-center lg:w-4/5">
                    {user && user.pet_name && !isEditing && (
                        <div className="px-6 w-4/5 pb-5">
                            <h1 className="text-white text-center text-2xl mb-3">Your goals to prepare for the challenges ahead</h1>
                            <div className="flex flex-col w-full items-center gap-3">
                                {/* Macros Chart */}
                                <div className="w-full relative">
                                    <h1 className="text-white text-center text-3xl/5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">{user.daily_calorie_goal}<br /><span className="text-lg/0">kcal</span></h1>
                                    <NutritionChart dataValues={[user.daily_carb_goal, user.daily_fat_goal, user.daily_protein_goal]} labels={["carbs", "fats", "protein"]}/>
                                </div>
                                <div className="w-3/4">
                                    <div className="flex justify-between">
                                        <div className="text-white flex gap-2 items-center"><PiSneakerMoveFill color="#d14b3a" />Carbs</div>
                                        <p className="text-white">{`${(user.daily_calorie_goal*user.daily_carb_goal/100/4).toFixed()}g (${user.daily_carb_goal}%)`}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="text-white flex gap-2 items-center"><FaShieldAlt color="#4a6e37" />Fat</div>
                                        <p className="text-white">{`${(user.daily_calorie_goal*user.daily_fat_goal/100/9).toFixed()}g (${user.daily_fat_goal}%)`}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="text-white flex gap-2 items-center"><FaDumbbell color="#f0c046" />Protein</div>
                                        <p className="text-white">{`${(user.daily_calorie_goal*user.daily_protein_goal/100/4).toFixed()}g (${user.daily_protein_goal}%)`}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Page 1: Personal details form */}
                    {(user && !user.pet_name || isEditing) && page === 1 ? (
                        <UserDetailsForm
                            formRef={formRef}
                            userProfile={userProfile}
                            handleUserProfileChange={handleUserProfileChange}
                            isEditing={isEditing}
                        />
                    ) : page === 2 ? (
                        // Page 2: Display recommended calories and macros
                        <div className="px-6 w-4/5 pb-5">
                            <h1 className="text-white text-center text-2xl mb-3">Your goals to prepare for the challenges ahead</h1>
                            {dailyCaloriesAndMacros && (
                                <div className="flex flex-col w-full items-center gap-3">
                                    {/* Macros Chart */}
                                    <div className="w-full relative">
                                        <h1 className="text-white text-center text-3xl/5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">{dailyCaloriesAndMacros.calories}<br /><span className="text-lg/0">kcal</span></h1>
                                        <NutritionChart dataValues={[dailyCaloriesAndMacros?.carbs.inCalories, dailyCaloriesAndMacros?.fats.inCalories, dailyCaloriesAndMacros?.protein.inCalories]} labels={["carbs", "fats", "protein"]}/>
                                    </div>
                                    <div className="w-3/4">
                                        <div className="flex justify-between">
                                            <div className="text-white flex gap-2 items-center"><PiSneakerMoveFill color="#d14b3a" />Carbs</div>
                                            <p className="text-white">{`${dailyCaloriesAndMacros.carbs.grams.toFixed()}g (${dailyCaloriesAndMacros.carbs.percentage}%)`}</p>
                                        </div>
                                        <div className="flex justify-between">
                                            <div className="text-white flex gap-2 items-center"><FaShieldAlt color="#4a6e37" />Fat</div>
                                            <p className="text-white">{`${dailyCaloriesAndMacros.fats.grams.toFixed()}g (${dailyCaloriesAndMacros.fats.percentage}%)`}</p>
                                        </div>
                                        <div className="flex justify-between">
                                            <div className="text-white flex gap-2 items-center"><FaDumbbell color="#f0c046" />Protein</div>
                                            <p className="text-white">{`${dailyCaloriesAndMacros.protein.grams.toFixed()}g (${dailyCaloriesAndMacros.protein.percentage}%)`}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : page === 3 ? (
                        // Page 3: Pet selection and naming
                        <div className="px-6 w-4/5 flex flex-col gap-3">
                            <h1 className="text-white text-center text-2xl">Pick your loyal pet companion to aid you in your journey!</h1>
                            <div className="flex-1">
                                <Swiper
                                    slidesPerView={1}
                                    spaceBetween={30}
                                    pagination={{
                                      clickable: true,
                                    }}
                                    navigation={true}
                                    onSlideChange={handleSlideChange}
                                    modules={[Pagination, Navigation]}
                                >
                                    {pets.map((pet: keyof typeof petMoods) => {
                                        return (
                                            <SwiperSlide key={pet}>
                                                <div className="flex items-center h-50">
                                                    <img src={petMoods[pet].neutral} alt={`neutral ${pet}`} className="w-full h-full object-contain"/>
                                                </div>
                                            </SwiperSlide>
                                        )
                                    })}
                                </Swiper>  
                            </div>
                            {/* Pet name input */}
                            <form ref={formRef} className="px-6 w-full lg:w-3/5">
                                <div className="flex flex-col items-center">
                                    <label
                                        className="block text-white text-lg font-bold flex-1"
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
                    ) : null }
                </div>
            </div>

            {/* Navigation buttons */}
            <div className="mt-25 flex items-center justify-center gap-5">
                <button className={`bg-[url('/button-box.svg')] bg-cover bg-center h-20 w-30 cursor-pointer ${page === 1 ? "hidden" : "block"}`} onClick={handleBackClick}>
                    <h1 className="text-white">Back</h1>
                </button>
                <button className={`bg-[url('/button-box.svg')] bg-cover bg-center h-20 w-30 cursor-pointer ${user && !user.pet_name || isEditing ? "block" : "hidden"}`} onClick={handleNextClick}>
                    <h1 className="text-white">Next</h1>
                </button>
                <button className={`bg-[url('/button-box.svg')] bg-cover bg-center h-20 w-30 cursor-pointer ${!isEditing && user && user.pet_name ? "block" : "hidden"}`} onClick={handleEditClick}>
                    <h1 className="text-white">Edit</h1>
                </button>
                
            </div>
        
        </div>
    )
}

export default Preferences
