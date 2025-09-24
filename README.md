# Finance Tracker

A secure, modern web application for tracking personal or business finances through password-protected workspaces. Create multiple project spaces to manage income, expenses, and visualize financial data with real-time analytics.

![Finance Tracker](https://via.placeholder.com/800x400?text=Finance+Tracker+Screenshot)

## Features

- **Secure Project Workspaces**: Create password-protected financial tracking spaces
- **Multi-project Support**: Manage multiple financial tracking projects separately
- **Income & Expense Tracking**: Record and categorize financial transactions
- **Data Visualization**: View financial data through interactive charts and graphs
- **Real-time Updates**: Instant data synchronization using Supabase
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, intuitive interface built with Tailwind CSS
- **Data Security**: Password-protected workspaces with secure authentication

## Technology Stack

- **Frontend Framework**: Next.js 14 (React)
- **Styling**: Tailwind CSS with shadcn/ui components
- **Backend/Database**: Supabase (PostgreSQL)
- **Authentication**: Custom password protection for projects
- **State Management**: React Hooks and Context
- **UI Components**: shadcn/ui component library
- **Icons**: Lucide React
- **Notifications**: Sonner toast notifications
- **Deployment**: Vercel (assumed)

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account and project

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/finance-tracker.git
   cd finance-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Supabase Configuration**
   - Create a new Supabase project
   - Create the necessary tables (`projects`, etc.) as per your schema
   - Set up row-level security policies as needed

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000` to see the application running.

## Usage Guide

### Creating a New Project Workspace
1. Navigate to the homepage
2. Fill out the "New Project Workspace" form with a name and password
3. Click "Create Project"
4. Your new project workspace will be created and you can access it immediately

### Accessing Existing Projects
1. Go to the homepage
2. Select your project from the dropdown in the "Access Project" form
3. Enter your project password
4. Click "Access Project" to enter the workspace

### Managing Finances
1. Within a project workspace, you can:
   - Add income and expense entries
   - Categorize transactions
   - View financial summaries
   - Analyze spending patterns through visualizations

## Project Structure

```
finance-tracker/
├── app/                 # Next.js app directory
│   ├── layout.tsx       # Root layout with sticky footer
│   ├── page.tsx         # Homepage
│   └── globals.css      # Global styles
├── components/          # Reusable React components
│   ├── ui/              # UI components (shadcn/ui)
│   ├── create-project-form.tsx  # Project creation form
│   ├── project-access-form.tsx  # Project access form
│   └── footer.tsx       # Site footer component
├── lib/                 # Utility functions and libraries
│   └── supabase.js      # Supabase client configuration
├── public/              # Static assets
└── ...                  # Configuration files
```

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous API key | Yes |

### Supabase Tables

The application requires the following tables in your Supabase database:

- `projects` - Stores information about each financial workspace
  - `id` (uuid, primary key)
  - `project_name` (text)
  - `password_hash` (text)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

- Additional tables may be required for transaction data, categories, etc.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Coding Standards

- Follow existing code style and formatting
- Write tests for new features
- Update documentation as needed

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Credits

- Developed by [Dario George](https://github.com/dariogeorge21)
- UI components by [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)