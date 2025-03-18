import { UserProfile } from "../types";
import { activityLevels, goals } from "./constants";

export const calculateDailyCaloriesAndMacrosIntake = (userProfile: UserProfile) => {
    
    const { gender, weight, height, age, activityLevel, goal } = userProfile;
    // Calculate basal metabolic rate (BMR) using Mifflin-St Jeor Equation
    let BMR = (10 * parseInt(weight, 10)) + (6.25 * parseInt(height, 10)) - (5 * parseInt(age, 10));
    if (gender === "Male") {
        BMR+= 5;
    } else {
        BMR-= 161;
    }

    // Calculate total daily energy expenditure (TDEE) by multiplying BMR by an activity factor
    let TDEE = 0;
    if (activityLevel === activityLevels[0]) { // Sedentary
        TDEE = BMR * 1.2;
    } else if (activityLevel === activityLevels[1]) { // Lightly Active
        TDEE = BMR * 1.375;
    } else if (activityLevel === activityLevels[2]) { // Moderately Active
        TDEE = BMR * 1.55;
    } else if (activityLevel === activityLevels[3]) { // Active
        TDEE = BMR * 1.725;
    } else { // Extremely Active
        TDEE = BMR * 1.9;
    }

    // Default macro breakdown (Maintenance)
    let protein = parseInt(weight, 10) * 1.6;
    let fats = (TDEE * 0.25 ) / 9;
    
    // Adjust for specific goals
    if (goal === goals[1]) { // Lose weight
        protein = parseInt(weight, 10) * 1.7;
        fats = (TDEE * 0.3) / 9
    } else if (goal === goals[2]) { // Gain muscle
        protein = parseInt(weight, 10) * 2.5;
        fats = (TDEE * 0.3) / 9;
    }

    // Calculate carbs (remaining calories after protein and fats)
    const proteinCalories = protein * 4;
    const fatCalories = fats * 9;
    const remainingCalories = TDEE - (proteinCalories + fatCalories);
    const carbs = remainingCalories / 4;

    // Calculate macronutrient percentages
    const proteinPercentage = Math.round((proteinCalories / TDEE) * 100);
    const fatPercentage = Math.round((fatCalories / TDEE) * 100);
    let carbsPercentage = Math.round((remainingCalories / TDEE) * 100);

    // Adjust rounding to ensure percentages sum to 100
    let totalRounded = proteinPercentage + fatPercentage + carbsPercentage;

    if (totalRounded !== 100) {
        const difference = 100 - totalRounded;
        carbsPercentage += difference;
    }

    return {
        calories: Math.round(TDEE),
        protein: { "grams": protein, "inCalories": proteinCalories, "percentage": proteinPercentage},
        fats: { "grams": fats, "inCalories": fatCalories, "percentage": fatPercentage },
        carbs: { "grams": carbs, "inCalories": remainingCalories, "percentage": carbsPercentage },
    }
}
