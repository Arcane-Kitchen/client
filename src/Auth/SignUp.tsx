import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const SignUp: React.FC = () => {
  const [signUpForm, setSignUpForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  // Handles changes in the form input fields
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;

    // Validate password length
    if (id === "password" && value.length < 6) {
      setError("Please enter at least 6 digits.");
    } else {
      setError("");
    }

    // Validate password confirmation
    if (id === "confirmPassword" && value != signUpForm.password) {
      setError("Passwords don't match.");
    } else {
      setError("");
    }

    const updatedSignUpForm = { ...signUpForm };
    updatedSignUpForm[id as keyof typeof signUpForm] = value;

    setSignUpForm(updatedSignUpForm);
  };

  const { signUp, setIsLoading } = useAuth();
  const navigate = useNavigate();

  // Handles form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const result = await signUp(
        signUpForm.email,
        signUpForm.password
      ); // Call signUp from AuthContext

      if (result.success && result.data && result.data.user && result.data.session) {
        navigate("/preferences");
      } else {
        console.error("Sign-up failed:", result);
        setError("Sign-up failed:");
      }
    } catch (error) {
      console.error("An error occured: ", error);
    } finally {
      setIsLoading(false);
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
      <div className="p-4 flex items-center justify-center relative">
        <img src="/sign-up-box.svg" className="w-full h-full transform scale-y-280 lg:w-4/5 lg:scale-y-110" />
        {/* Sign Up Form */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full flex flex-col items-center justify-center lg:w-4/5">
          <h2 className="text-2xl font-bold mb-4 text-center text-white lg:text-3xl">
            Sign Up
          </h2>
          <form className="px-6 w-4/5 lg:w-3/5" onSubmit={handleSubmit}>
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
                value={signUpForm.email}
                required={true}
                onChange={handleChange}
              />
            </div>
            {/* Password Input */}
            <div className="mb-2">
              <label
                className="block text-white text-sm font-bold mb-2"
                htmlFor="password"
              >
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
              <label
                className="block text-white text-sm font-bold mb-2"
                htmlFor="confirmPassword"
              >
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
              <p
                className="text-white cursor-pointer hover:text-blue-500"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Have an account? Login!
              </p>
            </div>
            <div className="flex items-center justify-center">
              <button
                className="w-3/5 bg-[#ebd6aa] hover:bg-[#d0a56b] active:bg-[#b58a4d] text-[#19243e] font-bold py-2 px-4 rounded cursor-pointer hover:scale-105 hover:shadow-lg"
                type="submit"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
