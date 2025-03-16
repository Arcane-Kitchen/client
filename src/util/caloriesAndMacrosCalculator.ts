const calculateDailyCaloriesAndMacrosIntake = (gender: string, weight: number, height:number, age:number, activityFactor:number, goal:string) => {
    
    // Calculate basal metabolic rate (BMR) using Mifflin-St Jeor Equation
    let BMR = (10 * weight) + (6.25 * height) - (5 * age);
    if (gender === "M") {
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
    if (activityFactor === 1) {
        TDEE = BMR * 1.2;
    } else if (activityFactor === 2) {
        TDEE = BMR * 1.375;
    } else if (activityFactor === 3) {
        TDEE = BMR * 1.55;
    } else if (activityFactor === 4) {
        TDEE = BMR * 1.725;
    } else {
        TDEE = BMR * 1.9;
    }

    // Allocate calories to macros based on goals
    // Weight Loss
    // Maintenance
    // Muscle Gain
    let protein = weight * 1.6;
    let fats = (TDEE * 0.25 ) / 9;
    
    // Adjust for specific goals
    if (goal === "weight loss") {
        protein = weight * 1.7;
    } else if (goal === "muscle gain") {
        protein = weight * 2.5;
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

    return {
        protein: { "grams": protein, "percentage": proteinPercentage},
        fats: { "grams": fats, "percentage": fatPercentage },
        carbs: { "grams": carbs, "percentage": carbsPercentage },
    }
}
