# Happoint

Appointment booking and scheduling platform that allows users to create events, manage availability, and let clients book meetings seamlessly.

## Features

- 🎯 **Event Management**: Create, edit, and manage events with custom durations
- 📅 **Availability Scheduling**: Set your weekly availability with timezone support
- 🔗 **Public Booking Pages**: Share your profile link for clients to book appointments
- 📧 **Google Calendar Integration**: Automatically sync bookings with Google Calendar (optional)
- ⏰ **Smart Time Slot Validation**: Automatically validates available time slots based on your schedule and existing calendar events
- 🔐 **Secure Authentication**: Powered by Clerk for secure user authentication
- 🎨 **Modern UI**: Built with Tailwind CSS for a clean, responsive design

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Neon](https://neon.tech/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Date Handling**: [date-fns](https://date-fns.org/) + [date-fns-tz](https://github.com/marnusw/date-fns-tz)
- **Calendar Integration**: [Google Calendar API](https://developers.google.com/calendar)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)

## Prerequisites

- Node.js 20+ and pnpm (or npm/yarn)
- PostgreSQL database (Neon recommended)
- Clerk account for authentication
- Google Cloud project (optional, for Calendar integration)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd happoint
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Google OAuth (Optional - for Calendar integration)
GOOGLE_OAUTH_CLIENT_ID="your-client-id"
GOOGLE_OAUTH_CLIENT_SECRET="your-client-secret"
GOOGLE_OAUTH_REDIRECT_URL="http://localhost:3000/api/auth/callback/google"
```

### 4. Set up the database

Generate migrations:

```bash
pnpm db:generate
```

Run migrations:

```bash
pnpm db:migrate
```

(Optional) Open Drizzle Studio to view your database:

```bash
pnpm db:studio
```

### 5. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
happoint/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication routes
│   ├── (main)/
│   │   ├── (private)/     # Protected routes (events, schedule)
│   │   └── (public)/      # Public booking pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── forms/             # Form components
│   ├── events/            # Event-related components
│   └── icons/             # Icon components
├── server/                # Server-side code
│   ├── actions/           # Server actions
│   ├── google/            # Google Calendar integration
│   └── utils.ts           # Server utilities
├── drizzle/               # Database schema and migrations
├── schema/                # Zod validation schemas
├── types/                 # TypeScript type definitions
├── lib/                   # Utility functions
└── constants/             # App constants
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm db:generate` - Generate database migrations
- `pnpm db:migrate` - Run database migrations
- `pnpm db:studio` - Open Drizzle Studio

## Key Features Explained

### Event Management

Users can create events with:

- Custom names and descriptions
- Duration settings (in 15-minute increments)
- Active/inactive status

### Availability Scheduling

Set your weekly availability:

- Configure time slots for each day of the week
- Timezone support for accurate scheduling
- Multiple time ranges per day

### Public Booking

- Each user gets a public profile page
- Shareable booking links for specific events
- Real-time availability checking
- Automatic conflict detection with Google Calendar

### Google Calendar Integration

- Optional OAuth connection
- Automatic event creation in Google Calendar
- Conflict detection with existing calendar events
- Works seamlessly even without Google Calendar connected

## Database Schema

### Events

- User-created events with duration and metadata

### Schedules

- User availability settings with timezone

### Availabilities

- Day-of-week availability slots linked to schedules

## Development

### Adding a New Feature

1. Create the database schema in `drizzle/schema.ts` if needed
2. Generate and run migrations: `pnpm db:generate && pnpm db:migrate`
3. Create Zod schemas in `schema/` for validation
4. Implement server actions in `server/actions/`
5. Create UI components in `components/`
6. Add routes in `app/` directory

### Code Style

- TypeScript strict mode enabled
- ESLint for code quality
- React Server Components by default
- Server Actions for mutations

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

Make sure to set all required environment variables in your deployment platform:

- `DATABASE_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `GOOGLE_OAUTH_CLIENT_ID` (optional)
- `GOOGLE_OAUTH_CLIENT_SECRET` (optional)
- `GOOGLE_OAUTH_REDIRECT_URL` (optional)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For issues and questions, please open an issue in the repository.
