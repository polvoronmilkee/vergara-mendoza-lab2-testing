# SE 2240 Lab 2: API Testing with Jest and Supertest

## 👥 Pair

- **Member 1:** Chistine Ryll T. Vergara
- **Member 2:** Sophia Marielle C. Mendoza

---

## 🛠️ Setup & Installation

Before running the application or tests, ensure you have all dependencies and database configured.

### Prerequisites

- Node.js (v14 or higher)
- MySQL installed and running
- MySQL Workbench (optional, for easier database management)

### Installation Steps

1.  **Clone the project** and navigate to the root directory:

    ```bash
    cd vergara-mendoza-lab2-testing
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    ```

    _This will install `jest`, `supertest`, `express`, `mysql2`, and other necessary libraries._

3.  **Set up the database**:
    - Open MySQL Workbench or use the MySQL CLI
    - Run the schema file to create the database and tables:
      ```bash
      mysql -u root -p < data-db/schema.sql
      ```
    - Or open `data-db/schema.sql` in MySQL Workbench and execute it

4.  **Configure environment variables**:
    - Copy `.env.example` to `.env`:
      ```bash
      copy .env.example .env
      ```
    - Update `.env` with your MySQL credentials:
      ```
      DB_HOST=localhost
      DB_USER=root
      DB_PASSWORD=your_mysql_password
      DB_NAME=todo_app
      ```

---

## 🚀 Running the Application

To run the application in development mode:

```bash
npm run dev
```

This will start the app with nodemon (auto-restart on file changes) at `http://localhost:3000`

To run in production mode:

```bash
npm start
```

---

## 🧪 Running the Tests

**⚠️ IMPORTANT:** Before running tests, ensure you have completed ALL installation steps above, especially:

- MySQL database is running
- Database schema is created (step 3)
- `.env` file is configured with correct credentials (step 4)

To execute the API test suite, run the following command in your terminal:

```bash
npm test
```

This will run all test files in the `__tests__/` directory using Jest and Supertest.

### Test Files

- **`__tests__/auth.test.js`** - Authentication API tests (register, login, protected routes, logout)
- **`__tests__/tasks.test.js`** - CRUD API tests (create, update, delete, mark task as complete) 

### Test Coverage

Each endpoint has:

- ✅ **Happy path tests** - Verify expected behavior with valid inputs
- ❌ **Sad path tests** - Verify error handling with invalid inputs, missing auth, etc.

### Troubleshooting Tests

- **Access denied errors**: Verify your `.env` file has correct MySQL credentials
- **Connection refused**: Ensure MySQL service is running
- **Tests hanging**: Check that database connections are properly closed

---

Original README:

[![NodeJS](https://github.com/MarioTerron/logo-images/blob/master/logos/nodejs.png)](https://nodejs.org/)
[![ExpressJS](https://github.com/MarioTerron/logo-images/blob/master/logos/expressjs.png)](http://expressjs.com///)
[![PugJS](https://github.com/MarioTerron/logo-images/blob/master/logos/pug.png)](http://www.pugjs.org/)
[![ES6](https://github.com/MarioTerron/logo-images/blob/master/logos/es6.png)](http://www.ecma-international.org/ecma-262/6.0/)
[![npm](https://github.com/MarioTerron/logo-images/blob/master/logos/npm.png)](https://www.npmjs.com/)

[![HTML5,CSS3 and JS](https://github.com/FransLopez/logo-images/blob/master/logos/html5-css3-js.png)](http://www.w3.org/)
[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)
[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

# [TO DO APP](https://app-to-do.herokuapp.com/login/)

This project is a simple to-do list app build with Jade/PUG, CSS, jQuery, Express.js at [Skylab Coders Academy](http://www.skylabcoders.com) Full Stack Web Development Bootcamp.

## Installation

You can launch the app using some NPM scripts:

- `npm start` Will launch the app and will install the npm dependencies automatically
- `npm run dev` Will launch the app w/ nodemon so it will restart itself when any file of the project is modified and saved ignoring /data-db folder
- `npm run dev:debug` Will launch the `npm run dev` script w/ lots of debugging info about the app

## API Endpoints

All these endpoints will start locally w/ `http://localhost:3000`

Example: `http://localhost:3000/tasks`

### GET endpoints

#### [GET] `/tasks`

#### [GET] `/completed`

#### [GET] `/login`

#### [GET] `/registry`

#### [GET] `/logout`

#### [GET] `/error`

### POST endpoints

#### [POST] `/tasks`

#### [POST] `/login`

#### [POST] `/registry`

### PUT endpoints

#### [PUT] `/task/:id`

#### [PUT] `/edit/:id`

### DELETE endpoints

#### [DELETE] `/task/:id`

#### [DELETE] `/completed/:id`

## NOTE

In this project instead of using a formal database the user's email and password are being stored in a raw .txt, as a project complement I decided to use node core module `crypto` to encrypt and decrypt the personal information, so in consequence at `helpers/crypto.js` at line 3 I used a randomized ID to set the main keyword on which the algorithm `aes-256-ctr` will take as a the base to encrypt/decrypt, meaning every time the server is restarted, a new ID will be created and will make old data indecipherable. If you're using this in development change `const cryptoPass = createID()` to `const cryptoPass = 'yourSecretKey'`.
