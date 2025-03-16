import React, { useEffect } from 'react';
import { useAuth } from '../Auth/AuthContext';
import { supabase } from '../api/supabaseClient';
import { checkForAchievements } from '../api/achievementHelper';

interface Props {
  children: React.ReactNode;
}

const AchievementSubscriptionProvider: React.FC<Props> = ({ children }) => {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {

      const subscription = supabase
        .channel('User_Activity')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'User_Activity', filter: `user_id=eq.${user.id}` }, (payload) => {
          checkForAchievements(user.id);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, [user]);

  return <>{children}</>;
};

export default AchievementSubscriptionProvider;