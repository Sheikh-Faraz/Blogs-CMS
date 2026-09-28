# Inkwell CMS

A full-stack, workspace-based **Blog Content Management System (CMS)** built with **Next.js, TypeScript, MongoDB, Mongoose, BlockNote, Google Gemini, Cloudinary, and Shadcn UI**.

Inkwell CMS provides a complete environment for creating, editing, organizing, and publishing blog content while supporting multiple workspaces, team collaboration, role-based permissions, media uploads, AI-powered writing tools, and workspace analytics.

The project also exposes public API endpoints that can be consumed by a separate frontend application such as the **Inkwell Blogs** publishing platform.

---

## ✨ Features

### 🔐 Authentication

* User registration and login
* Password hashing with `bcryptjs`
* JWT-based authentication
* JWT stored in secure HTTP-only cookies
* Protected dashboard routes
* Automatic workspace assignment on signup
* Logout functionality
* Invitation-aware authentication flow

### 📝 Blog Management

* Create, edit, and delete blog posts
* Save blogs as drafts
* Publish blog posts
* Automatically generate slugs from titles
* Workspace-specific unique slugs
* Blog categories
* Blog tags
* Hero image support
* Author information
* Blog filtering
* Pagination
* Blog status management
* Rich content stored as BlockNote document data

### ✍️ Rich Text Editor

The CMS uses **BlockNote** as the primary blog editor.

The editor supports rich blog content while preserving structured document data for rendering in the public frontend.

Additional editor functionality includes:

* Rich text formatting
* Headings
* Lists
* Quotes
* Code blocks
* Media blocks
* Tables
* Embeds
* Editor media uploads
* Copying article content
* AI-assisted editing

### 🤖 AI Writing Tools

Google Gemini is integrated into the CMS to assist with blog creation and editing.

#### AI Blog Generation

Generate a complete blog article from a title using Gemini.

The generated article can include:

* Introduction
* Structured sections
* Headings
* Lists
* Code examples
* Best practices
* Common mistakes
* FAQ
* Conclusion

#### AI Editing Actions

The editor also provides AI-powered writing actions such as:

* **Continue** — Continue writing from the end of the article
* **Conclusion** — Generate or update a conclusion
* **Improve** — Improve grammar, readability, wording, and flow
* **Simplify** — Rewrite content using simpler language
* **Professional** — Rewrite content in a professional tone

Selected BlockNote content can also be processed with contextual actions including:

* Expand
* Shorten
* Grammar correction
* Improve
* Professional rewrite

The AI editing logic is designed to preserve non-textual content such as images, videos, audio, files, tables, embeds, and other editor blocks.

### 💼 Workspace Management

Inkwell uses a workspace-based architecture so users can work across separate content environments.

Users can:

* Create workspaces
* Edit workspace information
* Switch between workspaces
* Delete workspaces
* Set and use a default workspace
* Leave workspaces
* Manage workspace members
* View workspace information
* Manage workspace-specific content

Newly created workspaces automatically assign the creator as the **OWNER**.

Workspace creation uses a MongoDB transaction to create the workspace and its initial membership together.

### 👥 Team Collaboration

Workspaces support collaborative content management through member management.

Supported roles:

| Role     | Description                                |
| -------- | ------------------------------------------ |
| `OWNER`  | Full workspace control                     |
| `ADMIN`  | Workspace and team management capabilities |
| `EDITOR` | Blog creation and editing capabilities     |
| `VIEWER` | Read-only workspace/blog access            |

Members can be:

* Invited to workspaces
* Assigned workspace roles
* Promoted or demoted according to role permissions
* Removed from workspaces
* Allowed to leave workspaces when permitted

Role management follows explicit permission rules, preventing users from modifying roles they are not authorized to manage.

### ✉️ Workspace Invitations

Workspace members with the required permissions can invite users by email.

Invitation functionality includes:

* Email-based invitations
* Role selection
* Secure random invitation tokens
* Hashed invitation tokens stored in MongoDB
* Invitation expiration
* Accept invitations
* Decline invitations
* Revoke invitations
* Resend invitations
* Pending invitation management

Invitations currently expire after **7 days**.

Invitation emails are sent through **EmailJS**.

### 📊 Workspace Analytics

The CMS provides workspace-level analytics based on stored content and membership data.

Analytics include:

* Total blogs
* Published blogs
* Draft blogs
* Total members
* Total authors
* Blog activity over time
* Author statistics
* Published vs draft activity
* Members by role
* Authors by gender
* Authors by location

The analytics interface uses chart-based visualizations for presenting workspace data.

### 🖼️ Media Uploads

Cloudinary is integrated for media management.

Supported functionality includes:

* Blog hero image uploads
* Editor media uploads
* Image URLs from external sources
* Cloudinary-hosted media
* Automatic media resource handling for editor uploads

Editor uploads use Cloudinary's automatic resource type handling, allowing images, videos, audio, and other supported files.

### 🌐 Public Blog API

The CMS provides public endpoints for the separate Inkwell Blogs frontend.

#### Get published blogs

```http
GET /api/public/blogs
```

Returns published blog posts with:

* Title
* Slug
* Hero image
* Category
* Tags
* Author
* Creation date
* Updated date

#### Get a single published blog

```http
GET /api/public/blogs/[slug]
```

Returns a published blog by its unique slug, including:

* Blog content
* Category
* Tags
* Author information
* Hero image
* Metadata

This allows the CMS to function as the content source for a separate public-facing blog application.

---

## 🛠️ Tech Stack

### Frontend

* **Next.js 16**
* **React 19**
* **TypeScript**
* **Tailwind CSS**
* **Shadcn UI**
* **Radix UI**
* **Framer Motion**
* **Lucide React**
* **React Hot Toast / Sonner**

### Editor

* **BlockNote**
* BlockNote Shadcn integration

### Backend

* **Next.js App Router**
* **Next.js Route Handlers**
* REST-style API endpoints
* Server-side authentication and authorization

### Database

* **MongoDB**
* **Mongoose**

### Authentication & Security

* **JWT**
* **jose**
* **bcryptjs**
* HTTP-only cookies
* Role-based permissions

### AI

* **Google Gemini API**
* `@google/genai`
* Gemini models for blog generation and editing

### Media

* **Cloudinary**
* `next-cloudinary`

### Email

* **EmailJS**

### Charts & Analytics

* **Recharts**
* MongoDB aggregation pipelines

### Other

* **Git**
* **GitHub**
* **Vercel**
* **Postman**

---

## 🏗️ Architecture

The project follows a modular Next.js application structure.

```text
Blogs-CMS/
│
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── signup/
│   │   └── invitation/
│   │
│   ├── (dashboard)/
│   │   ├── blogs/
│   │   ├── create-blog/
│   │   ├── edit-blog/
│   │   ├── analytics/
│   │   ├── profile/
│   │   ├── team/
│   │   ├── invitations/
│   │   └── workspace/
│   │
│   └── api/
│       ├── ai/
│       ├── analytics/
│       ├── auth/
│       ├── blogpost/
│       ├── public/
│       ├── user/
│       └── workspace/
│
├── components/
│   ├── ui/
│   ├── shadcn-studio/
│   ├── tiptap-extension/
│   ├── tiptap-icons/
│   ├── tiptap-ui/
│   └── ...
│
├── context/
│   ├── Blog.context.tsx
│   ├── Loading.context.tsx
│   └── User.context.tsx
│
├── hooks/
│   ├── use-pagination.ts
│   ├── use-workspace-permissions.ts
│   └── ...
│
├── lib/
│   ├── auth.ts
│   ├── db.ts
│   ├── permissions.ts
│   ├── workspace.ts
│   ├── cloudinary.ts
│   ├── cloudinary-upload.ts
│   └── ...
│
├── models/
│   ├── Blog.ts
│   ├── Category.ts
│   ├── Invitation.ts
│   ├── Membership.ts
│   ├── Tags.ts
│   ├── User.ts
│   ├── Workspace.ts
│   └── WorkspaceRemoval.ts
│
├── services/
│   ├── auth.services.ts
│   ├── blog.services.ts
│   └── team.services.ts
│
├── public/
│
├── middleware.ts
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## 🔑 Authentication Flow

The authentication system uses JWTs stored in HTTP-only cookies.

```text
User
 │
 ├── Signup
 │     ├── Create User
 │     ├── Hash Password
 │     ├── Create Workspace
 │     └── Create OWNER Membership
 │
 └── Login
       ├── Verify Credentials
       ├── Generate JWT
       ├── Set HTTP-only Token Cookie
       └── Set Active Workspace Cookie
```

JWT tokens expire after **7 days**.

The active workspace is also stored in an HTTP-only cookie and validated against the user's workspace membership.

---

## 🛡️ Role-Based Access Control

Permissions are defined separately from UI components and API logic.

Examples of available permissions include:

```text
VIEW_WORKSPACE
UPDATE_WORKSPACE
DELETE_WORKSPACE

VIEW_BLOGS
CREATE_BLOG
UPDATE_BLOG
DELETE_BLOG

VIEW_ANALYTICS

VIEW_TEAM
VIEW_MEMBER_DETAILS

INVITE_MEMBERS
MANAGE_MEMBER_ROLES
MANAGE_INVITATIONS

LEAVE_WORKSPACE
```

The API checks workspace membership and permissions before allowing protected operations.

This keeps authorization enforced at the backend level rather than relying only on frontend UI restrictions.

---

## 🔌 API Structure

The application uses Next.js Route Handlers for its backend API.

```text
/api
│
├── auth
│   ├── login
│   ├── signup
│   └── logout
│
├── blogpost
│   ├── create / list
│   ├── [id]
│   ├── category
│   ├── createCategory
│   ├── deleteCategory
│   ├── tag
│   └── editorUploadMedia
│
├── ai
│   ├── generate-blog
│   ├── generate-linkedin
│   ├── static-toolbar-actions
│   └── hover-selected-toolbar-actions
│
├── public
│   └── blogs
│       └── [slug]
│
├── analytics
│
├── user
│
└── workspace
    ├── create-workspace
    ├── currentActiveWorkspace
    ├── delete-workspace
    ├── invitation
    ├── leave-workspace
    ├── list
    ├── permissions
    ├── select
    ├── update-workspace
    ├── workspaceAnalyticsData
    └── [workspaceId]/members
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory.

```env
MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_google_gemini_api_key

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

EMAILJS_SERVICE_ID=your_emailjs_service_id
EMAILJS_TEMPLATE_ID=your_emailjs_template_id
EMAILJS_PUBLIC_KEY=your_emailjs_public_key
EMAILJS_PRIVATE_KEY=your_emailjs_private_key

APP_URL=http://localhost:3000
```

### Environment Variable Purpose

| Variable                | Purpose                                        |
| ----------------------- | ---------------------------------------------- |
| `MONGO_URI`             | MongoDB connection                             |
| `JWT_SECRET`            | JWT signing and verification                   |
| `GEMINI_API_KEY`        | Google Gemini AI features                      |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account                             |
| `CLOUDINARY_API_KEY`    | Cloudinary API authentication                  |
| `CLOUDINARY_API_SECRET` | Cloudinary API authentication                  |
| `EMAILJS_SERVICE_ID`    | EmailJS email service                          |
| `EMAILJS_TEMPLATE_ID`   | Invitation email template                      |
| `EMAILJS_PUBLIC_KEY`    | EmailJS public key                             |
| `EMAILJS_PRIVATE_KEY`   | EmailJS server-side access key                 |
| `APP_URL`               | Base URL used when generating invitation links |

> Never commit `.env.local` or expose private API keys and secrets.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Sheikh-Faraz/Blogs-CMS.git
```

### 2. Navigate to the project

```bash
cd Blogs-CMS
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create:

```text
.env.local
```

and add the required variables described above.

### 5. Start the development server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

---

## 📜 Available Scripts

### Development

```bash
npm run dev
```

Starts the Next.js development server.

### Production Build

```bash
npm run build
```

Creates a production build.

### Production Server

```bash
npm run start
```

Starts the production Next.js server.

### Lint

```bash
npm run lint
```

Runs ESLint.

---

## 🔄 Content Flow

The overall Inkwell architecture separates content management from public content presentation.

```text
                ┌─────────────────────┐
                │     Inkwell CMS     │
                │                     │
                │  Create Blog        │
                │  Edit Blog          │
                │  Categories         │
                │  Tags               │
                │  AI Writing         │
                │  Media Uploads      │
                │  Workspaces         │
                │  Team Management    │
                │  Analytics          │
                └──────────┬──────────┘
                           │
                           │ Public REST API
                           ▼
                ┌─────────────────────┐
                │   Inkwell Blogs     │
                │                     │
                │ Published Articles  │
                │ Blog Listings       │
                │ Blog Details        │
                │ Categories          │
                │ Authors             │
                └─────────────────────┘
```

This separation allows the CMS to manage content independently from the public-facing blog experience.

---

## 🌐 Public API Example

### Fetch published blogs

```javascript
const response = await fetch(
  `${CMS_API_URL}/api/public/blogs`
);

const blogs = await response.json();
```

### Fetch a blog by slug

```javascript
const response = await fetch(
  `${CMS_API_URL}/api/public/blogs/${slug}`
);

const blog = await response.json();
```

The separate **Inkwell Blogs** frontend uses these endpoints to display published content.

---

## 🔒 Security Considerations

The project includes several security-focused practices:

* Passwords are hashed with `bcryptjs`
* JWT authentication uses signed tokens
* JWTs are stored in HTTP-only cookies
* Production cookies use the `secure` flag
* Workspace access is validated through memberships
* API operations check workspace permissions
* Invitation tokens are generated using secure random bytes
* Invitation tokens are hashed before being stored
* Invitation tokens expire after a defined period
* Sensitive user fields are excluded from API responses where appropriate

---

## 📌 Project Highlights

This project demonstrates experience with:

* Full-stack Next.js development
* App Router architecture
* REST API development
* MongoDB data modeling
* Mongoose relationships and population
* Authentication and authorization
* Role-based access control
* Multi-workspace architecture
* Team collaboration systems
* Invitation workflows
* Rich text editing
* AI API integration
* Cloud media management
* Analytics and aggregation pipelines
* Responsive UI development
* Reusable React components
* Server-side API protection

---

## 🔗 Related Project

### Inkwell Blogs

A separate public-facing frontend that consumes the published content APIs provided by this CMS.

Repository:

https://github.com/Sheikh-Faraz/Inkwell-Frontend

---

## 🚀 Deployment

The application can be deployed to platforms that support Next.js applications, including **Vercel**.

Before deploying:

1. Add all required environment variables.
2. Configure MongoDB access for the deployment environment.
3. Configure Cloudinary credentials.
4. Configure Gemini API credentials.
5. Configure EmailJS credentials.
6. Set `APP_URL` to the deployed application URL.
7. Ensure the public API can be reached by the separate Inkwell Blogs frontend.

---

## 👨‍💻 Author

**Sheikh Faraz**

GitHub:
https://github.com/Sheikh-Faraz

LinkedIn:
https://www.linkedin.com/in/sheikh-faraz-7b7b92356

Portfolio:
https://sheikh-faraz-ahmed.netlify.app/

---

## ⭐ About the Project

Inkwell CMS was built as a full-stack content management system with a focus on **content creation, collaboration, permissions, AI-assisted writing, and separation between content management and public content delivery**.

The project is designed around a workspace-based model where teams can collaborate on blog content while maintaining different levels of access through role-based permissions.
