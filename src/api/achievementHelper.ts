import { supabase } from './supabaseClient';
import { toast } from 'react-toastify';

export const checkForAchievements = async (userId: string) => {
  try {
    // Check for "First Recipe Added" achievement
    const { data: addRecipeActivityCount, error: addRecipeCountError } = await supabase
      .from('User_Activity')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .eq('activity_type', 'add_recipe');

    if (addRecipeCountError) {
      throw addRecipeCountError;
    }

    if (addRecipeActivityCount.length === 1) {
      const { data: addRecipeAchievementData, error: addRecipeAchievementError } = await supabase
        .from('Achievement')
        .select('id')
        .eq('name', 'First Recipe Added')
        .single();

      if (addRecipeAchievementError) {
        throw addRecipeAchievementError;
      }

      // Check if the achievement already exists for the user
      const { data: existingAchievement, error: existingAchievementError } = await supabase
        .from('User_Achievement')
        .select('*')
        .eq('user_id', userId)
        .eq('reward_id', addRecipeAchievementData.id)
        .single();

      if (existingAchievementError && existingAchievementError.code !== 'PGRST116') {
        throw existingAchievementError;
      }

      if (!existingAchievement) {
        const { data: userAddRecipeAchievementData, error: userAddRecipeAchievementError } = await supabase
          .from('User_Achievement')
          .insert([{ user_id: userId, reward_id: addRecipeAchievementData.id, date_earned: new Date().toISOString() }]);

        if (userAddRecipeAchievementError) {
          throw userAddRecipeAchievementError;
        }

        toast.success('Achievement unlocked: First Recipe Added');
      }
    }

    // Check for "First Meal Cooked" achievement
    const { data: cookMealActivityCount, error: cookMealCountError } = await supabase
      .from('User_Activity')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .eq('activity_type', 'cook_meal');

    if (cookMealCountError) {
      throw cookMealCountError;
    }

    if (cookMealActivityCount.length === 1) {
      const { data: cookMealAchievementData, error: cookMealAchievementError } = await supabase
        .from('Achievement')
        .select('id')
        .eq('name', 'First Meal Cooked')
        .single();

      if (cookMealAchievementError) {
        throw cookMealAchievementError;
      }

      // Check if the achievement already exists for the user
      const { data: existingCookMealAchievement, error: existingCookMealAchievementError } = await supabase
        .from('User_Achievement')
        .select('*')
        .eq('user_id', userId)
        .eq('reward_id', cookMealAchievementData.id)
        .single();

      if (existingCookMealAchievementError && existingCookMealAchievementError.code !== 'PGRST116') {
        throw existingCookMealAchievementError;
      }

      if (!existingCookMealAchievement) {
        const { data: userCookMealAchievementData, error: userCookMealAchievementError } = await supabase
          .from('User_Achievement')
          .insert([{ user_id: userId, reward_id: cookMealAchievementData.id, date_earned: new Date().toISOString() }]);

        if (userCookMealAchievementError) {
          throw userCookMealAchievementError;
        }

        toast.success('Achievement unlocked: First Meal Cooked');
      }
    }

    // Check for "First Enemy Defeated" achievement
    const { data: defeatEnemyActivityCount, error: defeatEnemyCountError } = await supabase
      .from('User_Activity')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .eq('activity_type', 'fight_win');

    if (defeatEnemyCountError) {
      throw defeatEnemyCountError;
    }

    if (defeatEnemyActivityCount.length === 1) {
      const { data: defeatEnemyAchievementData, error: defeatEnemyAchievementError } = await supabase
        .from('Achievement')
        .select('id')
        .eq('name', 'First Enemy Defeated')
        .single();

      if (defeatEnemyAchievementError) {
        throw defeatEnemyAchievementError;
      }

      // Check if the achievement already exists for the user
      const { data: existingDefeatEnemyAchievement, error: existingDefeatEnemyAchievementError } = await supabase
        .from('User_Achievement')
        .select('*')
        .eq('user_id', userId)
        .eq('reward_id', defeatEnemyAchievementData.id)
        .single();

      if (existingDefeatEnemyAchievementError && existingDefeatEnemyAchievementError.code !== 'PGRST116') {
        throw existingDefeatEnemyAchievementError;
      }

      if (!existingDefeatEnemyAchievement) {
        const { data: userDefeatEnemyAchievementData, error: userDefeatEnemyAchievementError } = await supabase
          .from('User_Achievement')
          .insert([{ user_id: userId, reward_id: defeatEnemyAchievementData.id, date_earned: new Date().toISOString() }]);

        if (userDefeatEnemyAchievementError) {
          throw userDefeatEnemyAchievementError;
        }

        toast.success('Achievement unlocked: First Enemy Defeated');
      }
    }
  } catch (error) {
    console.error('Error checking for achievements:', error);
  }
};