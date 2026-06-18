# GTA Funding Admin Console

A premium, modern financial technology portal and admin management system built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase**. 

The portal features a consumer-facing landing page with service request wizards, a dedicated, multi-step application form for the **GTA Funding Merchant Cash Advance (MCA)**, and a fully interactive, dark-themed **Admin Console** with dynamic Notion-style avatars.

---

## 🌟 Key Features

### 🏦 Consumer Portal & Services
* **Service Redirection**: Interactive cards for all funding options (Merchant Cash Advance, Women Entrepreneur Loan, Grant Advisory, Startup Business Loan) with targeted routing.
* **GTA Funding MCA Application Form**: A dedicated multi-step application at `/gta-funding-mca` featuring:
  * **Step 1 (Business Info)**: Business names, address, phone number validation & automatic `(000) 000-0000` formatting, incorporation date, entity type selector (with custom inputs), employee counts, and property type.
  * **Step 2 (Funding Details)**: Funding amount, average monthly revenue, primary use of funds, and primary owner contact info.
  * **Step 3 (Success confirmation)**: Summary of submitted details.

### 🛡️ Admin Dashboard Console
* **Console URL**: Navigate to `/admin` to manage application inquiries.
* **Notion-Style Avatars**: Dynamically generated high-fidelity avatars using the Dicebear Notionists API.
* **Consolidated KPI Cards**: Live metrics reporting *Total Inquiries*, *Est. Requested Funding*, *Approved Rate*, and *Pending Reviews* (all filterable and fully functional).
* **Search & Filter Controls**: Filter by search terms, status badges (Pending, Approved, Declined), and funding options.
* **Row Detail Expansion**: Expand list items in a beautiful desktop grid showing full business metadata and fund use text.
* **Full CRUD Management**: Update status directly (Pending, Approved, Declined) or delete outdated entries directly from the interface.

---

## 🛠️ Tech Stack
* **Framework**: Next.js 15 (App Router)
* **Language**: TypeScript
* **Database & Auth**: Supabase
* **Styling**: Tailwind CSS & Framer Motion
* **Avatars**: Dicebear Notionists API

---

## 🚀 Getting Started

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18.x or later recommended).

### 2. Install Dependencies
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory (based on `.env.example`):
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Supabase Database Table Configuration
To store submissions and manage them in the Admin Console, run the following SQL script inside your **Supabase SQL Editor** to create the table and configure Row-Level Security (RLS) policies:

```sql
-- Create inquiries table
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    revenue TEXT NOT NULL,
    amount TEXT NOT NULL,
    purpose TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Declined')),
    time_in_business TEXT
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow public (anonymous) inserts for the application forms
DROP POLICY IF EXISTS "Allow public insert" ON public.inquiries;
CREATE POLICY "Allow public insert" 
ON public.inquiries 
FOR INSERT 
TO public 
WITH CHECK (true);

-- Policy 2: Allow authenticated admin console users full CRUD access
DROP POLICY IF EXISTS "Allow authenticated full access" ON public.inquiries;
CREATE POLICY "Allow authenticated full access" 
ON public.inquiries 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);
```

---

## 💻 Local Development

Run the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Production Build & Linting
Verify production compatibility and build optimization:
```bash
# Build the Next.js project
npm run build

# Run TypeScript compilation and ESLint checks
npm run lint
```

---

## 📂 Project Structure

```
├── app/
│   ├── admin/                # Admin Console dashboard
│   ├── contact/              # Contact and General Inquiry route
│   ├── gta-funding-mca/      # GTA Funding MCA Form
│   ├── globals.css           # Global CSS variables & UI styles
│   ├── layout.tsx            # Main layout configuration
│   └── page.tsx              # Home / Landing page
├── components/
│   ├── ui/                   # Shared primitive components (Inputs, Buttons, Shimmer Buttons, etc.)
│   ├── header.tsx            # Navigation Header
│   ├── footer.tsx            # Landing Footer
│   ├── services.tsx          # Services section card grid & modal routing
│   └── ...
├── lib/
│   ├── supabase.ts           # Supabase client instantiation
│   └── utils.ts              # Styling helpers
├── public/                   # Dynamic assets and background images
├── package.json              # Dependencies and scripts
└── tsconfig.json             # TypeScript configuration
```
