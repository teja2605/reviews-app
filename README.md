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
   git clone https://github.com/teja2605/reviews-app.git
   cd review-app

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**

   * Copy the `.env` file and update with your Supabase credentials:

     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

## Database Setup

### 📥 Initialize the Database

1. Go to your **Supabase project → SQL Editor**
2. Create a new query and paste the following full schema script:

```sql
-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price decimal(10,2) NOT NULL DEFAULT 0.00,
  image_url text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  created_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  photos json DEFAULT '[]'::json,
  tags json DEFAULT '[]'::json,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(product_id, user_id)
);

-- Create review helpfulness table
CREATE TABLE IF NOT EXISTS review_helpfulness (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id uuid REFERENCES reviews(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  is_helpful boolean NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(review_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_helpfulness ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for products
CREATE POLICY "Products are viewable by everyone"
  ON products
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Only authenticated users can insert products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS policies for reviews
CREATE POLICY "Reviews are viewable by everyone"
  ON reviews
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can insert their own reviews"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON reviews
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
  ON reviews
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS policies for helpfulness
CREATE POLICY "Review helpfulness is viewable by everyone"
  ON review_helpfulness
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can manage their own helpfulness votes"
  ON review_helpfulness
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at);
CREATE INDEX IF NOT EXISTS idx_review_helpfulness_review_id ON review_helpfulness(review_id);

-- Insert sample products
INSERT INTO products (name, description, price, image_url, category) VALUES
('Premium Wireless Headphones', 'High-quality noise-canceling wireless headphones with 30-hour battery life and superior sound quality.', 299.99, 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800', 'electronics'),
('Smart Fitness Watch', 'Advanced fitness tracking watch with heart rate monitoring, GPS, and smartphone connectivity.', 199.99, 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=800', 'electronics'),
('Ergonomic Office Chair', 'Premium ergonomic office chair with lumbar support, adjustable height, and breathable mesh back.', 449.99, 'https://images.pexels.com/photos/2177482/pexels-photo-2177482.jpeg?auto=compress&cs=tinysrgb&w=800', 'furniture'),
('Organic Coffee Beans', 'Single-origin organic coffee beans from sustainable farms, medium roast with rich flavor profile.', 24.99, 'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=800', 'food'),
('Professional Camera Lens', '85mm f/1.4 professional portrait lens with premium optical glass and weather sealing.', 1299.99, 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800', 'electronics'),
('Bamboo Yoga Mat', 'Eco-friendly bamboo yoga mat with non-slip surface and natural antimicrobial properties.', 89.99, 'https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg?auto=compress&cs=tinysrgb&w=800', 'fitness');

-- Auto-update timestamp on review update
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

## Running the Application

### Development Mode

```bash
npm run dev
```

App available at `http://localhost:8080`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── ProductCard.tsx # Product display component
│   ├── ProductGrid.tsx # Products grid layout
├── hooks/              # Custom React hooks
├── pages/              # Route components
├── integrations/       # External service integrations
└── lib/                # Utility functions
```

---

## Usage

### For Users

* Browse and review products
* Rate and comment (after login)

### For Admins

* Add/edit/delete products at `/add-product`
* Moderate reviews and manage catalog

---

## Deployment

Can be deployed on:

* **Vercel**
* **Netlify**
* **Railway**
* Or any modern static hosting platform
