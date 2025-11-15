# UBAISH Website Backend API Documentation

## Overview

This backend provides a comprehensive API for managing alumni, documents, fees, and authentication with role-based access control.

## Features

- ✅ **User Authentication**: JWT-based authentication for alumni and admins
- ✅ **Role-Based Access Control**: Different permissions for alumni, students, and admins
- ✅ **Debt Verification**: Automatic checking of outstanding fees before allowing document downloads
- ✅ **Document Management**: Secure storage and retrieval of transcripts, certificates, and diplomas
- ✅ **Database Support**: PostgreSQL, MySQL, and SQLite (for development)

## Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Database

Create a `.env` file in the `backend` directory:

```env
# Django Settings
DJANGO_SECRET_KEY=your-secret-key-here
DEBUG=True

# Database Configuration
# For SQLite (default)
DB_ENGINE=sqlite3
DB_NAME=db.sqlite3

# For PostgreSQL
DB_ENGINE=postgresql
DB_NAME=ubaish_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

# For MySQL
DB_ENGINE=mysql
DB_NAME=ubaish_db
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=3306
```

### 3. Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 4. Create Superuser (Admin)

```bash
python manage.py createsuperuser
```

### 5. Run Server

```bash
python manage.py runserver
```

## API Endpoints

### Authentication

#### Register
- **POST** `/api/auth/register/`
- **Body:**
  ```json
  {
    "username": "alumni_user",
    "email": "alumni@example.com",
    "password": "secure_password",
    "password_confirm": "secure_password",
    "role": "ALUMNI",
    "phone_number": "+1234567890",
    "graduation_year": 2020,
    "student_id": "STU123456",
    "first_name": "John",
    "last_name": "Doe"
  }
  ```
- **Response:** User data + JWT tokens

#### Login
- **POST** `/api/auth/login/`
- **Body:**
  ```json
  {
    "username": "alumni_user",
    "password": "secure_password"
  }
  ```
- **Response:** User data + JWT tokens

#### Get Profile
- **GET** `/api/auth/profile/`
- **Headers:** `Authorization: Bearer <access_token>`
- **Response:** Current user's profile

#### Update Profile
- **PUT/PATCH** `/api/auth/profile/update/`
- **Headers:** `Authorization: Bearer <access_token>`
- **Body:** Partial user data
- **Response:** Updated user data

#### Token Refresh
- **POST** `/api/auth/token/refresh/`
- **Body:**
  ```json
  {
    "refresh": "refresh_token_here"
  }
  ```
- **Response:** New access token

### Users

#### List Users
- **GET** `/api/users/`
- **Headers:** `Authorization: Bearer <access_token>`
- **Permissions:** 
  - Admins: See all users
  - Others: See only themselves
- **Response:** List of users

#### Get User Details
- **GET** `/api/users/{id}/`
- **Headers:** `Authorization: Bearer <access_token>`
- **Permissions:** Admins or own profile
- **Response:** User details

#### Get User Documents
- **GET** `/api/users/{id}/documents/`
- **Headers:** `Authorization: Bearer <access_token>`
- **Permissions:** Admins or own documents
- **Response:** List of user's documents

#### Get User Fees
- **GET** `/api/users/{id}/fees/`
- **Headers:** `Authorization: Bearer <access_token>`
- **Permissions:** Admins or own fees
- **Response:** List of user's fees

### Documents

#### List Documents
- **GET** `/api/documents/`
- **Headers:** `Authorization: Bearer <access_token>`
- **Permissions:** 
  - Admins: See all documents
  - Others: See only own documents
- **Response:** List of documents

#### Get Document
- **GET** `/api/documents/{id}/`
- **Headers:** `Authorization: Bearer <access_token>`
- **Response:** Document details

#### Upload Document
- **POST** `/api/documents/`
- **Headers:** `Authorization: Bearer <access_token>`
- **Body (multipart/form-data):**
  ```
  title: "My Transcript"
  document_type: "TRANSCRIPT"
  file: <file>
  ```
- **Response:** Created document

#### Download Document
- **GET** `/api/documents/{id}/download/`
- **Headers:** `Authorization: Bearer <access_token>`
- **Permissions:** 
  - Admins: Can download any document
  - Alumni: Can download own documents only if no outstanding debt
- **Response:** File download

#### Verify Document (Admin Only)
- **POST** `/api/documents/{id}/verify/`
- **Headers:** `Authorization: Bearer <access_token>`
- **Permissions:** Admin only
- **Response:** Verified document

#### Unverify Document (Admin Only)
- **POST** `/api/documents/{id}/unverify/`
- **Headers:** `Authorization: Bearer <access_token>`
- **Permissions:** Admin only
- **Response:** Unverified document

#### Update Document
- **PUT/PATCH** `/api/documents/{id}/`
- **Headers:** `Authorization: Bearer <access_token>`
- **Permissions:** Owner or admin
- **Response:** Updated document

#### Delete Document
- **DELETE** `/api/documents/{id}/`
- **Headers:** `Authorization: Bearer <access_token>`
- **Permissions:** Owner or admin
- **Response:** 204 No Content

### Fees

#### List Fees
- **GET** `/api/fees/`
- **Headers:** `Authorization: Bearer <access_token>`
- **Permissions:** 
  - Admins: See all fees
  - Others: See only own fees
- **Response:** List of fees

#### Get Fee
- **GET** `/api/fees/{id}/`
- **Headers:** `Authorization: Bearer <access_token>`
- **Response:** Fee details

#### Create Fee (Admin Only)
- **POST** `/api/fees/`
- **Headers:** `Authorization: Bearer <access_token>`
- **Permissions:** Admin only
- **Body:**
  ```json
  {
    "user_id": 1,
    "description": "Tuition Fee",
    "amount": "5000.00",
    "due_date": "2024-12-31"
  }
  ```
- **Response:** Created fee

#### Mark Fee as Paid (Admin Only)
- **POST** `/api/fees/{id}/mark_paid/`
- **Headers:** `Authorization: Bearer <access_token>`
- **Permissions:** Admin only
- **Response:** Updated fee

#### Mark Fee as Unpaid (Admin Only)
- **POST** `/api/fees/{id}/mark_unpaid/`
- **Headers:** `Authorization: Bearer <access_token>`
- **Permissions:** Admin only
- **Response:** Updated fee

#### Update Fee (Admin Only)
- **PUT/PATCH** `/api/fees/{id}/`
- **Headers:** `Authorization: Bearer <access_token>`
- **Permissions:** Admin only
- **Response:** Updated fee

#### Delete Fee (Admin Only)
- **DELETE** `/api/fees/{id}/`
- **Headers:** `Authorization: Bearer <access_token>`
- **Permissions:** Admin only
- **Response:** 204 No Content

## Models

### User
- Extends Django's AbstractUser
- Roles: STUDENT, ALUMNI, ADMIN
- Fields: username, email, role, owes_fees, phone_number, graduation_year, student_id
- Properties: total_debt, has_outstanding_debt()

### Fee
- Tracks individual fees/debts
- Fields: user, description, amount, is_paid, due_date, paid_date, created_by
- Automatically updates user's owes_fees flag

### Document
- Stores user documents
- Types: TRANSCRIPT, CERTIFICATE, DIPLOMA, OTHER
- Fields: owner, title, document_type, file, file_size, is_verified, verified_by, verified_at

## Permissions

- **IsAdmin**: Admin-only access
- **IsAlumni**: Alumni-only access
- **IsAdminOrAlumni**: Admin or Alumni access
- **IsOwnerOrAdmin**: Owner or Admin access
- **DebtClearForDownload**: Blocks downloads if user has outstanding debt (alumni only)
- **CanManageFees**: Admin-only fee management
- **CanVerifyDocuments**: Admin-only document verification
- **CanViewUserDetails**: View own profile or admin can view all

## Debt Verification Logic

Before allowing document downloads:
1. Admin users can always download any document
2. Users can only download their own documents
3. For ALUMNI role: System checks if `owes_fees` flag is True OR if there are any unpaid fees
4. If debt exists, download is blocked with 403 Forbidden

## Security Features

- JWT token-based authentication
- Role-based access control
- Secure file uploads with validation
- Document verification system
- Automatic debt tracking and verification

## Database Support

The backend supports three database options:

1. **SQLite** (default, for development)
2. **PostgreSQL** (recommended for production)
3. **MySQL** (alternative for production)

Configure via environment variables in `.env` file.

## Admin Interface

Access Django admin at `/admin/` with superuser credentials.

Features:
- User management with debt display
- Fee management with payment tracking
- Document management with verification
- Search and filtering capabilities

