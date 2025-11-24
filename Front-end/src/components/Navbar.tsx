import type React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export const Navbar: React.FC = ()=>{
    const {user, setUser} = useAuth()
    const navigate = useNavigate()

    const handleLogout = () =>{

    }
    return(
        <nav className="bg-blue-950 shadow-md w-full z-50 py-4 px-8 flex justify-between items-center text-gray-300 font-medium">
            <div className="flex space-x-6">
                <Link to="/home" className="hover:text-indigo-400 transition">HOME</Link>
                <Link to="/post" className="hover:text-indigo-400 transition">POST</Link>
                {(user?.roles?.includes("ADMIN") ||
                user?.roles?.includes("AUTHOR")) && (
                <Link to="/my-post" className="hover:underline">
                My Posts
                </Link>
        )}
            </div>
            <div className="flex space-x-4">
                <Link to="/login" className="px-4 py-1 rounded-full border border-red-400 text-red-400 text-sm hover:bg-red-600 hover:text-white transition">
                    Login
                </Link>
                <span>{user?.email}</span>
                <Link to="/signup" className="px-4 py-1 rounded-full border border-red-400 text-red-400 text-sm hover:bg-red-600 hover:text-white transition">
                    Signup
                </Link>
            </div>
            <div className="flex items-center space-x-4">
                <span>{user?.email}</span>
                <button
                onClick={handleLogout}
                className="bg-white text-blue-500 px-2 py-1 rounded"
                >
                Logout
                </button>
            </div>
        </nav>
    )
}
