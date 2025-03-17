import { UserProfile } from "../types";

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
    // Sedentary: BMR x 1.2 
    // Lightly Active: BMR x 1.375 
    // Moderately Active: BMR x 1.55 
    // Active: BMR x 1.725 
    // Extremely Active: BMR x 1.9 
    let TDEE = 0;
    if (activityLevel === "Little or no exercise") {
        TDEE = BMR * 1.2;
    } else if (activityLevel === "Light exercise 1-3 days/week") {
        TDEE = BMR * 1.375;
    } else if (activityLevel === "Moderate exercise 3-5 days/week") {
        TDEE = BMR * 1.55;
    } else if (activityLevel === "Hard exercise 6-7 days/week") {
        TDEE = BMR * 1.725;
    } else {
        TDEE = BMR * 1.9;
    }

    // Allocate calories to macros based on goals (e.g weight loss, maintenance, muscle gain)
    let protein = parseInt(weight, 10) * 1.6;
    let fats = (TDEE * 0.25 ) / 9;
    
    // Adjust for specific goals
    if (goal === "weight loss") {
        protein = parseInt(weight, 10) * 1.7;
    } else if (goal === "muscle gain") {
        protein = parseInt(weight, 10) * 2.5;
        fats = (TDEE * 0.30 ) / 9;
    }

    // Calculate carbs (remaining calories after protein and fats)
    const proteinCalories = protein * 4;
    const fatCalories = fats * 9;
    const remainingCalories = TDEE - (proteinCalories + fatCalories);
    const carbs = remainingCalories / 4;

    // Calculate macronutrient percentages
    const proteinPercentage = (proteinCalories / TDEE) * 100;
    const fatPercentage = (fatCalories / TDEE) * 100;
    const carbsPercentage = (remainingCalories / TDEE) * 100;

    // Round each macro percentage to nearest integer
    const roundedProtein = Math.round(proteinPercentage);
    const roundedFats = Math.round(fatPercentage);
    let roundedCarbs = Math.round(carbsPercentage);

    // Calculate the sum of rounded percentages
    let totalRounded = roundedProtein + roundedFats + roundedCarbs;

    if (totalRounded !== 100) {
        const difference = 100 - totalRounded;
        roundedCarbs += difference;
    }

    return {
        calories: Math.round(TDEE),
        protein: { "grams": protein, "inCalories": proteinCalories, "percentage": roundedProtein},
        fats: { "grams": fats, "inCalories": fatCalories, "percentage": roundedFats },
        carbs: { "grams": carbs, "inCalories": remainingCalories, "percentage": roundedCarbs },
    }
}
