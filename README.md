# Premium Event Decor Website

A highly responsive, premium-styled web application built for an elite event decoration and styling business. This project features high-end UI/UX interactions, sleek Framer Motion animations, and a secure Supabase backend for lead management.

## 🚀 Tech Stack

**Frontend:**
* **React** (Vite)
* **React Router Dom** (Routing)
* **Framer Motion** (Scroll reveals, smooth transitions)
* **Lucide React & React Icons** (Iconography)

**Backend & Services:**
* **Supabase** (PostgreSQL Database & Authentication)
* **Web3Forms** (Direct-to-email form submissions)

## ✨ Key Features

* **Premium Visual Design:** Dark charcoal, off-white, and muted gold color palette.
* **Responsive Layout:** Flawless experience on desktop, tablet, and mobile devices.
* **Animated Elements:** Soft scroll-reveals, hover-scaling images, and premium page transitions.
* **Dynamic Media:** HTML5 background video hero section with high-quality poster fallbacks.
* **Dual-Action Lead Capture:** Quote requests are saved instantly to the database *and* emailed to the business owner.

### 🛡️ Admin VIP Dashboard
A completely isolated, dark-mode administrative area (`/admin`). 
* **Secure Login:** Authenticated via Supabase with a premium glassmorphism UI.
* **Analytics Row:** Real-time metrics tracking total inquiries, new weekly leads, and high-value clients.
* **Ticket-Style Layout:** Quote requests are organized into clean, easy-to-read horizontal tickets.
* **Mobile-Optimized:** Transforms from a persistent side-nav into a mobile-friendly header layout on smaller screens.

## 🛠️ Setup & Local Development

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env` file in the root directory based on the `.env.example` file:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_WEB3FORMS_KEY=your_web3forms_key
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```

4. **Build for Production:**
   ```bash
   npm run build
   ```

## 📦 Deployment (Vercel)

This project is optimized for deployment on Vercel.
1. Push the repository to GitHub.
2. Import the repository in Vercel.
3. Add the three Environment Variables in the Vercel Dashboard.
4. Deploy! 

*Note: The `vercel.json` file is already included to ensure React Router paths function correctly on refresh.*
