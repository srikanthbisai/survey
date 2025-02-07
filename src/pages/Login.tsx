import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) return "Password is required";
    if (password.length < 4) return "Password must be at least 4 characters long";
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({
      ...prev,
      [name]: ""
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError
      });
      return;
    }

    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate("/");
    } catch (error) {
      console.error(error);
      setErrors({
        email: "Invalid credentials",
        password: "Invalid credentials"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-800 p-6">
      <div className="container flex justify-center items-center">
        <form 
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 w-full max-w-md p-8 rounded-lg shadow-lg bg-gray-800 border border-gray-300"
          style={{
            boxShadow: "0 0 10px rgba(0, 255, 255, 0.7), 0 0 20px rgba(0, 255, 255, 0.5), 0 0 30px rgba(0, 255, 255, 0.3)"
          }}
        >
          <h1 className="font-bold text-2xl text-center text-white">
            Login to Your Account
          </h1>

          <div className="flex flex-col gap-2">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className={`p-3 border border-solid ${
                errors.email ? 'border-red-500' : 'border-teal-400'
              } text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500`}
              disabled={isLoading}
            />
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className={`p-3 border border-solid ${
                errors.password ? 'border-red-500' : 'border-teal-500'
              } text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500`}
              disabled={isLoading}
            />
            {errors.password && (
              <span className="text-red-500 text-sm">{errors.password}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`bg-teal-700 p-3 text-white font-bold rounded-md transition duration-300 
              ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-teal-800'}`}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>

          <Link to="/register" className="text-center">
            <button 
              type="button"
              className="text-red-500 font-bold w-full rounded-md transition duration-300"
              disabled={isLoading}
            >
              Don't have an account?{" "}
              <span className="text-yellow-500 hover:text-teal-800">
                Sign Up
              </span>
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;