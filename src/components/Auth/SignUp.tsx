import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { createNewUser } from "../../api/userApi";
import signUpBox from '../../assets/sign-up-box.svg';
import background from '../../assets/background.png';

const SignUp: React.FC = () => {

  const [signUpForm, setSignUpForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  // Handles changes in the form input fields
  const handleChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;

    // Validate password length
    if (id === "password" && value.length < 6) {
      setError("Please enter at least 6 digits.");
    } else {
      setError("");
    }

    // Validate password confirmation
    if (id === "confirmPassword" && value!= signUpForm.password) {
        setError("Passwords don't match.");
    } else {
      setError("");
    }

    const updatedSignUpForm = { ...signUpForm };
    updatedSignUpForm[id as keyof typeof signUpForm] = value;

    setSignUpForm(updatedSignUpForm);
  };

  const { signUp } = useAuth();
  const navigate = useNavigate();

  // Handles form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    try {
      const result = await signUp(signUpForm.email, signUpForm.password); // Call signUp from AuthContext

      if (result.success && result.data && result.data.user && result.data.session) {
        await createNewUser(result.data.user.id, signUpForm.username, result.data.session.access_token)
      } else {
        console.error('Sign-up failed:', result)
      }
    } catch (error) {
        console.error('An error occured: ', error)
    } finally {
      navigate('/'); 
    }
  }

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        className="p-8 flex flex-col items-center justify-center"
        style={{
          backgroundImage: `url(${signUpBox})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          width: '1200px',
          height: '900px',
        }}
      >
        {/* Sign Up Form */}
        <h2 className="text-2xl font-bold mb-4 text-center text-white">Sign Up</h2>
        <form className="px-6 w-2/5" onSubmit={handleSubmit}>
          {/* Username Input */}
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="email">
              Username
            </label>
            <input
              className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
              id="username"
              type="text"
              placeholder="Username"
              value={signUpForm.username}
              required={true}
              onChange={handleChange}
            />
          </div>
          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
              id="email"
              type="email"
              placeholder="Email"
              value={signUpForm.email}
              required={true}
              onChange={handleChange}
            />
          </div>
          {/* Password Input */}
          <div className="mb-2">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 mb-2 leading-tight focus:outline-none focus:shadow-outline bg-white"
              id="password"
              type="password"
              placeholder="Password"
              value={signUpForm.password}
              required={true}
              minLength={6}
              onChange={handleChange}
            />
            {error && <p className="text-red-500 text-xs">{error}</p>}  
          </div>
          {/* Confirm Passowrd Input */}
          <div className="mb-6">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 mb-2 leading-tight focus:outline-none focus:shadow-outline bg-white"
              id="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={signUpForm.confirmPassword}
              required={true}
              minLength={6}
              onChange={handleChange}
            />
            {error && <p className="text-red-500 text-xs">{error}</p>}  
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;