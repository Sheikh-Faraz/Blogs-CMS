"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useState } from "react";


// Importing user context to refresh/get blogs when workspace is switched
import { useBlog } from "@/context/Blog.context";


import toast from "react-hot-toast";
import Cookies from "js-cookie";

// APIs
import { 
  loginApi, 
  signupApi,
  logoutApi,
  fetchUserInfoApi,
  updateUserProfileApi,
  fetchWorkspaceMembersApi,
  getWorkspaceApi,
  updateWorkspaceApi,
  deleteWorkspaceApi,
  fetchWorkspacesApi,
  selectWorkspaceApi,
  createWorkspaceApi,
  fetchAnalyticsApi,
  fetchPendingInvitationsApi,
  fetchUserPendingInvitationsApi,
} from "@/services/auth.services";


// Types
import { User } from "@/app/Types/user.type";
import { Workspace } from "@/app/Types/workspace.type";


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
};

export interface PendingInvitation {
  _id: string;
  email: string;
  role: "ADMIN" | "EDITOR" | "VIEWER";
  status: "PENDING";
  expiresAt: string;
  createdAt: string;
}


export interface ReceivedInvitation {
  _id: string;
  email: string;
  role: "ADMIN" | "EDITOR" | "VIEWER";
  expiresAt: string;
  createdAt: string;

  workspace: {
    _id: string;
    name: string;
    slug?: string;
    logo?: string;
  } | null;
}


// ============================================================
// TYPES FOR ANALYIC DATA
// ============================================================

type Overview = {
  totalBlogs: number;
  publishedBlogs: number;
  draftBlogs: number;
  totalAuthors: number;
  totalMembers: number;
};


type BlogActivity = {
  date: string;
  total: number;
  published: number;
  drafts: number;
};


type Author = {
  id: string;
  name: string;
  profilePic: string;
  gender: string;
  location: string;
  role: string;
  totalBlogs: number;
  published: number;
  drafts: number;
};


type ChartData = {
  name: string;
  value: number;
};


type AnalyticsData = {
  overview: Overview;

  blogActivity: BlogActivity[];

  authors: Author[];

  authorsByGender: ChartData[];

  authorsByLocation: ChartData[];

  membersByRole: ChartData[];
};


interface UserContextType {
  loading: boolean;
  updateLoading: boolean;
  fetchLoading: boolean;
  workspaceAnalyticsLoading: boolean;

  // Authentication
  authUser: User | null;
  isLoggingIn: boolean;
  isSigningUp: boolean;

  // login: (formData: unknown) => Promise<void>;
  login: (
    formData: unknown,
    redirectTo?: string
  ) => Promise<void>;

  // signup: (formData: unknown) => Promise<void>;
  signup: (
    formData: unknown, 
    redirectTo?: string
  ) => Promise<void>;

  fetchUser: () => Promise<void>;                            
  updateUserProfile: (formData: FormData) => Promise<void>;
  logout: (redirectTo?: string) => Promise<void>;
  
  // Workspace Members
  fetchWorkspaceMembers: (workspaceId: string) => Promise<void>;
  members: WorkspaceMember[];
  membersLoading: boolean;

  
  // Workspace
  workspace: Workspace | null;
  setWorkspace: (workspace: Workspace | null) => void;
  workspaces: Workspace[];
  workspacesLoading: boolean;
  fetchWorkspaces: () => Promise<void>;
  selectWorkspace: (workspaceId: string) => Promise<void>;
  createWorkspace: (name: string) => Promise<boolean>;
  createWorkspaceLoading: boolean;

  CurrentActiveWorkspace: () => Promise<void>;


  updateWorkspaceLoading: boolean;
  updateWorkspace: (formData: FormData) => Promise<void>;
  deleteWorkspaceLoading: boolean;


  deleteWorkspace: () => Promise<boolean>;


  analytics: AnalyticsData | null;
  fetchAnalytics: () => Promise<void>;

  fetchPendingInvitations: () => Promise<void>;
  pendingInvitations: PendingInvitation[];
  pendingInvitationsLoading: boolean;

  // Invitations received by the current user
  fetchReceivedInvitations: () => Promise<void>;
  receivedInvitations: ReceivedInvitation[];
  receivedInvitationsLoading: boolean;
}

// Context
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {

    // Context
    const { getAllBlogs } = useBlog();

  const router = useRouter();

  // Context 
  const [workspaceAnalyticsLoading, setWorkspaceAnalyticsLoading] = useState(true);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [workspacesLoading, setWorkspacesLoading] = useState(false);
  const [createWorkspaceLoading, setCreateWorkspaceLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const [updateWorkspaceLoading, setUpdateWorkspaceLoading] = useState(false);
  const [deleteWorkspaceLoading, setDeleteWorkspaceLoading] = useState(false);

  const [updateLoading, setUpdateLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);

  // Analytics
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);


  const [pendingInvitations, setPendingInvitations] = useState<PendingInvitation[]>([]);
  const [pendingInvitationsLoading, setPendingInvitationsLoading] = useState(false);


  const [receivedInvitations, setReceivedInvitations] = useState<ReceivedInvitation[]>([]);
  const [receivedInvitationsLoading, setReceivedInvitationsLoading] = useState(false);


// --------------------------- AUTHENTICATION LOGIC ---------------------------

  // For logging in
  // const login = async (formData: unknown) => {
  const login = async ( formData: unknown, redirectTo?: string ) => {
    try {
      setIsLoggingIn(true);                               // Setting loading state for login process on Frontend UI

      const res = await loginApi(formData as { email: string; password: string });  // Calling the login API with the form data (email and password) to authenticate the user

      setAuthUser(res.user);                              // Setting the authenticated user state with the user data received from the API response

      toast.success("Logged in successfully");            // Displaying success message/notificaton to the user
      router.push( redirectTo || "/create-blog" );        // Redirecting the user to the create blog page after successful login

    } catch (err) {
      toast.error(getErrorMessage(err, "Login failed"));  // Displaying error message/notification to the user if login fails
    } finally {
      setIsLoggingIn(false);                              // Resetting the loading state for login process on Fronend UI, regardless of success or failure
    }
  };




  // For Signing Up
  // const signup = async (formData: unknown) => {
  const signup = async (formData: unknown, redirectTo?: string) => {
  try {
    setIsSigningUp(true);                                   // For UI Loading

    const res = await signupApi(formData);                  // SignUp API with the form data (email and password) to authenticate the user
    setAuthUser(res.user);                                  // Setting authenticated user's data

    toast.success("Account created successfully");          // Displaying success message/notification
    router.push( redirectTo || "/create-blog");             // Redirecting to create blog page 

  } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Signup failed"));   // Displaying signup failure message/notification
  } finally {
    setIsSigningUp(false);                                  // Resetting the state for UI loading, regardless of success or failure
  }

};


  // For Logging Out
  const logout = async (redirectTo?: string) => {
    try {
      const res = await logoutApi();

      if (!res.ok) {
        throw new Error("Failed to logout");
      }

      setAuthUser(null);

      toast.success("Logged out successfully");

      router.push(redirectTo || "/login");
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

    setMembers(data.members);
  } catch (err) {
    toast.error(
      getErrorMessage(err, "Failed to fetch workspace members")
    );
  } finally {
    // setMembersLoading(false);
  }
};



  // Get Current Workspace Details
  const CurrentActiveWorkspace = async () => {
    try {
      setUpdateLoading(true);

      const res = await getWorkspaceApi();
      const data = await res.json();

      setWorkspace(data.workspace);
      await fetchWorkspaceMembers(data.workspace._id);

    }
    catch (err) {
        toast.error(getErrorMessage(err, "Failed to fetch current workspace"));
    }
    finally {
      setUpdateLoading(false);
    }
  };


  // Get Current Workspace Details
  const updateWorkspace = async (formData: FormData) => {
    try {
      setUpdateWorkspaceLoading(true);

      const data = await updateWorkspaceApi(formData);

      setWorkspace(data.workspace);

      fetchWorkspaces();

      toast.success("Workspace updated successfully");
    }
    catch (err) {
        toast.error(getErrorMessage(err, "Failed to update workspace details"));
    }
    finally {
      setUpdateWorkspaceLoading(false);
    }
  };


  // Delete workspace
  const deleteWorkspace = async () => {
    try {
      setDeleteWorkspaceLoading(true);

      const data = await deleteWorkspaceApi();

      setWorkspace(data.workspace);
      await fetchUser();
      await fetchWorkspaces();
      await fetchAnalytics();

      toast.success("Workspace deleted successfully");
      router.refresh();

      return true;
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete workspace"));
      return false;
    } finally {
      setDeleteWorkspaceLoading(false);
    }
  };


  // Get all the workspaces
  const fetchWorkspaces = async () => {
    try {
      setWorkspacesLoading(true);
      setWorkspaces(await fetchWorkspacesApi());
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to fetch workspaces"));
    } finally {
      setWorkspacesLoading(false);
    }
  };


  // To switch between workspaces
  const selectWorkspace = async (workspaceId: string) => {
    try {
      await selectWorkspaceApi(workspaceId);
      await CurrentActiveWorkspace();
      
      router.push("/blogs");
      
      await fetchAnalytics();
      await getAllBlogs();

      // router.refresh();

    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to switch workspace"));
    }
  };


  // TO create new workspace
  const createWorkspace = async (name: string) => {
    try {
      setCreateWorkspaceLoading(true);
      const data = await createWorkspaceApi(name);

      setWorkspace(data.workspace);
      await fetchWorkspaces();
      await fetchAnalytics();

      toast.success("Workspace created successfully");
      router.refresh();
      return true;
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to create workspace"));
      return false;
    } finally {
      setCreateWorkspaceLoading(false);
    }
  };


  // ==========================================================
  // FETCH ANALYTICS
  // ==========================================================

  const fetchAnalytics = async () => {
    try {

      const res = await fetchAnalyticsApi();
      const data = await res.json();

      setAnalytics(data);

    } catch (err) {
      console.error("Analytics fetch error:", err);
    } finally {
      setWorkspaceAnalyticsLoading(false);
    }
  };


  // Fetch the invitations/pending to the users
  const fetchPendingInvitations = async () => {
    try {
      setPendingInvitationsLoading(true);

      const res = await fetchPendingInvitationsApi();

      const data = await res.json();

      if (!res.ok) {
        throw new Error( data.message || "Failed to fetch pending invitations" );
      }

      setPendingInvitations(data.invitations || []);

    } catch (err) {

      toast.error(
        getErrorMessage(err,"Failed to fetch pending invitations")
      );

    } finally {
      setPendingInvitationsLoading(false);
    }
  };



  // Fetch invitations received by the current logged-in user
  const fetchReceivedInvitations = async () => {
      try {
        setReceivedInvitationsLoading(true);

        const res = await fetchUserPendingInvitationsApi();
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch received invitations");
        }

        setReceivedInvitations(data.invitations || []);
      } catch (err) {
        toast.error(
          getErrorMessage(err, "Failed to fetch received invitations")
        );
      } finally {
        setReceivedInvitationsLoading(false);
      }
    };




  return (
    <UserContext.Provider
      value={{
        loading,
        updateLoading,
        fetchLoading,
        workspaceAnalyticsLoading,

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

        // Workspace
        workspace,
        setWorkspace,
        workspaces,
        workspacesLoading,
        fetchWorkspaces,
        selectWorkspace,
        createWorkspace,
        createWorkspaceLoading,
        CurrentActiveWorkspace,

        updateWorkspaceLoading,
        updateWorkspace,
        
        deleteWorkspaceLoading,
        deleteWorkspace,

        analytics,
        fetchAnalytics,


        fetchPendingInvitations,
        pendingInvitations,
        pendingInvitationsLoading,


        fetchReceivedInvitations,
        receivedInvitations,
        receivedInvitationsLoading,
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
