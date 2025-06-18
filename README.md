
# Review Vista Platform

A modern product review platform built with React, TypeScript, and Supabase.

## Features

- Product catalog with reviews and ratings
- User authentication and authorization
- Admin panel for product management
- Real-time review system with star ratings
- Responsive design with Tailwind CSS
- Supabase backend integration

## Technologies Used

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (Database, Authentication, Real-time)
- **State Management**: TanStack React Query
- **Routing**: React Router DOM
- **Icons**: Lucide React

## Prerequisites

Before running this project, make sure you have:

- Node.js (version 16 or higher)
- npm or yarn package manager
- A Supabase account and project

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd review-vista-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy the `.env` file and update with your Supabase credentials
   - Make sure your Supabase project has the required tables:
     - `products`
     - `reviews`
     - `profiles`

4. **Database Setup**
   - Run the provided Supabase migrations
   - Ensure RLS policies are properly configured

## Running the Application

### Development Mode
```bash
npm run dev
```
The application will be available at `http://localhost:8080`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── ProductCard.tsx # Product display component
│   ├── ProductGrid.tsx # Products grid layout
│   └── ...
├── hooks/              # Custom React hooks
├── pages/              # Route components
├── integrations/       # External service integrations
└── lib/               # Utility functions
```

## Usage

### For Users
1. Browse products on the home page
2. Sign up/login to write reviews
3. Rate products with 1-5 stars
4. Add comments to reviews

### For Admins
1. Add new products at `/add-product`
2. Manage existing products and reviews
3. Delete products if needed

## Environment Variables

Make sure to set up these environment variables in your `.env` file:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Deployment

This project can be deployed on platforms like:
- Vercel
- Netlify
- Railway
- Or any static hosting service