# Flowlo

A comprehensive project management application built by a solo developer, combining traditional task management with visual board workflows. Flowlo helps teams organize work into projects, break them down into actionable tasks, and visualize progress through customizable boards and phases.

## Features

- **User Authentication**: Secure login and registration with JWT-based sessions
- **Project Management**: Create, update, and manage projects with progress tracking
- **Task Management**: Assign tasks, set priorities, due dates, and track completion
- **Board System**: Visual workflow management with drag-and-drop functionality
- **Branch Workflows**: Customizable phases and cards for project workflows
- **Team Collaboration**: Assign team members to projects and tasks
- **Dashboard Analytics**: Overview of project stats, task completion, and team metrics
- **Responsive Design**: Modern UI built with Tailwind CSS and Lucide icons

## Tech Stack

### Frontend
- **Next.js 16**: React framework with App Router
- **React 19**: UI library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library

### Backend
- **Next.js API Routes**: Server-side API endpoints
- **Prisma ORM**: Database toolkit and query builder
- **MariaDB/MySQL**: Relational database
- **bcryptjs**: Password hashing
- **jose**: JWT token handling

### Development Tools
- **ESLint**: Code linting
- **PostCSS**: CSS processing

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/flowlo.git
   cd flowlo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (see Environment Setup below)

4. **Set up the database** (see Database Setup below)

5. **Run database migrations**
   ```bash
   npx prisma migrate deploy
   ```

6. **Generate Prisma client**
   ```bash
   npx prisma generate
   ```

## Environment Setup

Create a `.env` file in the project root with the following variables:

```env
DATABASE_URL="mysql://username:password@localhost:3306/flowlo"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
```

### Database URL Explanation:
The `DATABASE_URL` follows this format: `mysql://username:password@host:port/database`

- `mysql://` - Protocol (use `mysql://` for MySQL/MariaDB)
- `username` - Your database username (usually `root` for local development)
- `password` - Your database password (the one you set during MySQL installation)
- `localhost` - Database server location (use `127.0.0.1` if `localhost` doesn't work)
- `3306` - Port number (default MySQL port)
- `flowlo` - Database name (the database you created)

**Example**: If your MySQL root password is "mypassword123", it would be:
```
DATABASE_URL="mysql://root:mypassword123@localhost:3306/flowlo"
```

- `JWT_SECRET`: Secret key for JWT token signing (use a strong, random string in production)

**Important**: Never commit the `.env` file to version control. It's already included in `.gitignore`.

## Database Setup

Follow the detailed setup instructions in [DATABASE_SETUP.md](./DATABASE_SETUP.md).

### Quick Setup:
1. Install MySQL/MariaDB
2. Create a database named `flowlo`
3. Update `DATABASE_URL` in `.env` with your database credentials
4. Run migrations: `npx prisma migrate deploy`

## Running the Application

1. **Development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

2. **Build for production**
   ```bash
   npm run build
   npm start
   ```

3. **Linting**
   ```bash
   npm run lint
   ```

## Architecture Overview

### Backend to Frontend Flow

1. **Authentication Flow**:
   - User submits login/register form → API route (`/api/auth/login` or `/api/auth/register`)
   - Server validates credentials, creates JWT token, sets HTTP-only cookie
   - Frontend receives success response, redirects to dashboard

2. **Data Flow**:
   - Frontend components use custom hooks (e.g., `useDashboardData`, `useProjectActions`)
   - Hooks make API calls to Next.js API routes
   - API routes interact with Prisma client to query/update database
   - Data flows back through hooks to update React state

3. **Project Management**:
   - Projects API (`/api/projects`) handles CRUD operations
   - Tasks API (`/api/tasks`) manages task lifecycle
   - Branches API (`/api/branches`) handles board workflows

### Key Components

- **API Routes**: RESTful endpoints in `/src/app/api/`
- **Database Models**: Prisma schema defines User, Project, Task, Branch, etc.
- **Frontend Hooks**: Custom hooks in `/src/app/hooks/` for data fetching and state management
- **Components**: Reusable UI components in `/src/components/`
- **Utils**: Helper functions for data processing and formatting

## API Overview

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/session` - Get current session

### Projects
- `GET /api/projects` - List user projects
- `POST /api/projects` - Create new project
- `GET /api/projects/[id]` - Get project details
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

### Tasks
- `GET /api/tasks` - List tasks (with filters)
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task

### Branches (Boards)
- `GET /api/branches` - List branches
- `POST /api/branches` - Create branch
- `GET /api/branches/[id]` - Get branch details
- `PUT /api/branches/[id]` - Update branch
- `DELETE /api/branches/[id]` - Delete branch

## Project Status & Development Notes

This is my solo project for my information management studies, built as a comprehensive learning experience in full-stack development. Flowlo is inspired by Notion but offers more versatile functions and detailed statistics. This project is still in active development as I continue learning about database management optimization and system architecture.

### Notable Features Already Implemented
- **Complete Authentication System**: JWT-based login/registration with secure password hashing
- **Project Management**: Full CRUD operations with progress tracking and team assignment
- **Task Management**: Comprehensive task system with priorities, due dates, and status tracking
- **Board System**: Visual workflow management with customizable phases and drag-and-drop cards
- **Dashboard Analytics**: Real-time statistics and project overview
- **Responsive Design**: Modern UI with Tailwind CSS and intuitive navigation

### Current Flaws & Technical Debt

#### Code Architecture Issues
- **Spaghetti Code**: The `projectService.ts` file is 1,266 lines long and handles too many responsibilities
- **Large Components**: Several page components exceed 500+ lines (e.g., project detail page at 696 lines)
- **Mixed Concerns**: Business logic, API calls, and UI state management are often combined in single files
- **Console Logging**: Debug `console.log` statements remain in production code

#### Database Design Issues
- **JSON String Storage**: Team members and tags stored as JSON strings instead of proper relations
- **Redundant Fields**: Some calculated fields (like task counts) stored in database instead of computed
- **Inconsistent Status Values**: Multiple status enums across different models (`todo` vs `not started`)
- **Missing Indexes**: No explicit database indexes defined for performance

#### Performance Issues
- **No Caching**: All data fetched fresh on each page load
- **Large API Responses**: Some endpoints return more data than needed
- **No Pagination**: Task and project lists load all items at once
- **Heavy Components**: Large components re-render frequently due to state changes

#### User Experience Issues
- **No Loading States**: Some operations lack proper loading indicators
- **Limited Error Handling**: Basic error messages without user-friendly recovery options
- **No Undo Functionality**: Destructive actions (delete) cannot be undone
- **Missing Keyboard Shortcuts**: No keyboard navigation support

### Future Improvements Planned

#### Architecture Refactoring
- **Service Layer Separation**: Break down `projectService.ts` into focused modules:
  - `projectService.ts` - Project CRUD operations
  - `taskService.ts` - Task management
  - `boardService.ts` - Board and workflow logic
  - `statsService.ts` - Analytics and calculations
- **Component Decomposition**: Split large components into smaller, reusable pieces
- **Custom Hooks**: Extract business logic into dedicated hooks
- **Context Providers**: Implement proper state management for global app state

#### Database Optimization
- **Proper Relations**: Replace JSON strings with proper foreign key relationships
- **Database Indexes**: Add indexes on frequently queried fields
- **Query Optimization**: Implement efficient queries with proper joins
- **Data Migration**: Clean up existing data structure issues

#### Performance Enhancements
- **React Query/SWR**: Implement data caching and synchronization
- **Code Splitting**: Lazy load components and routes
- **Image Optimization**: Implement proper image handling and optimization
- **Database Connection Pooling**: Optimize database connections

#### Feature Additions
- **Real-time Collaboration**: Live updates using WebSockets
- **File Attachments**: Document and image upload functionality
- **Advanced Filtering**: Complex search and filter options
- **Time Tracking**: Built-in time logging and reporting
- **Notifications**: Email and in-app notifications
- **API Rate Limiting**: Prevent abuse and ensure fair usage
- **Audit Logs**: Track changes and user actions

#### User Experience Improvements
- **Dark Mode**: Theme switching capability
- **Keyboard Shortcuts**: Full keyboard navigation support
- **Offline Support**: Progressive Web App features
- **Accessibility**: WCAG compliance and screen reader support
- **Mobile App**: React Native companion app

### Learning Outcomes
This 2-week full-stack project has been an incredible learning experience covering:
- **Full-Stack Development**: Next.js, Prisma, MySQL, TypeScript
- **Modern React Patterns**: Hooks, Context, Custom Components
- **Database Design**: Schema planning, migrations, query optimization
- **Authentication**: JWT, password security, session management
- **UI/UX Design**: Responsive design, user-centered interfaces
- **Project Architecture**: Code organization, separation of concerns
- **Performance Optimization**: Identifying and fixing bottlenecks

### Development Timeline
- **Week 1**: Core authentication, basic project/task CRUD, initial UI
- **Week 2**: Board system, advanced features, dashboard analytics, UI polish

The project demonstrates a solid foundation but highlights the importance of iterative refactoring and architectural planning in software development.

### Environment Files (MUST REMOVE)
- `.env` - Contains sensitive information like database credentials and JWT secrets
- `.env.local` - Local environment overrides
- `.env.production` - Production environment variables

**Before pushing to GitHub, run:**
```bash
git rm --cached .env
```
This removes the `.env` file from Git tracking while keeping it locally.

### Database Files
- Database dumps or backups
- Local database files (if using SQLite for development)

### Build Artifacts (Auto-generated files)
- `node_modules/` - Dependencies (recreated with `npm install`)
- `.next/` - Next.js build output (generated by `npm run build`)
- Build artifacts are temporary files created during development/building that can be regenerated

### Sensitive Configuration
- API keys, secrets, or tokens hardcoded in code
- Private SSH keys or certificates

### Setup Checklist for New Contributors
- [ ] Copy `.env.example` to `.env` and fill in values
- [ ] Set up MySQL/MariaDB database as per DATABASE_SETUP.md
- [ ] Run `npx prisma migrate deploy`
- [ ] Run `npx prisma generate`
- [ ] Install dependencies with `npm install`
- [ ] Start development server with `npm run dev`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
