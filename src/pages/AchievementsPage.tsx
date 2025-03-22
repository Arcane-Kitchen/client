import React, { useEffect, useState } from 'react';
import { useAuth } from '../Auth/AuthContext';
import { supabase } from '../api/supabaseClient';
import { FadeLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      if (user) {
        setIsLoading(true);
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
        setIsLoading(false);
      }
    };

    fetchAchievements();
  }, [user]);

  return (
    <div className="h-full flex flex-col items-center justify-center pb-16">
      <div className="bg-[url('/paper-box.jpg')] bg-cover bg-center min-h-[80vh] max-h-fit w-11/12 md:w-5/6 h-fit flex flex-col items-center justify-around p-4 pt-2">
        {isLoading ? (
          // Show loading spinner while data is being fetched
          <FadeLoader />
          ) : user && !user.pet_name ? (
            <div className="flex-1 flex flex-col items-center gap-2 p-2">
              <div className="bg-[url('/wizard.jpg')] bg-cover bg-center rounded-full w-2/5 aspect-square"></div>
              <h1 className="text-2xl text-center mb-5">Ah, brave traveler! Almost there—finish setting up your profile, and you’ll be ready to embark on your journey!</h1>
              <button
                className="bg-[url('/button-box.svg')] bg-center bg-cover h-20 w-30"
                onClick={() => navigate("/preferences")}
              >
                <h1 className="text-white text-base/5">Set <br /> Preferences</h1>
              </button>
            </div>
          ) : achievements.length > 0 ? (
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-center text-black mt-4 mb-4">
              Achievements
            </h2>
            <ul className="list-none w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <li key={achievement.reward_id} className="flex flex-col items-center justify-between mb-4 p-4 bg-[url('/achievement-box.svg')] bg-cover bg-center w-full h-full rounded-lg shadow-md">
                  <img src={achievement.achievement_img} alt={achievement.achievement_name} className="w-16 h-16 mb-4 object-cover" />
                  <div className="flex flex-col items-center text-white">
                    <span className="font-bold text-lg">{achievement.achievement_name}</span>
                    <span className="text-center">{achievement.achievement_description}</span>
                    <span className="text-sm text-gray-300">{new Date(achievement.date_earned).toLocaleDateString()}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          ) : (
            <div className="text-2xl">No achievements yet</div>
          )
        }
      </div>
    </div>
  );
};

export default AchievementsPage;