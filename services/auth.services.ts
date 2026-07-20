
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
  
  // return res;
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

  // return res;
};

// 4. ✅ Done/ Tested
// export const googleLoginApi = async (token: string) => {
//   const res = await axiosInstance.post("/auth/google", { token });
//   return res;
// };

// Apprently Don't Need A Backend-Api for Logout Only Need it If Moven Backend Https Baseed Cookies

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

    // Using cookies for creadentials instead of cookies
    credentials: "include", 

    body: formData,
  });

  if (!res.ok) throw new Error("Failed to update blog");
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