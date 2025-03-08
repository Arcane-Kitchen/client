import React from 'react';
import { useAuth } from './Auth/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {

  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
        await signOut();
        navigate('/login');
    } catch (error) {
        console.error('An error occured: ', error)
    }
  }

  return (
    <div className="bg-[url('./assets/background.png')] bg-cover min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold underline text-white mb-8">
        Welcome to Arcane Kitchen!
      </h1>
      <button 
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={handleLogout}>
          Logout
      </button>
    </div>
  );
};

export default Home;