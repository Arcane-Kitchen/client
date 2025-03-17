import React from 'react';
import { useNavigate } from 'react-router-dom';

const Achievements: React.FC = () => {
  const navigate = useNavigate();

  const handleViewAchievements = () => {
    navigate('/achievements');
  };

  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{
        backgroundImage: `url(/achievement-box.svg)`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        width: '600px',
        height: '400px',
      }}
    >
      <h2 className="text-2xl font-bold text-center text-black mt-8">
        Achievements
      </h2>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={handleViewAchievements}
      >
        View Achievements
      </button>
    </div>
  );
};

export default Achievements;
