// --------------------------------------
// DONE (4). TESTED (4/4), REMAINING (0), TOTAL (4)
// --------------------------------------


const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";



// 1. ✅ Done / Tested 
// export const checkAuthApi = async () => {
//   const res = await axiosInstance.get("/auth/check-auth");
//   return res;
// }; 

// 2. ✅ Done / Tested 
export const loginApi = async (data: unknown) => {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json(); // ✅ parse

  if (!res.ok) {
    throw new Error(result.message || "Signup failed");
  }

  return result; // ✅ return actual data
};

// 3. ✅ Done/ --
export const signupApi = async (data: unknown) => {
  const res = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  
  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Login failed");
  }

  return result;
};

// 4. ✅ Done/ Tested
// export const googleLoginApi = async (token: string) => {
//   const res = await axiosInstance.post("/auth/google", { token });
//   return res;
// };


// For logging out 
export const logoutApi = async () => {
  return await fetch(`${BASE_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
};


// Your own data i.e the looged in user info
export const fetchUserInfoApi = async () => {
  const res = await fetch(`${BASE_URL}/api/user/get-user-info`, { 
    cache: "no-store", 
    method: "GET",
    credentials: "include", 
  });
  return res;
};


// ✅ UPDATE Profile
export const updateUserProfileApi = async ( formData: FormData ) => {
  const res = await fetch(`${BASE_URL}/api/user/update-profile`, {
    method: "PUT",
    credentials: "include", 
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to update profile");
  return res.json();
};


export const fetchWorkspaceMembersApi = async (
  workspaceId: string
) => {
  const res = await fetch(
    `${BASE_URL}/api/workspace/${workspaceId}/members`,
    {
      cache: "no-store",
      method: "GET",
      credentials: "include",
    }
  );

  return res;
};


// Your own data i.e the looged in user info
export const getWorkspaceApi = async () => {
  const res = await fetch(`${BASE_URL}/api/workspace/currentActiveWorkspace`, { 
    cache: "no-store", 
    method: "GET",
    credentials: "include", 
  });

  return res;
};


// ✅ UPDATE Workspace
export const updateWorkspaceApi = async ( formData: FormData ) => {
  const res = await fetch(`${BASE_URL}/api/workspace/update-workspace`, {
    method: "PUT",
    credentials: "include", 
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to update workspace");
  return res.json();
};


// Get the analytics data for the workspace
export const fetchAnalyticsApi = async () => {
  const res = await fetch(`${BASE_URL}/api/workspace/workspaceAnalyticsData`, { 
    cache: "no-store", 
    method: "GET",
    credentials: "include", 
  });

  return res;
};



// Delete Workspace
export const deleteWorkspaceApi = async () => {
  const res = await fetch(`${BASE_URL}/api/workspace/delete-workspace`, {
    method: "DELETE",
    credentials: "include",
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.error || "Failed to delete workspace");
  }

  return result;
};


// Fetch all the workspaces of current user
export const fetchWorkspacesApi = async () => {
  const res = await fetch(`${BASE_URL}/api/workspace/list`, {
    cache: "no-store",
    credentials: "include",
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.error || "Failed to fetch workspaces");
  }

  return result;
};



// Switching between workspaces
export const selectWorkspaceApi = async (workspaceId: string) => {
  const res = await fetch(`${BASE_URL}/api/workspace/select`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ workspaceId }),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.error || "Failed to switch workspace");
  }
};



// Create a new workspace
export const createWorkspaceApi = async (name: string) => {
  const res = await fetch(`${BASE_URL}/api/workspace/create-workspace`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name }),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.error || "Failed to create workspace");
  }

  return result;
};




export const createInvitationApi = async (
  email: string,
  role: string
) => {
  return await fetch(
    `${BASE_URL}/api/workspace/invitation`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, role }),
    }
  );
};


export const acceptInvitationApi = async (token: string) => {
  return await fetch(
    `${BASE_URL}/api/workspace/invitation/accept`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ token }),
    }
  );
};


export const validateInvitationApi = async (token: string) => {
  return await fetch(
    `${BASE_URL}/api/workspace/invitation/accept?token=${encodeURIComponent(token)}`,
    {
      method: "GET",
      credentials: "include",
    }
  );
};


export const declineInvitationApi = async (token: string) => {
  return await fetch(
    `${BASE_URL}/api/workspace/invitation/accept`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ token }),
    }
  );
};


export const fetchPendingInvitationsApi = async () => {
  return await fetch(`${BASE_URL}/api/workspace/invitation/pending`, {
    cache: "no-store",
    method: "GET",
    credentials: "include",
  });
};


export const fetchUserPendingInvitationsApi = async () => {
  return await fetch(`${BASE_URL}/api/user/pending-invitations`, {
    cache: "no-store",
    method: "GET",
    credentials: "include",
  });
};


export const fetchReceivedInvitationApi = async (invitationId: string) => {
  return await fetch(
    `${BASE_URL}/api/user/pending-invitations/${invitationId}`,
    {
      cache: "no-store",
      method: "GET",
      credentials: "include",
    }
  );
};


export const acceptInvitationByIdApi = async (invitationId: string) => {
  return await fetch(`${BASE_URL}/api/workspace/invitation/accept`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ invitationId }),
  });
};


export const declineInvitationByIdApi = async (invitationId: string) => {
  return await fetch(`${BASE_URL}/api/workspace/invitation/accept`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ invitationId }),
  });
};
