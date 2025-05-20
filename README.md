
###### BitCred 🔐 : Decentralized Credit Reputation Protocol Powered by Bitcoin ######

## 📖 Abstract

BitCred is a groundbreaking decentralized credit reputation protocol that analyzes Bitcoin wallet activity to generate verifiable credit scores with zero-knowledge proofs. By leveraging blockchain data and privacy-preserving cryptography, BitCred enables users to establish creditworthiness in the Web3 ecosystem without compromising their privacy or revealing sensitive financial information.

In traditional finance, credit scores are centralized, opaque, and often inaccessible to many individuals. BitCred disrupts this paradigm by creating a transparent, decentralized alternative that empowers users to own and control their financial reputation while maintaining privacy through advanced cryptographic techniques.

## ✨ Features

- **Privacy-Preserving Analysis**: Generate credit scores from Bitcoin wallet activity without revealing sensitive data
- **Zero-Knowledge Proofs**: Create cryptographic proofs that verify creditworthiness without exposing underlying data
- **Verifiable Credentials**: Download W3C-compliant Verifiable Credentials to share with third parties
- **Public Verification**: Allow anyone to verify the authenticity of BitCred scores without accessing private data
- **Comprehensive Dashboard**: Track score history, compare against benchmarks, and manage wallet records
- **Secure Authentication**: User authentication with robust security measures and row-level data protection
- **Real-Time Analysis**: Instant credit score generation based on transaction history, volume, and wallet age
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices

## 🎬 Demo Video

▶️ [Watch the full demo on YouTube](https://youtu.be/demo-link)

## 🌐 Live Site

Experience BitCred in action: [Bitcred-webapp](https://zolodix.com)

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **State Management**: React Context API
- **Animations**: Framer Motion
- **Data Visualization**: Recharts

### Backend

- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **API Routes**: Next.js API Routes
- **Serverless Functions**: Vercel

### Blockchain & Cryptography

- **Blockchain**: Bitcoin
- **Data Provider**: Rebar Labs API
- **Zero-Knowledge Proofs**: circomlibjs
- **Verifiable Credentials**: W3C VC Data Model

### DevOps

- **Hosting**: Vercel
- **Version Control**: Git & GitHub
- **CI/CD**: Vercel GitHub Integration

## 🧩 How It Works

BitCred operates through a four-step process:

1. **Wallet Analysis**: Users input their Bitcoin wallet address for analysis. BitCred securely fetches transaction history, volume, and age data through the Rebar Labs API.
2. **Score Calculation**: The system applies a proprietary algorithm to calculate a credit score (0-850) based on transaction patterns, wallet age, and activity levels.
3. **ZK Proof Generation**: BitCred generates a zero-knowledge proof that cryptographically verifies the score's authenticity without revealing the underlying wallet data.
4. **Verifiable Credential**: Users receive a W3C Verifiable Credential containing their credit score and ZK proof, which can be shared with third parties while maintaining privacy.

Third parties can verify the credential's authenticity through BitCred's public verification page without accessing the user's private wallet data.

## 🏗️ Architecture Overview

BitCred follows a modern, serverless architecture:

```plaintext
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Client (Next)  │◄────┤  API Routes     │◄────┤  Rebar Labs API │
│                 │     │                 │     │                 │
└────────┬────────┘     └────────┬────────┘     └─────────────────┘
         │                       │
         │                       │
         ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │
│  ZK Proof Gen   │     │  Supabase       │
│                 │     │  (Auth & DB)    │
└─────────────────┘     └─────────────────┘
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Supabase account
- Rebar Labs API key

### Installation

1. **Clone the repository**:

```shellscript
git clone https://github.com/yourusername/bitcred.git
cd bitcred
```

2. **Install dependencies**:

```shellscript
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**:

```shellscript
cp .env.example .env.local
```

4. **Set up Supabase**:

- Create a new Supabase project
- Run the SQL commands in `schema.sql` to create the necessary tables
- Set up Row Level Security policies as specified in the file

5. **Run the development server**:

```shellscript
npm run dev
# or
yarn dev
```

6. **Open your browser**:
Navigate to (http://localhost:3000)

### Deployment

To deploy to Vercel:

- Push your code to GitHub
- Import the project in Vercel
- Set up the environment variables
- Deploy

## 🔐 Environment Variables

Create a `.env.local` file with the following variables:

```plaintext
# Client-side environment variables (must be prefixed with NEXT_PUBLIC_)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Server-side environment variables (do not prefix with NEXT_PUBLIC_)
REBAR_API_KEY=your_rebar_api_key_here
API_KEY=your_api_key_here
```

## 📁 Folder Structure

```plaintext
bitcred/
├── app/                  # Next.js App Router pages and API routes
│   ├── api/              # API endpoints
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # User dashboard
│   ├── settings/         # User settings
│   ├── verify/           # Credential verification
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # React components
│   ├── ui/               # UI components (shadcn)
│   └── ...               # Feature-specific components
├── lib/                  # Utility functions and shared code
│   ├── auth-context.tsx  # Authentication context
│   ├── env.ts            # Environment variable helper
│   ├── supabase-client.ts # Supabase client
│   └── zk.ts             # ZK proof generation
├── public/               # Static assets
├── .env.example          # Example environment variables
├── next.config.js        # Next.js configuration
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## 🏆 Hackathon Information

BitCred was built for the Bitcoin Hackathon that started on April 7, 2025. All code was written during the hackathon timeline after June 10, 2025, when i joined the competition. The project represents our vision for a privacy-preserving, decentralized credit reputation system built on Bitcoin.

---

Made with ❤️ by the Tafsir Raza
