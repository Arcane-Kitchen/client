import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./components/Auth/AuthContext";
import signUpBox from "./assets/sign-up-box.svg";
import background from "./assets/background.png";

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
        navigate("/");
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
      className="flex items-center justify-center min-h-screen"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="p-8 flex flex-col items-center justify-center"
        style={{
          backgroundImage: `url(${signUpBox})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          width: "800px",
          height: "500px",
        }}
      >
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
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
