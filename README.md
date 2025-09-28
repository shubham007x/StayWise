# StayWise - Property Booking Platform

A full-stack property booking platform built with Next.js, Node.js, Express, MongoDB, and TypeScript.

<img width="1919" height="912" alt="image" src="https://github.com/user-attachments/assets/688fd4a4-75b5-4f0b-bc5b-2055180746f8" />
<img width="1916" height="911" alt="image" src="https://github.com/user-attachments/assets/96ada6cd-ede7-462e-93bd-a1e71660ac46" />
<img width="1916" height="911" alt="image" src="https://github.com/user-attachments/assets/af5b5284-2c6a-45dd-b1f2-293933920307" />




## 🚀 Features

### Core Functionality
- **User Authentication**: JWT-based auth with role-based access control
- **Property Search & Filtering**: Advanced search with multiple filters
- **Booking Management**: Create, view, and manage bookings
- **Admin Dashboard**: Admin can view all bookings across the platform
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Updates**: Optimistic updates with TanStack Query

### User Features
- User registration and login
- Browse and search properties
- Filter by type, price, location, capacity
- View detailed property information
- Book properties with date selection
- View personal booking history
- Profile management

### Admin Features
- View all platform bookings
- Manage all users and properties
- System-wide booking oversight

## 🛠 Tech Stack

### Backend
- **Node.js** with **Express.js**
- **TypeScript** for type safety
- **MongoDB** with **Mongoose ODM**
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation
- **Helmet** for security
- **CORS** for cross-origin requests
- **Rate Limiting** for API protection

### Frontend
- **Next.js 14** with App Router
- **TypeScript**
- **Tailwind CSS** for styling
- **TanStack Query** for state management
- **React Hook Form** for form handling
- **React DatePicker** for date selection
- **Lucide React** for icons
- **Axios** for API calls

## 📁 Project Structure

```
staywise/
├── backend/                    # Node.js Express API
│   ├── src/
│   │   ├── controllers/       # Route controllers
│   │   ├── middleware/        # Custom middleware
│   │   ├── models/           # Mongoose models
│   │   ├── routes/           # API routes
│   │   ├── scripts/          # Database seeding
│   │   ├── types/            # TypeScript types
│   │   ├── config/           # Database config
│   │   └── server.ts         # Main server file
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # Next.js React App
│   ├── src/
│   │   ├── app/              # Next.js app directory
│   │   ├── components/       # React components
│   │   ├── contexts/         # React contexts
│   │   ├── lib/              # Utilities and API
│   │   └── types/            # TypeScript types
│   ├── package.json
│   ├── tailwind.config.js
│   └── next.config.js
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn package manager

### Backend Setup

1. **Clone and navigate to backend**
```bash
mkdir staywise && cd staywise
mkdir backend && cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
Create `.env` file in the backend root:
```env
PORT=5000
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/staywise
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

4. **Database Setup**
```bash
# Seed the database with sample data
npm run seed
```

5. **Start the backend server**
```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

The backend will be running on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd ../frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
Create `.env.local` file in the frontend root:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

4. **Start the frontend server**
```bash
npm run dev
```

The frontend will be running on `http://localhost:3000`

## 🔑 Demo Accounts

After seeding the database, you can use these accounts:

### Admin Account
- **Email**: admin@staywise.com
- **Password**: admin123
- **Role**: Admin (can view all bookings)

### Test User Accounts
- **Email**: user1@example.com, user2@example.com, user3@example.com
- **Password**: password123
- **Role**: Regular users

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/signup`
Create a new user account.
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST `/api/auth/login`
Authenticate user and get JWT token.
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Property Endpoints

#### GET `/api/properties`
Get all properties with optional filtering.
**Query Parameters**:
- `search` - Search in title and description
- `type` - Property type (apartment, house, villa, studio)
- `city` - Filter by city
- `minPrice` - Minimum price per night
- `maxPrice` - Maximum price per night
- `capacity` - Minimum guest capacity
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 10)

#### GET `/api/properties/:id`
Get single property by ID.

### Booking Endpoints

#### POST `/api/bookings` (Protected)
Create a new booking.
```json
{
  "propertyId": "property_id_here",
  "checkIn": "2024-12-15T00:00:00.000Z",
  "checkOut": "2024-12-20T00:00:00.000Z",
  "guests": 4
}
```

#### GET `/api/bookings/my-bookings` (Protected)
Get current user's bookings.

#### GET `/api/bookings` (Admin Only)
Get all bookings in the system.

## 🏗 Database Models

### User Model
```typescript
{
  email: string;
  password: string; // hashed with bcrypt
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  createdAt: Date;
}
```

### Property Model
```typescript
{
  title: string;
  description: string;
  images: string[];
  location: {
    address: string;
    city: string;
    country: string;
    coordinates: [number, number];
  };
  price: number;
  capacity: number;
  amenities: string[];
  type: 'apartment' | 'house' | 'villa' | 'studio';
  owner: ObjectId; // Reference to User
  isActive: boolean;
  createdAt: Date;
}
```

### Booking Model
```typescript
{
  property: ObjectId; // Reference to Property
  user: ObjectId; // Reference to User
  checkIn: Date;
  checkOut: Date;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: Date;
}
```

## 🔒 Security Features

- **JWT Authentication** with secure token handling
- **Password Hashing** using bcrypt with salt rounds of 12
- **Input Validation** with express-validator
- **Rate Limiting** to prevent API abuse
- **CORS Configuration** for secure cross-origin requests
- **Helmet.js** for security headers
- **Environment Variables** for sensitive data
- **Role-based Access Control** for admin features

## 🎨 UI/UX Features

- **Responsive Design** - Works on all device sizes
- **Loading States** - Smooth loading indicators
- **Error Handling** - User-friendly error messages
- **Form Validation** - Real-time form validation
- **Optimistic Updates** - Instant UI updates
- **Image Galleries** - Interactive property image viewers
- **Date Pickers** - Intuitive booking date selection
- **Search & Filters** - Advanced property filtering
- **Pagination** - Efficient data loading

## 📱 Pages Overview

### Public Pages
- **Home** (`/`) - Landing page with featured properties
- **Properties** (`/properties`) - Browse all properties with filters
- **Property Details** (`/properties/[id]`) - Individual property view
- **Login** (`/login`) - User authentication
- **Signup** (`/signup`) - User registration

### Protected Pages
- **My Bookings** (`/bookings`) - User's booking history
- **Admin Dashboard** (`/bookings` - admin view) - All platform bookings

## 🚀 Deployment

### Backend Deployment (Railway/Render)

1. **Prepare for deployment**
```bash
npm run build
```

2. **Environment Variables**
Set these in your deployment platform:
```env
PORT=5000
MONGODB_URI=mongodb_uri
JWT_SECRET=your secret
FRONTEND_URL=https://your-frontend-domain.com
NODE_ENV=production
```

3. **Deploy**
- Connect your repository
- Set build command: `npm run build`
- Set start command: `npm start`

### Frontend Deployment (Vercel)

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
vercel --prod
```

3. **Environment Variables**
Set in Vercel dashboard:
```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
```

### Database (MongoDB Atlas)

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database user
4. Whitelist your deployment platform's IPs
5. Get connection string and update `MONGODB_URI`

## 🧪 Testing the Application

### Manual Testing Checklist

#### Authentication Flow
- [ ] User can sign up with valid credentials
- [ ] User can log in with correct credentials
- [ ] User cannot access protected routes without authentication
- [ ] Admin can access admin-only features
- [ ] JWT tokens are properly stored and used

#### Property Features
- [ ] Properties load on homepage and properties page
- [ ] Search functionality works correctly
- [ ] Filters work properly (type, price, location, capacity)
- [ ] Property details page shows all information
- [ ] Image gallery works correctly
- [ ] Pagination functions properly

#### Booking Flow
- [ ] Authenticated users can create bookings
- [ ] Date validation prevents invalid selections
- [ ] Guest count validation works
- [ ] Price calculation is accurate
- [ ] Booking conflicts are prevented
- [ ] Users can view their booking history
- [ ] Admin can view all bookings

#### UI/UX
- [ ] Application is responsive on all screen sizes
- [ ] Loading states display appropriately
- [ ] Error messages are user-friendly
- [ ] Navigation works correctly
- [ ] Forms validate inputs properly

## 📞 Support

If you encounter any issues:

1. Check that all environment variables are set correctly
2. Ensure MongoDB is running and accessible
3. Verify that both backend and frontend are running
4. Check the console for any error messages
5. Make sure all dependencies are installed

## 🎯 Future Enhancements

- **Payment Integration** with Stripe
- **Real-time Chat** between hosts and guests
- **Review System** for properties and users
- **Email Notifications** for booking confirmations
- **Google Maps Integration** for property locations
- **Advanced Search** with location-based filtering
- **Mobile App** using React Native
- **Property Management** for hosts to add/edit properties
- **Booking Calendar** with availability visualization
- **Multi-language Support** for international users

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**StayWise** - Find your perfect stay, anywhere in the world. 🏠✨
