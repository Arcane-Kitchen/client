import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="bg-[url('./assets/background.png')] bg-cover min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold underline text-white mb-8">
        Welcome to Arcane Kitchen!
      </h1>
    </div>
  );
};

export default Home;