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
      console.log('Setting up subscription for user:', user.id);

      const subscription = supabase
        .channel('User_Activity')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'User_Activity', filter: `user_id=eq.${user.id}` }, (payload) => {
          console.log('New activity:', payload);
          checkForAchievements(user.id);
        })
        .subscribe();

      console.log('Subscription set up:', subscription);

      return () => {
        console.log('Removing subscription for user:', user.id);
        supabase.removeChannel(subscription);
      };
    }
  }, [user]);

  return <>{children}</>;
};

export default AchievementSubscriptionProvider;