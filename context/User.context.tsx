"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

// APIs
import { 
  loginApi, 
  signupApi,
  fetchUserInfoApi,
  updateUserProfileApi,
  fetchWorkspaceMembersApi,
} from "@/services/auth.services";


// Types
import { User } from "@/app/Types/user.type";
// import { Workspace } from "@/app/Types/workspace.type";


// Utility
import { getErrorMessage } from "@/lib/error";



export interface WorkspaceMember {
  _id: string;
  role: "OWNER" | "ADMIN" | "EDITOR" | "VIEWER";

  user: {
    _id: string;
    fullName: string;
    about?: string;
    email: string;
    profilePic?: string;
    location?: string;
  };
}


interface UserContextType {
  loading: boolean;
  updateLoading: boolean;
  fetchLoading: boolean;

  // Authentication
  authUser: User | null;
  isLoggingIn: boolean;
  isSigningUp: boolean;
  login: (formData: unknown) => Promise<void>;
  signup: (formData: unknown) => Promise<void>;
  fetchUser: () => Promise<void>;                            
  updateUserProfile: (formData: FormData) => Promise<void>;
  logout: () => Promise<void>;

  // Workspace Members
  fetchWorkspaceMembers: (workspaceId: string) => Promise<void>;
  members: WorkspaceMember[];
  membersLoading: boolean;

}

// Context
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {

  const router = useRouter();

  // Context 
  const [loading, setLoading] = useState(true);

  const [updateLoading, setUpdateLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);


// --------------------------- AUTHENTICATION LOGIC ---------------------------

  // For logging in
  const login = async (formData: unknown) => {
    try {
      setIsLoggingIn(true);                               // Setting loading state for login process on Frontend UI

      const res = await loginApi(formData as { email: string; password: string });  // Calling the login API with the form data (email and password) to authenticate the user

      // Changed to server-side for security - remove the below line and this comment if everything works fine which it does for now
      // Cookies.set("token", res.token, { expires: 7 });    // Setting a cookie named "token" with the JWT token received from the API response, which will be used for authentication in future requests. The cookie is set to expire in 7 days.

      setAuthUser(res.user);                              // Setting the authenticated user state with the user data received from the API response

      toast.success("Logged in successfully");            // Displaying success message/notificaton to the user
      router.push("/create-blog");                        // Redirecting the user to the create blog page after successful login

    } catch (err) {
      toast.error(getErrorMessage(err, "Login failed"));  // Displaying error message/notification to the user if login fails
    } finally {
      setIsLoggingIn(false);                              // Resetting the loading state for login process on Fronend UI, regardless of success or failure
    }
  };




  // For Signing Up
  const signup = async (formData: unknown) => {
  try {
    setIsSigningUp(true);                                   // For UI Loading

    const res = await signupApi(formData);                  // SignUp API with the form data (email and password) to authenticate the user
    setAuthUser(res.user);                                  // Setting authenticated user's data

    toast.success("Account created successfully");          // Displaying success message/notification
    router.push("/create-blog");                            // Redirecting to create blog page 

  } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Signup failed"));   // Displaying signup failure message/notification
  } finally {
    setIsSigningUp(false);                                  // Resetting the state for UI loading, regardless of success or failure
  }

};


  // For Logging Out
  const logout = async () => {
    
    try {
      
      // 🧹 Remove token from everywhere
      localStorage.removeItem("token");
      Cookies.remove("token");
      
      // googleLogout();

      setAuthUser(null);
      
      toast.success("Logged out successfully");
      
      // 👇 Redirect after Logout
      router.push("/login");

    } catch (err) {
        toast.error(getErrorMessage(err, "Failed to logout"));
    } 
  };

  
  // Fetch user details
  const fetchUser = async () => {
      try {
        setFetchLoading(true);

        const res = await fetchUserInfoApi(); 
        const data = await res.json();
        // console.log("THIS IS THE RES OF THE FETCHED USER: ", res);
        // console.log("THIS IS THE DATA OF THE FETCHED USER: ", data);

        await fetchWorkspaceMembers(data.defaultWorkspace._id); // Fetch members of the default workspace

        setAuthUser(data);

      } catch (err) {
        toast.error(getErrorMessage(err, "Failed to fetch user info"));
      } finally {
        setFetchLoading(false);
      }
    };


  // Update User Details
  const updateUserProfile = async (formData: FormData) => {
    try {
      setUpdateLoading(true);

      const res = await updateUserProfileApi(formData);

      setAuthUser(res.data);

      toast.success("Profile updated successfully");

    }
    catch (err) {
        toast.error(getErrorMessage(err, "Failed to update profile"));
    }
    finally {
      setUpdateLoading(false);
    }
  };


  const fetchWorkspaceMembers = async ( workspaceId: string ) => {
  try {
    // setMembersLoading(true);

    const res = await fetchWorkspaceMembersApi(workspaceId);

    const data = await res.json();

    // console.log("Workspace members:", data);

    setMembers(data.members);
  } catch (err) {
    toast.error(
      getErrorMessage(err, "Failed to fetch workspace members")
    );
  } finally {
    // setMembersLoading(false);
  }
};


  return (
    <UserContext.Provider
      value={{
        loading,
        updateLoading,
        fetchLoading,

        // Authentication
        authUser,
        isLoggingIn,
        isSigningUp,
        login,
        signup,
        logout,
        updateUserProfile,
        fetchUser,
        fetchWorkspaceMembers,
        members,
        membersLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Hook
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }

  return context;
};