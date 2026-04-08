# Backend Authentication Flow

This document visualizes the entire execution logic and data flow across the `app/api/auth` endpoints. 

## 1. Directory Structure

```text
app/api/auth
│
├── /register          -> Creates user, sends email verification link
├── /verify-email      -> Decodes token, marks user as emailVerified
├── /login             -> Authenticates password, sends OTP to email
├── /verify-otp        -> Validates OTP, issues JWT Token cookies
├── /resend-otp        -> Re-issues fresh OTP for login/reset
├── /forgot-password   -> Validates user exists, sends OTP to email
└── /reset-password    -> Validates OTP & saves the new password hash
```

## 2. API Logical Flow Diagrams

### A. Registration & Email Verification Flow
```mermaid
sequenceDiagram
    participant Client
    participant API as /register
    participant DB as MongoDB
    participant Email as NodeMailer

    Client->>API: POST { name, email, password }
    API->>DB: Check if user exists
    alt User Exists
        API-->>Client: 400 Bad Request
    else
        API->>DB: userModel.create() (Hashes password)
        API->>API: Generate Signed JWT Token
        API->>Email: Send verification link with token
        API-->>Client: 201 Created ("Check Inbox")
    end

    %% Email Verification
    Client->>API: POST /verify-email { token }
    API->>API: verifyToken() extracts User ID
    API->>DB: findById(), set isEmailVerified = true
    API-->>Client: 200 Success
```

### B. Standard Login (2FA / OTP) Flow
```mermaid
sequenceDiagram
    participant Client
    participant API as /login
    participant DB as MongoDB
    participant Email as NodeMailer

    Client->>API: POST { email, password }
    API->>DB: findOne(+password)
    
    alt isEmailVerified == false
        API->>Email: Resend Verification Email Link
    end

    API->>DB: bcrypt.compare(password)
    alt Invalid Password
        API-->>Client: 401 Unauthorized
    else Valid Password
        API->>DB: clear old OTPs & create New OTP
        API->>Email: Send OTP email
        API-->>Client: 200 Success ("Verify your device")
    end

    %% OTP Verification
    Client->>API: POST /verify-otp { email, otp }
    API->>DB: Verify OTP exists
    API->>DB: Delete OTP from db
    API->>API: Generate auth Token
    API->>Client: Set 'token' HttpOnly Cookie & Return User Data
```

### C. Forgot / Reset Password Flow
```mermaid
sequenceDiagram
    participant Client
    participant API as /forgot-password
    participant DB as MongoDB
    participant Email as NodeMailer

    Client->>API: POST { email }
    API->>DB: Verify user exists
    API->>DB: Delete old OTPs, generate New OTP
    API->>Email: Send Reset OTP Email
    API-->>Client: 200 Success

    %% Reset Password
    Client->>API: POST /reset-password { email, otp, newPassword }
    API->>DB: Verify OTP & Email match
    API->>DB: Update user.password (Triggers mongoose pre-save hash)
    API->>DB: Delete OTP
    API-->>Client: 200 Password successfully reset
```

## 3. Database Models Interaction
- **user.model**: Handles `pre("save")` hooks to salt & hash passwords with `bcrypt.compare` methods attached.
- **otp.model**: Acts as a transient 2FA store. Every time a new OTP is requested via login, forgot-password, or resend-otp, previous records for that email address are `deleteMany()`'d.
