import React from 'react';
import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IoExitOutline } from 'react-icons/io5';

const Submitted: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-800 p-6">
      <div 
        className="relative w-full max-w-md p-8 rounded-lg shadow-lg bg-gray-800 border border-gray-300 text-center"
        style={{
          boxShadow: "0 0 10px rgba(0, 255, 255, 0.7), 0 0 20px rgba(0, 255, 255, 0.5), 0 0 30px rgba(0, 255, 255, 0.3)"
        }}
      >
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 p-2 text-teal-400 hover:text-teal-300 transition-colors duration-300 rounded-full hover:bg-gray-700"
          aria-label="Logout"
        >
          <IoExitOutline size={28} />
        </button>

        <div className="flex flex-col items-center gap-6">
          <div className="flex justify-center">
            <CheckCircle 
              size={64} 
              className="text-teal-400 animate-bounce"
            />
          </div>
          
          <h1 className="text-3xl font-bold text-white">
            Thank You!
          </h1>
          
          <p className="text-teal-300 text-lg">
            Your responses have been successfully recorded
          </p>
          
          <div className="mt-4 w-16 h-1 bg-teal-500 rounded-full"></div>
          
          <p className="text-gray-400">
            We appreciate your submission and will process it shortly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Submitted;