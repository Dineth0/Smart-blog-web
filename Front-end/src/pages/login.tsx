import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import {getMyDetails, login} from '../services/auth'
// import { useAuth } from "../context/authContext"
// import { login, getMyDetails } from "../services/auth"

export default function Login()  {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const { setUser } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault() // prevent page refresh

    if (!email.trim() || !password.trim()) {
      alert("Please enter both username and password.")
      return
    }

    try {
      const data: any = await login(email, password)

      if (data?.data?.accessToken) {
        await localStorage.setItem("accessToken", data.data.accessToken)
        await localStorage.setItem("refreshtoken", data.data.refreshtoken)

        alert("Login Successfully")

       const detail = await getMyDetails()
       console.log(detail)
       if(detail?.data){
        setUser(detail.data)
       }

        navigate("/home")
      } else {
        alert("Login failed, please check your credentials.")
      }
    } catch (err) {
      console.error("Login error:", err)
      alert("Login failed, please check your credentials.")
    }
}

    // ----- Example of axios call (besic) -----
    /*
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/login",
        { email: username, password },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log(response.data);
    } catch (err) {
      console.error(err);
    }
    */
  

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <form className="flex flex-col gap-4 w-80">
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleLogin}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>

      <p className="mt-4 text-gray-700">
        Don't have an account?{" "}
        <button
          className="text-blue-600 font-semibold hover:underline"
        //   onClick={() => navigate("/register")}
        >
          Register
        </button>
      </p>
    </div>
  )

}
