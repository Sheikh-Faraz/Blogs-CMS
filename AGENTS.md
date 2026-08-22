# Developer Context & AI Agent Guide (AGENTS.md)

This document provides a comprehensive overview of the codebase to assist AI coding agents in understanding the architecture, patterns, and security constraints of this project.

---

## 1. PROJECT OVERVIEW
This application is a **Multi-tenant Workspace-based Blog Management System**. It allows users to create and manage blogs within isolated "Workspaces." Users can belong to multiple workspaces with different roles.

### Main Features
- **User Authentication:** Signup/Login with JWT-based sessions.
- **Workspace Isolation:** Every resource (Blogs, Categories, Tags) is scoped to a specific Workspace.
- **Role-Based Access Control (RBAC):** Roles (OWNER, ADMIN, EDITOR, VIEWER) define permissions within a workspace.
- **Blog Editor:** Rich-text content management with hero image uploads (Cloudinary/Unsplash).
- **AI Integration:** AI-powered blog generation and toolbar actions (summarize, rewrite, etc.).
- **Analytics:** Dashboard showing blog activity and author statistics per workspace.

---

## 2. TECHNOLOGY STACK
- **Frontend:** Next.js (App Router), React, Tailwind CSS, Lucide Icons, SCSS.
- **Backend:** Next.js Route Handlers (API Routes).
- **Database:** MongoDB with Mongoose ODM.
- **Authentication:** JWT (stored in cookies), `jose` for token verification.
- **File Storage:** Cloudinary (for images).
- **UI Components:** Radix UI (via shadcn/ui), Tiptap (Rich Text Editor).
- **State Management:** React Context API (`UserProvider`, `BlogProvider`).
- **Data Fetching:** Standard `fetch` wrapped in service layers.

---

## 3. COMPLETE PROJECT STRUCTURE

### Key Directories
- `app/`: Next.js App Router (Pages and API Routes).
- `app/api/`: Server-side logic. Routes are organized by feature (auth, blogpost, workspace, user, analytics).
- `components/`: UI components. Uses a mix of Radix-based UI and custom components.
- `context/`: Central state management.
    - `User.context.tsx`: Manages auth state, current workspace, and workspace switching.
    - `Blog.context.tsx`: Manages blogs, categories, and tags for the active workspace.
- `lib/`: Core utilities and server-side helpers.
- `models/`: Mongoose schemas.
- `services/`: Client-side API wrappers for frontend-to-backend communication.

### Architecturally Important Files
- `middleware.ts`: Handles route protection and JWT verification.
- `lib/db.ts`: MongoDB connection singleton.
- `lib/getCurrentUser.ts`: Resolves the authenticated user from the request cookie.
- `lib/workspace.ts`: Resolves the active workspace (cookie-based with fallback to default).
- `lib/premission.ts` & `lib/roleValidator.ts`: Server-side authorization helpers.

---

## 4. DATABASE / DATA MODEL

### Core Models & Relationships
- **User:** Auth details, profile info, and a `defaultWorkspace` reference.
- **Workspace:** The container for all content. Has a `slug`, `logo`, and `socials`.
- **Membership:** Maps **User** to **Workspace**.
    - Fields: `user` (Ref), `workspace` (Ref), `role` (Enum: OWNER, ADMIN, EDITOR, VIEWER).
    - Unique Index: `{ user: 1, workspace: 1 }`.
- **Blog:** The main content entity.
    - Fields: `workspace` (Ref, Required), `author` (Ref, User), `category` (Ref), `tags` (Ref[]), `status` (draft/published).
- **Category / Tags:** Scoped to a workspace.
    - Fields: `name`, `workspace` (Ref).
    - Unique Index: `{ workspace: 1, name: 1 }` (Names are unique *per workspace*).

### Conceptual Map
`User` ↔ `Membership` ↔ `Workspace` → `(Blogs, Categories, Tags)`

---

## 5. AUTHENTICATION
- **Flow:** User logs in via `/api/auth/login`. On success, a JWT `token` is set in an `httpOnly` cookie.
- **Verification:** `middleware.ts` checks the cookie for every protected route.
- **Retrieval:** `lib/getCurrentUser.ts` extracts the `userId` from the JWT and fetches the user from MongoDB, populating the `defaultWorkspace`.
- **Client Access:** The `UserProvider` calls `/api/user/get-user-info` on mount to populate `authUser`.

---

## 6. AUTHORIZATION / WORKSPACE SYSTEM
This is the core architectural constraint. **All data must be scoped to a workspace.**

### Workspace Resolution
1. **Active Workspace:** Determined by the `activeWorkspaceId` cookie.
2. **Fallback:** If no cookie exists, it falls back to the user's `defaultWorkspace`.
3. **Helper:** Use `lib/workspace.ts -> getActiveWorkspace(userId)` to get the current workspace server-side.

### Access Control
- **`requireMembership(userId, workspaceId)`:** Ensures the user belongs to the workspace.
- **`requireRole(userId, workspaceId, allowedRoles)`:** Ensures membership AND checks the role.
- **Security Rule:** Never trust a `workspaceId` passed from the client for sensitive operations. Always resolve the active workspace server-side or verify the user's membership in the provided `workspaceId`.

---

## 7. API ARCHITECTURE
- **Pattern:** REST-ish Next.js Route Handlers.
- **Conventions:**
    - Use `POST` for actions (create, login, switch workspace).
    - Use `GET` for fetching.
    - Use `PUT/PATCH` for updates and `DELETE` for removals.
    - Always `await connectDB()` at the start of handlers.
    - Always check `getCurrentUser(req)`.
- **Standard Response:** `Response.json({ ...data })` or `Response.json({ error: "..." }, { status: ... })`.

---

## 8. FRONTEND ARCHITECTURE
- **Context Usage:**
    - `useUser()`: Access user profile and workspace switching logic.
    - `useBlog()`: Access blogs, categories, and tags.
- **Services:** Do not call `fetch` directly in components. Use functions in `services/blog.services.ts` or `services/auth.services.ts`.
- **Forms:** Mix of controlled components and `FormData`.
- **Toasts:** Use `react-hot-toast` for feedback.

---

## 9. IMPORTANT DATA FLOWS

### Workspace Switching
1. Client calls `selectWorkspace(workspaceId)` in `User.context.tsx`.
2. This hits `/api/workspace/select` which sets the `activeWorkspaceId` cookie.
3. The frontend then re-fetches analytics and blogs to refresh the UI for the new workspace context.

### Blog Creation
1. Client submits `FormData` to `/api/blogpost`.
2. Server resolves `activeWorkspace`.
3. Server checks `requireMembership` and verifies the user isn't a `VIEWER`.
4. Hero images are uploaded to Cloudinary if provided.
5. Categories and Tags are created/found *within the current workspace scope*.

---

## 10. NAMING AND CODING CONVENTIONS
- **TypeScript:** Use interfaces in `app/Types/`. Be strict with types.
- **Mongoose:** Use `lean()` for GET requests for performance. Ensure models are registered (import them) to avoid "MissingSchemaError".
- **Naming:**
    - Contexts: `Name.context.tsx`
    - Services: `name.services.ts`
    - Models: `PascalCase.ts`
- **Error Handling:** Use `getErrorMessage(err)` from `lib/error.ts` on the frontend.

---

## 11. RULES FOR AI CODING AGENTS
1. **Always Enforce Workspace Scoping:** When querying Blogs, Categories, or Tags, *always* include `workspace: workspaceId` in the query filter.
2. **Server-Side Auth is Mandatory:** Every API route must verify the user via `getCurrentUser`.
3. **Use Helpers:** Use `getActiveWorkspace` and `requireMembership` in every workspace-related API.
4. **Don't Bypass Services:** Frontend components should use `services/` instead of direct `fetch` calls.
5. **No Schema Changes Without Review:** Modifying Mongoose models is a destructive action; ensure all related API routes are updated.
6. **Populate References:** When returning Blogs, populate `author`, `category`, and `tags`.
7. **Handle Loading States:** Always use the loading states provided in the contexts (`loading`, `createBlogLoading`, etc.) to disable buttons and show spinners.

---

## 12. KNOWN GOTCHAS
- **Mongoose Model Registration:** In Next.js dev mode, models can be re-registered. Use `mongoose.models.ModelName || mongoose.model(...)` pattern.
- **Populate & Lean:** If you use `.lean()`, remember that Mongoose virtuals and methods won't be available.
- **Cookie Access:** Server components and Route Handlers access cookies differently. Use `req.cookies.get()` in handlers and `cookies()` in Server Components.

---

## 13. HOW TO APPROACH NEW FEATURES
1. **Step 1:** Check if the feature requires a new model or field (update `models/`).
2. **Step 2:** Create the API route in `app/api/`. Ensure workspace scoping.
3. **Step 3:** Add the client-side call in `services/`.
4. **Step 4:** Update the relevant Context (`User` or `Blog`) to manage the state.
5. **Step 5:** Build/Update the UI components using the Context hook.
