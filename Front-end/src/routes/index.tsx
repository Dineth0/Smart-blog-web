import { lazy, Suspense, type ReactNode } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { useAuth } from "../context/authContext"
import Layout from "../components/Layout"

const Index = lazy(() => import("../pages/index"))
const Login = lazy(() => import("../pages/login"))
const Signup = lazy(() => import("../pages/signup"))
const Post = lazy(() => import("../pages/post"))
const Home = lazy(() => import("../pages/home"))
const MyPost = lazy(() => import("../pages/MyPost"))



type RequireAuthTypes = {children: ReactNode; roles?: string[]}

const RequireAuth = ({children, roles }: RequireAuthTypes) =>{
  const {user, loading} = useAuth()

  if(loading){
    return(
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    )
  }
  if(!user){
    return <Navigate to="/login" replace/>
  }
  if(roles && !roles.some((role)=> user.roles?.includes(role))){
    return(
       <div className="text-center py-20">
        <h2 className="text-xl font-bold mb-2">Access Denied</h2>
        <p>You do not have permission to view this page.</p>
      </div>
    )
  }
  return <>{children}</>
}

export default function Router() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
      
        <Routes>
          <Route path="/" element={<Index />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route
          
            element={
              <RequireAuth>
                <Layout/>
              </RequireAuth>
            }
          >
            <Route path="/home" element={<Home />} />
            <Route path="/post" element={<Post />} />
            <Route path="/mypost" element={
                                        <RequireAuth roles={["ADMIN", "AUTHOR"]}>
                                          <MyPost/>
                                        </RequireAuth>
                                    }/>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
