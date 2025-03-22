export const activityLevels = [
    "Little or no exercise", 
    "Light exercise 1-3 days/week", 
    "Moderate exercise 3-5 days/week", 
    "Hard exercise 6-7 days/week", 
    "Intense exercise"
];

export const goals = ["Maintain weight", "Lose weight", "Gain muscles"];

export const pets: ("orangeDragon" | "blackDragon" | "blueDragon" | "greenDragon" | "redDragon" | "whiteDragon" | "yellowDragon")[] = ["orangeDragon", "blackDragon", "blueDragon", "greenDragon", "redDragon", "whiteDragon", "yellowDragon"];

export const petMoods = {
    orangeDragon: {
        happy: "/dragon_orange_happy.png",
        neutral: "/dragon_orange_neutral.png",
        sad: "/dragon_orange_sad.png",
    },
    blackDragon: {
        happy: "/Dragon_Black_Happy.png",
        neutral: "/Dragon_Black_Neutral.png",
        sad: "/Dragon_Black_Sad.png",
    },
    blueDragon: {
        happy: "/Dragon_Blue_Happy.png",
        neutral: "/Dragon_Blue_Neutral.png",
        sad: "/Dragon_Blue_Sad.png",
    },
    greenDragon: {
        happy: "/Dragon_Green_Happy.png",
        neutral: "/Dragon_Green_Neutral.png",
        sad: "/Dragon_Green_Sad.png",
    },
    redDragon: {
        happy: "/Dragon_Red_Happy.png",
        neutral: "/Dragon_Red_Neutral.png",
        sad: "/Dragon_Red_Sad.png",
    },
    whiteDragon: {
        happy: "/Dragon_White_Happy.png",
        neutral: "/Dragon_White_Neutral.png",
        sad: "/Dragon_White_Sad.png",
    },
    yellowDragon: {
        happy: "/Dragon_Yellow_Happy.png",
        neutral: "/Dragon_Yellow_Neutral.png",
        sad: "/Dragon_Yellow_Sad.png",
    },
};

export const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"];

export const enemies: ("blob" | "goblin" | "skeleton" | "troll")[] = ["blob", "goblin", "skeleton", "troll"];

export const enemyProfile = {
    blob: {
        imageUrl: "/enemy_blob.png",
        stats: {
            calorieExp: 0,
            carbExp: 0,
            proteinExp: 0,
            fatExp: 0,
            wisdomExp: 0,
        }
    },
    goblin: {
        imageUrl: "/enemy_goblin.png",
        stats: {
            calorieExp: 0,
            carbExp: 0,
            proteinExp: 100,
            fatExp: 0,
            wisdomExp: 100,
        }
    },
    skeleton: {
        imageUrl: "/enemy_skeleton.png",
        stats: {
            calorieExp: 0,
            carbExp:100,
            proteinExp: 100,
            fatExp: 0,
            wisdomExp: 100,
        }
    },
    troll: {
        imageUrl: "/enemy_troll.png",
        stats: {
            calorieExp: 100,
            carbExp:100,
            proteinExp: 100,
            fatExp: 100,
            wisdomExp: 100,
        }
    }
}