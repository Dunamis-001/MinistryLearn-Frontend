# MinistryLearn Platform

A comprehensive Learning Management System (LMS) designed for ministry and educational organizations. Built with modern web technologies, it provides a complete solution for course management, user authentication, assessments, and learning tracking.

## 🌟 Features

### Core Functionality
- **User Authentication & Authorization** - JWT-based auth with role management
- **Course Management** - Create, organize, and manage educational content
- **Learning Paths** - Structured modules and lessons
- **Assessments & Quizzes** - Interactive testing and evaluation
- **Progress Tracking** - Monitor learner advancement
- **Certificates** - Automated certificate generation
- **File Management** - Cloud-based media storage
- **Email Notifications** - Automated communication system

### User Roles
- **Admin** - Full platform management
- **Instructor** - Course creation and management
- **Learner** - Access to enrolled courses

## 🏗️ Architecture

The platform consists of two main components:

### Backend API (`MinistryLearn-Backend`)
- **Framework**: Flask (Python)
- **Database**: PostgreSQL (Cloud-hosted on Render)
- **Authentication**: JWT tokens
- **File Storage**: Cloudinary
- **Email Service**: SendGrid
- **API Documentation**: Swagger/OpenAPI

### Frontend Application (`MinistryLearn-Frontend`)
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context
- **HTTP Client**: Axios

## 🚀 Quick Start

### Prerequisites
- Python 3.8+ (for backend)
- Node.js 16+ (for frontend)
- PostgreSQL database (or use provided cloud database)
- Git

### 1. Clone Both Repositories

```bash
# Clone backend
git clone https://github.com/Dunamis-001/MinistryLearn-Backend.git
cd MinistryLearn-Backend

# Clone frontend (in separate terminal)
git clone https://github.com/Dunamis-001/MinistryLearn-Frontend.git
cd MinistryLearn-Frontend
```

### 2. Backend Setup

```bash
cd MinistryLearn-Backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Set up database
flask db upgrade
python seed_data.py

# Start backend server
python wsgi.py
```

Backend will be available at `http://127.0.0.1:5000`

### 3. Frontend Setup

```bash
cd MinistryLearn-Frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API URL

# Start frontend server
npm run dev
```

Frontend will be available at `http://localhost:5173`

## 🔧 Configuration

### Required Services

1. **Database**: PostgreSQL
   - Local installation or cloud service (Render recommended)
   - Update `DATABASE_URL` in backend `.env`

2. **File Storage**: Cloudinary
   - Sign up at [cloudinary.com](https://cloudinary.com)
   - Update `CLOUDINARY_URL` in backend `.env`

3. **Email Service**: SendGrid
   - Sign up at [sendgrid.com](https://sendgrid.com)
   - Update `SENDGRID_API_KEY` in backend `.env`

### Environment Variables

#### Backend (.env)
```env
FLASK_ENV=development
FLASK_APP=wsgi.py
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-secure-jwt-secret
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
SENDGRID_API_KEY=your-sendgrid-api-key
CORS_ORIGINS=http://localhost:5173,http://your-frontend-ip:5173
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 📚 API Documentation

Once the backend is running, access the interactive API documentation:
- **Swagger UI**: `http://127.0.0.1:5000/docs/`
- **Health Check**: `http://127.0.0.1:5000/health/`

## 🚀 Deployment

### Backend Deployment (Render)

1. Connect GitHub repository to Render
2. Create new Web Service
3. Set environment variables
4. Deploy

### Frontend Deployment (Vercel/Netlify)

1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set environment variables
4. Deploy

## 🧪 Testing

### Backend Tests
```bash
cd MinistryLearn-Backend
python test_app_load.py
```

### Frontend Tests
```bash
cd MinistryLearn-Frontend
npm run test
```

## 📁 Project Structure

```
MinistryLearn/
├── MinistryLearn-Backend/     # Flask API
│   ├── app/
│   │   ├── models/           # Database models
│   │   ├── resources/        # API endpoints
│   │   ├── services/         # Business logic
│   │   └── schemas/          # Data validation
│   ├── migrations/           # Database migrations
│   ├── requirements.txt      # Python dependencies
│   └── wsgi.py              # Application entry point
│
└── MinistryLearn-Frontend/   # React Application
    ├── src/
    │   ├── components/       # React components
    │   ├── pages/           # Page components
    │   ├── services/        # API services
    │   └── context/         # React context
    ├── package.json         # Node dependencies
    └── vite.config.js       # Vite configuration
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Input validation and sanitization
- SQL injection protection
- Environment variable protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- **Backend Repository**: [MinistryLearn-Backend](https://github.com/Dunamis-001/MinistryLearn-Backend)
- **Frontend Repository**: [MinistryLearn-Frontend](https://github.com/Dunamis-001/MinistryLearn-Frontend)
- **Backend deployed on Render**: https://ministrylearn-backend-2.onrender.com
- **Frontend deployed on Netlify**: https://dainty-treacle-31643e.netlify.app/

## 🆘 Support

For support and questions:
1. Check the Issues section in respective repositories
2. Create a new issue with detailed information
3. Contact the development team

## 📝 Changelog

### v1.0.0 (Current)
- ✅ User registration and authentication
- ✅ Course management system
- ✅ Module and lesson structure
- ✅ Assessment and quiz system
- ✅ File upload capabilities
- ✅ Email notification system
- ✅ Role-based access control
- ✅ Responsive frontend design
- ✅ Cloud database integration
- ✅ Production-ready deployment

## 🎯 Roadmap

### Upcoming Features
- [ ] Real-time notifications
- [ ] Video streaming integration
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Integration with external LMS platforms
- [ ] Multi-language support
- [ ] Advanced reporting features

---


