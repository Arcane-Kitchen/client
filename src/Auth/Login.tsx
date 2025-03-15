import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const { signIn } = useAuth();
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const result = await signIn(email, password); // Call signIn from AuthContext
      if (result.success) {
        navigate("/profile");
      } else {
        setError("Incorrect email or password");
      }
    } catch (error) {
      console.error("An error occured during sign-in: ", error);
      setError("An unexpected error occured.");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen w-full"
      style={{
        backgroundImage: `url(/background.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="p-4 flex items-center relative">
        <img src="/sign-up-box.svg" className="w-full h-full transform scale-y-200"></img>
        <div className="absolute -top-5 left-0 w-full h-full flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4 text-center text-white mt-8">
            Login
          </h2>
          <form className="px-6 w-4/5" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="mb-4">
              <label
                className="block text-white text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                required={true}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {/* Password Input */}
            <div className="mb-6">
              <label
                className="block text-white text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline bg-white"
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                required={true}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <p className="text-red-500 text-xs">{error}</p>}
              <p
                className="text-white cursor-pointer hover:text-blue-500"
                onClick={() => {
                  navigate("/signup");
                }}
              >
                Don't have an account? Sign up today!
              </p>
            </div>
            {/* Submit Button */}
            <div className="flex items-center justify-center">
              <button
                className="w-3/5 bg-[#ebd6aa] hover:bg-[#d0a56b] active:bg-[#b58a4d] text-[#19243e] font-bold py-2 px-4 rounded cursor-pointer hover:scale-105 hover:shadow-lg"
                type="submit"
              >
                Login
              </button>
            </div>
          </form>
        </div>
        
      </div>
    </div>
  );
};

export default Login;
