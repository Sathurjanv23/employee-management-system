# Employee Management System

A full-stack web application for managing employee information with user authentication, role-based access control, and comprehensive CRUD operations.

## 🚀 Features

- **User Authentication**
  - Secure registration and login
  - JWT-based authentication
  - Password reset via email
  - Change password functionality

- **User Management**
  - Create, read, update, and delete user records
  - Search and filter users
  - Profile management
  - User statistics and dashboard

- **Security**
  - Spring Security integration
  - Password encryption
  - Protected API endpoints
  - CORS configuration

## 🛠️ Tech Stack

### Backend

- **Java 17**
- **Spring Boot 3.5.0**
- **MongoDB** - NoSQL database
- **Spring Security** - Authentication & authorization
- **JWT (JSON Web Tokens)** - Secure token-based authentication
- **Spring Mail** - Email notifications
- **Maven** - Dependency management

### Frontend

- **Next.js 15.2.4** - React framework
- **React 18** - UI library
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Java Development Kit (JDK) 17** or higher
- **Maven 3.6+**
- **Node.js 18+** and **npm**
- **MongoDB 4.4+** (running locally or remote instance)
- **Git**

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd employee-management-system
```

### 2. Backend Setup

#### Configure MongoDB

Make sure MongoDB is running on `localhost:27017` or update the connection string in `application.properties`.

#### Configure Email (Optional)

Edit `backend/src/main/resources/application.properties`:

```properties
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
```

> **Note:** For Gmail, you need to use an [App Password](https://support.google.com/accounts/answer/185833).

#### Update JWT Secret (Recommended for Production)

```properties
jwt.secret=YourCustomSecretKeyHere
```

#### Build and Run Backend

```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```

Or on Windows:

```bash
cd backend
mvnw.cmd clean install
mvnw.cmd spring-boot:run
```

The backend will start on `http://localhost:8080`

### 3. Frontend Setup

#### Install Dependencies

```bash
cd frontend
npm install
```

#### Run Development Server

```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

## 🎯 Usage

1. **Start MongoDB** - Ensure MongoDB is running
2. **Start Backend** - Run the Spring Boot application (port 8080)
3. **Start Frontend** - Run the Next.js application (port 3000)
4. **Access Application** - Open browser to `http://localhost:3000`

### Default Routes

- `/` - Home page
- `/login` - User login
- `/register` - New user registration
- `/dashboard` - Main dashboard (protected)
- `/users` - User management (protected)
- `/profile` - User profile (protected)
- `/settings` - Application settings (protected)
- `/add-user` - Add new user (protected)
- `/edit-user/[id]` - Edit user (protected)
- `/forgot-password` - Password recovery
- `/reset-password` - Reset password with token

## 📁 Project Structure

```
employee-management-system/
├── backend/
│   ├── src/main/java/com/example/backend/
│   │   ├── config/          # Configuration classes
│   │   ├── controller/      # REST API controllers
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── exception/       # Exception handlers
│   │   ├── model/           # Entity models
│   │   ├── repository/      # Data access layer
│   │   ├── security/        # Security configuration
│   │   └── service/         # Business logic
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
└── frontend/
    ├── app/                 # Next.js pages
    ├── components/          # React components
    ├── hooks/              # Custom React hooks
    ├── services/           # API services
    ├── utils/              # Utility functions
    └── package.json
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Users

- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Health

- `GET /health` - Health check endpoint

## 🔐 Environment Variables

### Backend (`application.properties`)

```properties
# MongoDB
spring.data.mongodb.uri=mongodb://localhost:27017/employee_management

# Server
server.port=8080

# JWT
jwt.secret=YourSecretKey

# Frontend URL
app.frontend.base-url=http://localhost:3000

# Mail Configuration
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
```

### Frontend

Create a `.env.local` file if needed for custom API endpoints:

```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## 🏗️ Building for Production

### Backend

```bash
cd backend
./mvnw clean package
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

### Frontend

```bash
cd frontend
npm run build
npm start
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
./mvnw test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Support

For support, email your-email@example.com or open an issue in the repository.

## 🙏 Acknowledgments

- Spring Boot Team
- Next.js Team
- MongoDB Team
- All contributors

---

**Built with ❤️ using Spring Boot and Next.js**
