import React from 'react';
import { useAuth } from '../Auth/AuthContext';
import wizard from '../assets/welcome_wizard.png'; 

const Home: React.FC = () => {

  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold underline text-white mb-8">
        {`Welcome to Arcane Kitchen${user ? `, ${user?.username}!` : `!` }`}
      </h1>
      <img src={wizard} alt="Welcome Wizard" className="w-1/2 mb-8" />
    </div>
  );
};

export default Home;