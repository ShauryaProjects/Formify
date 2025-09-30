# Formify Backend

Node.js + Express + MongoDB backend for the Formify form builder application.

## Setup Instructions

### 1. Install Dependencies
\`\`\`bash
cd server
npm install
\`\`\`

### 2. Configure Environment Variables
Create a `.env` file in the `server` directory:
\`\`\`bash
cp .env.example .env
\`\`\`

Edit `.env` and add your MongoDB connection string:
\`\`\`
MONGO_URI=mongodb://localhost:27017/formify
PORT=5000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
\`\`\`

### 3. Start MongoDB
Make sure MongoDB is running on your system. If using MongoDB locally:
\`\`\`bash
mongod
\`\`\`

Or use MongoDB Atlas for a cloud database.

### 4. Run the Server

**Development mode (with auto-reload):**
\`\`\`bash
npm run dev
\`\`\`

**Production mode:**
\`\`\`bash
npm start
\`\`\`

The server will start on `http://localhost:5000`

## API Endpoints

### Forms

#### Create a new form
\`\`\`
POST /api/forms
Content-Type: application/json

{
  "title": "Customer Feedback Form",
  "description": "Help us improve our service",
  "steps": [
    {
      "title": "Personal Information",
      "questions": [
        {
          "type": "shortAnswer",
          "label": "What is your name?",
          "required": true
        }
      ]
    }
  ],
  "createdBy": "user123"
}
\`\`\`

#### Get form by ID
\`\`\`
GET /api/forms/:formId
\`\`\`

### Submissions

#### Submit a form response
\`\`\`
POST /api/forms/:formId/submit
Content-Type: application/json

{
  "answers": [
    {
      "question": "What is your name?",
      "answer": "John Doe"
    }
  ]
}
\`\`\`

#### Get all submissions for a form
\`\`\`
GET /api/forms/:formId/submissions
\`\`\`

## Response Format

All API responses follow this format:
\`\`\`json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
\`\`\`

## Error Handling

- `400` - Bad Request (missing required fields)
- `404` - Not Found (form doesn't exist)
- `500` - Internal Server Error

## Project Structure

\`\`\`
server/
├── models/
│   ├── Form.js          # Form schema
│   └── Submission.js    # Submission schema
├── routes/
│   ├── formRoutes.js    # Form CRUD endpoints
│   └── submissionRoutes.js  # Submission endpoints
├── .env.example         # Environment variables template
├── server.js            # Express app entry point
└── package.json         # Dependencies
