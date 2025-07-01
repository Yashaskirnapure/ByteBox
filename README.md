# 📦 ByteBox

ByteBox is a full-featured file storage and management system built with Next.js, Supabase, and Clerk. It offers secure authentication, cloud storage, and a responsive UI for seamless file handling — all from your browser.

## ✨ Features

- 🔐 **Authentication** – Secure login and user management with [Clerk](https://clerk.dev)
- ☁️ **File Storage** – Upload, view, and manage your files in the cloud using Imagekit.io and [Supabase Storage](https://supabase.com/storage)
- 🗂️ **Folder Organization** – Create folders and structure your files just like a real file system
- 🗑️ **Trash Management** – Soft-delete files and permanently remove them later
- 📄 **Previews & Metadata** – Preview files and view metadata like size, type, and upload time
- 🔎 **Responsive UI** – Built with [shadcn/ui](https://ui.shadcn.com) for a sleek, responsive user experience
- 🔧 **Built with**:
  - [Next.js](https://nextjs.org)
  - [TypeScript](https://www.typescriptlang.org)
  - [Supabase](https://supabase.com)
  - [Clerk](https://clerk.dev)
  - [shadcn/ui](https://ui.shadcn.com)

## 🛠️ Tech Stack

| Tool        | Purpose                           |
|-------------|-----------------------------------|
| Next.js     | Fullstack React framework         |
| TypeScript  | Safer JavaScript with types       |
| Supabase    | File storage & database backend   |
| Clerk       | User authentication and sessions  |
| Shadcn UI   | Reusable components & design system |

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Yashaskirnapure/ByteBox.git
cd bytebox
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Set Up Environment Variables

```bash
NODE_ENV=
DATABASE_URL_DEV=
DATABASE_URL_PROD=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
```

## 4. Run the Development Server

```bash
npm run dev
```