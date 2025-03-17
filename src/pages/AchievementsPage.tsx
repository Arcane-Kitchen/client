import React, { useEffect, useState } from 'react';
import { useAuth } from '../Auth/AuthContext';
import { supabase } from '../api/supabaseClient';

interface Achievement {
  id: number;
  user_id: string;
  reward_id: number;
  date_earned: string;
  achievement_name: string;
  achievement_description: string;
  achievement_img: string;
}

const AchievementsPage: React.FC = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('User_Achievement')
          .select(`
            user_id,
            reward_id,
            date_earned,
            achievement:reward_id(name, description, img)
          `)
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching achievements:', error);
        } else {
          const formattedAchievements = data.map((achievement: any) => ({
            ...achievement,
            achievement_name: achievement.achievement.name,
            achievement_description: achievement.achievement.description,
            achievement_img: achievement.achievement.img,
          }));
          setAchievements(formattedAchievements);
        }
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center pb-16">
      <div
        className="bg-[url('/paper-box.jpg')] bg-repeat w-5/6 h-[80vh] flex flex-col items-center justify-around p-4"
      >
        <h2 className="text-2xl font-bold text-center text-black mt-8">
          Achievements
        </h2>
        <ul className="list-none mt-4 w-full">
          {achievements.map((achievement) => (
            <li key={achievement.reward_id} className="flex items-center justify-between mb-4 p-4 bg-[url('/achievement-box.svg')] bg-cover bg-center w-1/2">
              <div className="flex flex-col ml-4">
                <span className="font-bold text-lg">{achievement.achievement_name}</span>
                <span>{achievement.achievement_description}</span>
                <span>{new Date(achievement.date_earned).toLocaleDateString()}</span>
              </div>
              <img src={achievement.achievement_img} alt={achievement.achievement_name} className="w-16 h-16 mr-4 object-cover" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AchievementsPage;