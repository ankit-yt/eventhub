# EventHub - Event Management Platform

A modern MERN stack event management platform for students to discover, register, and manage campus events.

## Features

- **Student Dashboard**: Browse and register for events with search and filtering
- **Admin Dashboard**: Create, edit, and manage events with analytics
- **Authentication**: JWT-based authentication with role-based access control
- **Real-time Updates**: Event registration and attendance tracking
- **Analytics**: Event statistics and registration trends
- **Responsive Design**: Mobile-first design with Tailwind CSS

## Tech Stack

### Frontend
- Next.js 16 with App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Shadcn/UI Components
- Recharts for analytics

### Backend
- Express.js
- MongoDB
- JWT Authentication
- Bcryptjs for password hashing

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running locally or connection string

### Installation

1. **Install Frontend Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Install Backend Dependencies**
   \`\`\`bash
   cd server
   npm install
   \`\`\`

3. **Setup Environment Variables**
   
   Create `.env.local` in the root:
   \`\`\`
   NEXT_PUBLIC_API_URL=http://localhost:5000
   \`\`\`

   Create `server/.env`:
   \`\`\`
   MONGODB_URI=mongodb://localhost:27017/eventhub
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   PORT=5000
   NODE_ENV=development
   \`\`\`

### Running the Application

1. **Start Backend Server**
   \`\`\`bash
   cd server
   npm start
   \`\`\`
   Backend runs on `http://localhost:5000`

2. **Start Frontend Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`
   Frontend runs on `http://localhost:3000`

## Project Structure

\`\`\`
├── app/
│   ├── page.tsx                 # Landing page
│   ├── login/page.tsx           # Login page
│   ├── signup/page.tsx          # Signup page
│   ├── dashboard/page.tsx       # Student dashboard
│   ├── events/[id]/page.tsx     # Event details
│   ├── admin/page.tsx           # Admin dashboard
│   ├── admin/create-event/      # Create event page
│   └── admin/edit-event/[id]/   # Edit event page
├── components/
│   ├── ui/                      # Shadcn UI components
│   └── protected-route.tsx      # Route protection wrapper
├── lib/
│   ├── api.ts                   # Centralized API utility
│   └── auth-context.tsx         # Authentication context
├── middleware.ts                # Next.js middleware for route protection
├── server/
│   ├── models/                  # MongoDB models
│   ├── routes/                  # API routes
│   ├── middleware/              # Express middleware
│   └── server.js                # Express server entry point
└── public/                      # Static assets
\`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create event (admin only)
- `PUT /api/events/:id` - Update event (admin only)
- `DELETE /api/events/:id` - Delete event (admin only)
- `POST /api/events/:id/register` - Register for event (protected)
- `POST /api/events/:id/unregister` - Unregister from event (protected)

## User Roles

- **Student**: Can browse events, register/unregister, view profile
- **Admin**: Can create, edit, delete events, view analytics

## Authentication Flow

1. User signs up or logs in
2. Backend returns JWT token
3. Token stored in localStorage
4. Token included in Authorization header for protected requests
5. Middleware validates token on protected routes
6. AuthContext manages global auth state

## Security Features

- JWT-based authentication with 7-day expiry
- Password hashing with bcryptjs
- Role-based access control (RBAC)
- Protected API routes with middleware
- Protected frontend routes with ProtectedRoute component
- Environment variables for sensitive data

## Development

### Adding New Features

1. Create API endpoint in `server/routes/`
2. Add API utility function in `lib/api.ts`
3. Create frontend component/page
4. Use `useAuth()` hook for authentication
5. Use API utilities for backend calls

### Database Schema

**User**
- name, email, password, role, avatar, registeredEvents, createdAt

**Event**
- title, description, category, date, venue, bannerUrl, resources, personnel, attendees, createdBy, createdAt, updatedAt

## Deployment

### Frontend (Vercel)
\`\`\`bash
npm run build
vercel deploy
\`\`\`

### Backend (Any Node.js hosting)
\`\`\`bash
cd server
npm run build
npm start
\`\`\`

## Future Enhancements

- Email notifications for event updates
- Event calendar view
- User ratings and reviews
- Event search with advanced filters
- Social sharing features
- Mobile app
- Payment integration for paid events
- Event capacity management
- Waitlist functionality

## License

MIT
