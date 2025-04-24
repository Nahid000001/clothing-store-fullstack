# Full Stack Todo Application

A complete todo application with Angular frontend, Flask backend, and MongoDB database.

## Project Structure

- **Frontend**: Angular application with TypeScript
- **Backend**: Flask Python API server
- **Database**: MongoDB with MongoDB Compass

## Prerequisites

- Python 3.8+ and pip
- Node.js (v14 or higher) and npm
- MongoDB and MongoDB Compass
- Angular CLI (`npm install -g @angular/cli`)

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:

   ```
   cd backend
   ```

2. Create and activate a virtual environment:

   ```
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install dependencies:

   ```
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the backend directory with the following variables:

   ```
   FLASK_APP=app.py
   FLASK_ENV=development
   MONGO_URI=mongodb://localhost:27017/todoapp
   FLASK_DEBUG=1
   ```

5. Start the Flask server:
   ```
   flask run
   ```
   Or:
   ```
   python app.py
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```
   cd frontend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Update the API endpoint in environment files if needed:

   - `src/environments/environment.ts` (development)
   - `src/environments/environment.prod.ts` (production)

4. Start the Angular development server:
   ```
   ng serve
   ```
5. Access the application at http://localhost:4200

### MongoDB Setup with MongoDB Compass

1. Install MongoDB on your machine following the [official documentation](https://docs.mongodb.com/manual/installation/).

2. Install MongoDB Compass:

   - Download MongoDB Compass from the [official website](https://www.mongodb.com/products/compass)
   - Install the application following the on-screen instructions

3. Start MongoDB service:

   - Windows: `net start MongoDB`
   - macOS: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`

4. Connect to MongoDB using MongoDB Compass:

   - Launch MongoDB Compass
   - Connect to your local MongoDB instance with the connection string: `mongodb://localhost:27017`
   - Create a new database called "todoapp"
   - Create a collection called "todos"

5. Verify your database setup:
   - Check that you can see your "todoapp" database in MongoDB Compass
   - Ensure you can view the "todos" collection

## API Endpoints

| Method | Endpoint       | Description         |
| ------ | -------------- | ------------------- |
| GET    | /api/todos     | Get all todos       |
| POST   | /api/todos     | Create a new todo   |
| PUT    | /api/todos/:id | Update a todo by ID |
| DELETE | /api/todos/:id | Delete a todo by ID |

## Deployment

### Backend Deployment

- Deploy the Flask backend to services like Heroku, Render, or PythonAnywhere.
- Set up environment variables in your deployment platform.
- For production, use Gunicorn or uWSGI as WSGI servers.

### Frontend Deployment

- Build the Angular app: `ng build --prod`
- Deploy the dist folder to services like Netlify, Vercel, or GitHub Pages.

### Database Deployment

- For production, use MongoDB Atlas as your cloud database.
- Update the MONGO_URI in your backend environment variables.

## Features

- Create, read, update, and delete todos
- Mark todos as complete/incomplete
- Filter todos by status
- Responsive design

## Technologies Used

### Frontend

- Angular
- TypeScript
- Angular Material (UI components)
- RxJS for reactive programming

### Backend

- Python
- Flask framework
- Flask-PyMongo
- Flask-CORS
- python-dotenv for environment variables

### Database

- MongoDB
- MongoDB Compass (GUI tool)

## License

MIT
