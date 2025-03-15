import { supabase } from './supabaseClient';

export const checkForAchievements = async (userId: string) => {
  try {
    console.log('Checking for achievements for user:', userId);

    // Example logic to check for a specific achievement
    const { data: activityCount, error: countError } = await supabase
      .from('User_Activity')
      .select('*', { count: 'exact' })
      .eq('user_id', userId);

    if (countError) {
      throw countError;
    }

    console.log('Activity count:', activityCount);

    if (activityCount.length === 1) {
      // Get the reward_id for the achievement
      const { data: achievementData, error: achievementError } = await supabase
        .from('Achievement')
        .select('id')
        .eq('name', 'First Recipe Added')
        .single();

      if (achievementError) {
        throw achievementError;
      }

      console.log('Achievement data:', achievementData);

      // Save achievement to user_achievement table
      const { data: userAchievementData, error: userAchievementError } = await supabase
        .from('User_Achievement')
        .insert([{ user_id: userId, reward_id: achievementData.id, date_earned: new Date().toISOString() }]);

      if (userAchievementError) {
        throw userAchievementError;
      }

      console.log('User achievement data:', userAchievementData);
      console.log('Achievement unlocked: First Recipe Added');
    }
  } catch (error) {
    console.error('Error checking for achievements:', error);
  }
};