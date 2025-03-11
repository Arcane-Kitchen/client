import OpenAI from 'openai';
import { Recipe } from '../types'; 
import { addRecipeToDatabase } from './recipeApi'; 
import { uploadImage } from './imageUpload'; 

// Set up OpenAI API configuration
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY as string,
  dangerouslyAllowBrowser: true, // Allow usage in browser environment
});

export const parseRecipeWithAI = async (rawText: string): Promise<Recipe> => {
  const prompt = `
  Extract the following details from the raw recipe text:
  - Name
  - Description
  - Ingredients (quantity, unit, description)
  - Instructions
  - Nutrition (calories, macronutrients)
  - Prep time
  - Difficulty(EASY,INTERMEDIATE,HARD)
  - Meal type

  Raw recipe text:
  ${rawText}

  Output the details in the following JSON format without triple backticks:
  {
      "name": "string",
      "description": "string",
      "image": null,
      "difficulty": "string",
      "prep_time": int,
      "instructions": ["string"],
      "nutrition": {
          "calories": int,
          "macronutrients": {
              "fat": {"unit": "string", "amount": int, "percentage": int},
              "carbs": {"unit": "string", "amount": int, "percentage": int},
              "protein": {"unit": "string", "amount": int, "percentage": int}
          }
      },
      "meal_type": ["string"],
      "ingredients": {
          "ingredient_name": {"quantity": int, "unit": "string", "description": "string"}
      }
  }
  `;

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: prompt },
    ],
    max_tokens: 1500,
    temperature: 0.7,
  });

  const messageContent = response.choices[0]?.message?.content?.trim();
  if (!messageContent) {
    throw new Error('Failed to parse recipe: response content is null or undefined');
  }

  // Remove any triple backticks from the response
  const cleanedContent = messageContent.replace(/```json|```/g, '');

  try {
    return JSON.parse(cleanedContent);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    throw new Error('Failed to parse recipe: invalid JSON format');
  }
};

export const generateImageWithAI = async (recipeName: string): Promise<Blob> => {
  const prompt = `Create an image of the recipe "${recipeName}" served on a medieval plate.`;

  const response = await openai.images.generate({
    prompt: prompt,
    n: 1,
    size: '512x512',
  });

  const imageUrl = response.data[0]?.url;
  if (!imageUrl) {
    throw new Error('Failed to generate image: imageUrl is undefined');
  }

  // Use the no-cors mode to fetch the image
  const imageResponse = await fetch(imageUrl, { mode: 'no-cors' });
  const imageBlob = await imageResponse.blob();

  return imageBlob;
};

export const addRecipeFromRawText = async (rawText: string): Promise<void> => {
  try {
    const recipe = await parseRecipeWithAI(rawText);

    // Generate the image using OpenAI
    const imageBlob = await generateImageWithAI(recipe.name);

    // Upload the image and get the public URL
    const imageFile = new File([imageBlob], `${recipe.name}.png`, { type: 'image/png' });
    const imageUrl = await uploadImage(imageFile, 'arcane-kitchen-images', `recipes/${imageFile.name}`);
    recipe.image = imageUrl;

    await addRecipeToDatabase(recipe);
    console.log('Recipe added successfully!');
  } catch (error) {
    console.error('Error adding recipe:', error);
    throw error;
  }
};