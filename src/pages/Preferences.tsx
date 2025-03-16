import { useState } from "react";
import { UserProfile } from "../types";

const Preferences = () => {

    const [userProfile, setUserProfile] = useState<UserProfile>({
        gender: "",
        age: "",
        weight: "",
        height: "",
        activityLevel: "Little or no exercise",
        goal: "Maintain weight"
    })

    const handleClick = () => {

    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = event.target;
        const key = id as keyof UserProfile;

        const updatedUserProfile = { ...userProfile };
        updatedUserProfile[key] = value;

        setUserProfile(updatedUserProfile);
    }

    return (
        <div className="flex-1 flex flex-col items-center px-2 py-10">
            <div className="bg-[url('/wizard.jpg')] bg-cover bg-center rounded-full w-3/5 aspect-square lg:p-15">
            </div>
            <div className="h-50 w-full p-4 flex flex-col items-center justify-center relative">
                <img src="/sign-up-box.svg" className="w-full transform scale-y-180 lg:w-4/5 lg:scale-y-110" />
                <div className="absolute top-3/5 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full flex flex-col items-center justify-center lg:w-4/5">
                    <form className="px-6 w-4/5 lg:w-3/5">

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
                                        id="gender"
                                        value="Female"
                                        checked={userProfile.gender === "Female"}
                                        onChange={handleChange}
                                        className='border-solid border-gray-200 border-1 inset-shadow-xs p-1' 
                                    />
                                    <label className="block text-white font-bold flex-1" htmlFor="Female"> Female</label>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input 
                                        type="radio"
                                        id="gender"
                                        value="Male"
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
                                type="number"
                                placeholder="e.g. 27"
                                value={userProfile.age}
                                required={true}
                                onChange={handleChange}
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
                            type="number"
                            placeholder="e.g. 72"
                            value={userProfile.weight}
                            required={true}
                            onChange={handleChange}
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
                            type="number"
                            placeholder="e.g. 173"
                            value={userProfile.height}
                            required={true}
                            onChange={handleChange}
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
                                className="shadow appearance-none rounded w-2/3 py-2 px-3 text-gray-700 mb-2 leading-tight focus:outline-none focus:shadow-outline bg-white"
                                value={userProfile.activityLevel} 
                                onChange={handleChange}
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
                                className="shadow appearance-none rounded w-2/3 py-2 px-3 text-gray-700 mb-2 leading-tight focus:outline-none focus:shadow-outline bg-white"
                                value={userProfile.goal} 
                                onChange={handleChange}
                            >
                                <option value="Maintain weight">Maintain weight</option>
                                <option value="Lose weight">Lose weight</option>
                                <option value="Gain muscles">Gain muscles</option>
                            </select>
                        </div>
                    </form>
                </div>
            </div>

            {/* Next Button */}
            <div className="mt-25 flex items-center justify-center">
                <button className="bg-[url('/button-box.svg')] bg-cover bg-center h-20 w-30 cursor-pointer" onClick={handleClick}>
                    <h1 className="text-white">Next</h1>
                </button>
            </div>
        
        </div>
    )
}

export default Preferences
