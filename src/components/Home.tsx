import React from 'react';
import { useAuth } from './Auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import wizard from '../assets/welcome_wizard.png'; 

const Home: React.FC = () => {

  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
        await signOut();
        navigate('/login');
    } catch (error) {
        console.error('An error occurred: ', error)
    }
  }

  return (
    <div className="bg-[url('./assets/background.png')] bg-cover min-h-screen flex flex-col items-center justify-center pt-16">
           <Navbar />
      <h1 className="text-3xl font-bold underline text-white mb-8">
        Welcome to Arcane Kitchen!
      </h1>
      <img src={wizard} alt="Welcome Wizard" className="w-1/2 mb-8" /> 
      <button 
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={handleLogout}>
          Logout
      </button>
    </div>
  );
};

export default Home;