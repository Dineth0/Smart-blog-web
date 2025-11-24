import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate} from 'react-router-dom';
import { signup } from '../services/auth';



const Signup = () => {
    //state - component
    //useState is react Hook for manage State

  const [firstname, setFirstname] = useState('');
   const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const[role, setRole] = useState('USER')
    const navigate = useNavigate();

//   const [passwordError, setPasswordError] = useState('');
//   const { signup, loading, error } = useAuth();



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!firstname || !lastname || !email || !password || !confirmPassword || !role) {
      alert("All fields are Requied")
      return
}
    
    if (password !== confirmPassword) {
    //   const errorMessage = 'Passwords do not match';
    //   setPasswordError(errorMessage);
    //   showErrorAlert('Password Error', errorMessage);
      return;
    }
    
    // setPasswordError('');
     try {
      const obj =  {
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
        role:role
      };
      const res : any =  await  signup(obj)
      console.log(res.data)
      console.log("Signup success");
      alert("Signup successful!");
      navigate("/login")
    } catch (error) {
        console.log(error)
      console.error("Signup failed");
      alert("Signup failed");
    }
    
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex justify-center items-center p-4">
      <div className="w-[400px] max-w-full">
        <div className="bg-white shadow-2xl rounded-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-blue-700">Create your account</h2>
          </div>

          {/* Error Messages */}
          {/* {(error || passwordError) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error || passwordError}</p>
                </div>
              </div>
            </div>
          )} */}

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                First name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                className="text-black w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Last name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                className="text-black w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-black w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-black w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"                placeholder="Create a password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="text-black w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"                placeholder="Confirm your password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Select Roles
              </label>
              <select
                id="confirmPassword"
                name="confirmPassword"
               
        
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="text-black w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"                
              >
                <option value="USER">USER</option>
                <option value="AUTHOR">AUTHOR</option>
              </select>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                // disabled={loading}
                className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02]"
              >Submit
                {/* {loading ? 'Creating account...' : 'Create account'} */}
              </button>
            </div>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;