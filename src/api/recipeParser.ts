// import OpenAI from 'openai';
import { Recipe } from '../types'; 
import { addRecipeToDatabase } from './recipeApi'; 
// import { uploadImage } from './imageUpload'; 

const baseUrl = import.meta.env.VITE_API_BASE_URL as string;
// Set up OpenAI API configuration
// const openai = new OpenAI({
//   apiKey: import.meta.env.VITE_OPENAI_API_KEY as string,
//   dangerouslyAllowBrowser: true, // Allow usage in browser environment
// });

export const parseRecipeWithAI = async (rawText: string): Promise<Recipe> => {
  try {
    const response = await fetch(`${baseUrl}/api/parse-recipe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rawText }),
    });

    if (!response.ok) {
      throw new Error('Failed to parse recipe');
    }

    const recipe = await response.json();
    return recipe;
  } catch (error) {
    console.error('Error parsing recipe:', error);
    throw error;
  }
};

export const generateImageWithAI = async (recipeName: string): Promise<Blob> => {
  try {
    const response = await fetch(`${baseUrl}/api/generate-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ recipeName }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate image');
    }

    const imageBlob = await response.blob();
    return imageBlob;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
};

export const addRecipeFromRawText = async (rawText: string, userId: string): Promise<{ success: boolean; message: string; recipe?: Recipe }> => {
  try {
    const recipe = await parseRecipeWithAI(rawText);

    // Generate the image using OpenAI (commented out for now)
    // const imageBlob = await generateImageWithAI(recipe.name);

    // Upload the image and get the public URL (commented out for now)
    // const imageFile = new File([imageBlob], `${recipe.name}.png`, { type: 'image/png' });
    // const imageUrl = await uploadImage(imageFile, 'arcane-kitchen-images', `recipes/${imageFile.name}`);
    // recipe.image = imageUrl;

    const newRecipe: Recipe[] = await addRecipeToDatabase({ ...recipe, user_id: userId });
    return { success: true, message: 'Recipe added successfully!', recipe: newRecipe[0] };
  } catch (error) {
    console.error('Error adding recipe:', error);
    throw error;
  }
};