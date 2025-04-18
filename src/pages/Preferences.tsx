import { useState, useRef, useEffect } from "react";
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
import { PiSneakerMoveFill, PiSwordFill } from "react-icons/pi";
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
    const [screenHeight, setScreenHeight] = useState(window.innerHeight);

    const { user, session, setUser } = useAuth();
    const navigate = useNavigate();
    const formRef = useRef<HTMLFormElement | null>(null);
    
    const handleNextClick = async (event: React.MouseEvent) => {
        if (page === 1) {
            event.preventDefault();

            if (formRef.current) {
                const isFormValid = formRef.current.checkValidity(); // Check if the form is valid

                // Trigger browser validation messages if invalid
                if (!isFormValid) {
                    formRef.current.reportValidity(); 
                    return;
                }

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

                const updatedUser = { ...user };
                updatedUser.daily_calorie_goal = dailyCaloriesAndMacros!.calories;
                updatedUser.daily_carb_goal = dailyCaloriesAndMacros!.carbs.percentage;
                updatedUser.daily_fat_goal = dailyCaloriesAndMacros!.fats.percentage;
                updatedUser.daily_protein_goal = dailyCaloriesAndMacros!.protein.percentage;
                updatedUser.pet_name = pet.name;
                updatedUser.pet_img_happy = pet.imageUrl.happy;
                updatedUser.pet_img_normal = pet.imageUrl.neutral;
                updatedUser.pet_img_sad = pet.imageUrl.sad;
                setUser(updatedUser);

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

    useEffect(() => {
        const handleResize = () => {
          setScreenHeight(window.innerHeight);
        };
    
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      }, []);
    
      const getHeightStyle = () => {
        if (screenHeight <= 800) return "auto";
        return "100vh";
      }; 
    
      const getPaddingStyle = () => {
        if (screenHeight <= 800) return "";
        return "15px"; 
      };

      const getMarginStyle = () => {
        if (screenHeight <= 800) return "400px";
        return "460px"; 
      };

    return (
        <div 
            className="flex flex-col items-center px-5 pb-10 relative pt-8"
            style={{
                height: getHeightStyle(),
                paddingTop: getPaddingStyle(),
            }}
        >
            <div className="bg-[url('/wizard.jpg')] bg-cover bg-[center_left_0.5rem] rounded-full w-2/5 aspect-square lg:p-15"></div>
            
            <div className="absolute top-2/5 left-1/2 transform -translate-x-1/2 -translate-y-2/5 flex items-center justify-center bg-[url('/input_field.png')] bg-cover bg-center aspect-3/4 w-9/10 md:bg-[url('/sign-up-box.svg')] md:bg-cover lg:bg-cover lg:w-3/5">
                <div className=" w-4/5 h-full flex flex-col items-center justify-center md:w-3/5 lg:w-3/5">
                    {user && user.pet_name && !isEditing && (
                        <div className="w-full pb-5">
                            <h1 className="text-white text-center text-2xl mb-3 p-4">Your goals to prepare for the challenges ahead</h1>
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
                                        <div className="text-white flex gap-2 items-center"><PiSwordFill color="#f0c046" />Protein</div>
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
                        <div className="w-full pb-5">
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
                                            <div className="text-white flex gap-2 items-center"><PiSwordFill color="#f0c046" />Protein</div>
                                            <p className="text-white">{`${dailyCaloriesAndMacros.protein.grams.toFixed()}g (${dailyCaloriesAndMacros.protein.percentage}%)`}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : page === 3 ? (
                        // Page 3: Pet selection and naming
                        <div className="w-full flex flex-col gap-3">
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
            <div 
                className="flex items-center justify-center gap-5"
                style={{
                    marginTop: getMarginStyle(),
                }}
            >
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
