import React from "react";
import { UserProfile } from "../types";
import { activityLevels, goals } from "../util/constants";


interface UserDetailsFormProps {
    userProfile: UserProfile;
    handleUserProfileChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    formRef: React.RefObject<HTMLFormElement | null>;
    isEditing: boolean;
}

const UserDetailsForm: React.FC<UserDetailsFormProps> = ({ userProfile, handleUserProfileChange, formRef, isEditing }) => {
  return (
    <form ref={formRef} className="px-6 w-4/5 lg:w-3/5">
        <h1 className="text-white text-center text-2xl mb-3">{isEditing ? "Update your details to continue your adventure!" : "Enter your details to begin your adventure!"}</h1>

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
                        onChange={handleUserProfileChange}
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
                {activityLevels.map((activityLevel) => (
                    <option key={activityLevel} value={activityLevel}>{activityLevel}</option>
                ))}
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
                {goals.map((goal) => (
                    <option key={goal} value={goal}>{goal}</option>
                ))}
            </select>
        </div>
    </form>
  )
}

export default UserDetailsForm;
