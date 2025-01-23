# Auth Service

## Description

Auth Service is a robust authentication service built from scratch using Node.js and PostgreSQL. It provides essential authentication features such as user registration, login, and session management.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/auth-service.git
   ```
2. Navigate to the project directory:
   ```
   cd auth-service
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the root directory and configure your environment variables.

5. Build the application:
   ```
   npm run build
   ```

## Usage

To start the application, run:

```
npm start
```

For development with auto-reloading:

```
npm run dev
```

## Features

- User registration
- User login
- Session management
- etc.

## Technologies

- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma
- JSON Web Tokens (JWT)
- bcryptjs

## Project Structure

```
auth-service/
├── docs/              # Project documentation
├── prisma/            # Prisma models and migration files
├── scripts/           # Utility scripts
├── src/               # Main source code
│   ├── controllers/   # Request handlers
│   ├── db/            # Database setup and models
│   ├── logger/        # Logging functionality
│   ├── middlewares/   # Middleware for authentication and validation
│   ├── routes/        # API routes
│   ├── schemas/       # Request validation schemas
│   ├── service/       # Business logic
│   ├── types/         # TypeScript types
│   ├── utils/         # Utility functions
│   ├── validators/    # Input validation functions
│   ├── app.ts         # Entry point for the application
│   └── constants.ts   # Application constants
├── .env               # Environment variables
├── package.json       # Project dependencies and scripts
├── tsconfig.json      # TypeScript configuration
└── README.md          # Project documentation

```

## Configuration

Create a `.env` file in the root directory, copy the [`.env.sample`](.env.sample) file set value according to your environment

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License.

## Contact

For any inquiries, please contact:
Jayash Saini
Email: jayashysaini7361@gmail.com
LinkedIn: [Jayash Saini](https://www.linkedin.com/in/jayash-saini-371bb0267/)
