# MinistryLearn Frontend

A modern React-based frontend application for the Ministry Learning Platform, built with Vite, Tailwind CSS, and React Router.

## 🚀 Quick Start

### Prerequisites

- Node.js 16 or higher
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Dunamis-001/MinistryLearn-Frontend.git
   cd MinistryLearn-Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env with your configuration
   nano .env  # or use your preferred editor
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

The application will be available at `http://localhost:5173`

## 📋 Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
```

For production, update the API URL to your deployed backend:
```env
VITE_API_URL=https://your-backend-domain.com/api
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## 🎨 Tech Stack

### Core Technologies
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client

### Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library

### Forms & Validation
- **Formik** - Form management
- **Yup** - Schema validation

### Development Tools
- **ESLint** - Code linting
- **Vitest** - Testing framework
- **TypeScript** - Type checking

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.jsx      # Navigation header
│   └── ...
├── context/            # React context providers
│   └── AuthContext.jsx # Authentication context
├── pages/              # Page components
│   ├── Login.jsx       # Login page
│   ├── Register.jsx    # Registration page
│   └── ...
├── routes/             # Routing configuration
│   └── index.jsx       # Route definitions
├── services/           # API services
│   └── api.js          # Axios configuration
├── styles/             # Global styles
│   └── globals.css     # Tailwind CSS imports
├── App.jsx             # Main app component
└── main.jsx            # Application entry point
```

## 🔐 Authentication

The application uses JWT-based authentication with automatic token refresh:

- **Login**: Users can log in with email and password
- **Registration**: New users can create accounts
- **Token Management**: Automatic token refresh and storage
- **Protected Routes**: Authentication-required pages

## 🎯 Features

### User Management
- User registration and login
- Profile management
- Role-based access control

### Course Management
- Browse available courses
- Course enrollment
- Progress tracking

### Learning Experience
- Interactive lessons
- Assessments and quizzes
- Certificates and achievements

### Responsive Design
- Mobile-first approach
- Dark/light theme support
- Accessible UI components

## 🚀 Deployment

### Using Vercel (Recommended)

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Set environment variables in Vercel dashboard

### Using Netlify

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to Netlify

3. Set environment variables in Netlify dashboard

### Using Render

1. Connect your GitHub repository to Render
2. Create a new Static Site
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Set environment variables

## 🔧 Configuration

### API Configuration

The frontend communicates with the backend API through the `services/api.js` file:

```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
})
```

### CORS Configuration

Ensure your backend CORS settings include your frontend domain:

```env
CORS_ORIGINS=http://localhost:5173,https://your-frontend-domain.com
```

## 🧪 Testing

Run the test suite:
```bash
npm run test
```

## 📦 Dependencies

### Production Dependencies
- **react**: UI library
- **react-dom**: React DOM bindings
- **react-router-dom**: Client-side routing
- **axios**: HTTP client
- **formik**: Form management
- **yup**: Schema validation
- **dayjs**: Date manipulation
- **lucide-react**: Icon library

### Development Dependencies
- **@vitejs/plugin-react**: Vite React plugin
- **tailwindcss**: CSS framework
- **eslint**: Code linting
- **vitest**: Testing framework
- **@testing-library/react**: React testing utilities

## 🎨 Styling

The project uses Tailwind CSS for styling. Key features:

- **Utility-first**: Rapid UI development
- **Responsive**: Mobile-first design
- **Customizable**: Easy theme customization
- **Dark mode**: Built-in dark theme support

## 🔗 API Integration

The frontend integrates with the following backend endpoints:

- **Authentication**: `/api/auth/*`
- **Courses**: `/api/courses/*`
- **Enrollments**: `/api/enrollments/*`
- **Modules**: `/api/modules/*`
- **Lessons**: `/api/lessons/*`
- **Assessments**: `/api/assessments/*`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- **Repository**: [MinistryLearn-Frontend](https://github.com/Dunamis-001/MinistryLearn-Frontend)
- **Backend API**: [MinistryLearn-Backend](https://github.com/Dunamis-001/MinistryLearn-Backend)
- **Live Demo**: [Coming Soon]

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/Dunamis-001/MinistryLearn-Frontend/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 📝 Changelog

### v1.0.0
- Initial release
- User authentication UI
- Course browsing and enrollment
- Responsive design
- Dark/light theme support