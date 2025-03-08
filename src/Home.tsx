import React from 'react';
import Navbar from './Navbar';
import wizard from './assets/welcome_wizard.png'; 
const Home: React.FC = () => {
  return (
    <div className="bg-[url('./assets/background.png')] bg-cover min-h-screen flex flex-col items-center justify-center pt-16">
      <Navbar />
      <h1 className="text-3xl font-bold underline text-white mb-8">
        Welcome to Arcane Kitchen!
      </h1>
      <img src={wizard} alt="Welcome Wizard" className="w-1/2 mb-8" /> 
    </div>
  );
};

export default Home;