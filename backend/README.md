# Formify Backend

This folder contains all backend-related files for the Formify application.

## Structure

```
backend/
├── express-server/          # Express.js server with MongoDB
│   ├── models/             # Mongoose models
│   │   ├── Form.js         # Form schema
│   │   └── Submission.js   # Submission schema
│   ├── routes/             # Express routes
│   │   ├── formRoutes.js   # Form CRUD operations
│   │   └── submissionRoutes.js # Submission operations
│   ├── server.js           # Main Express server file
│   ├── package.json        # Express server dependencies
│   └── README.md           # Express server documentation
│
└── nextjs-api/             # Next.js API routes (backup/reference)
    └── forms/              # Form-related API routes
        ├── route.ts        # Main forms endpoint
        └── [id]/           # Dynamic form routes
            ├── route.ts    # Individual form operations
            └── submissions/
                └── route.ts # Form submissions
```

## Running the Backend

### Express Server

1. Navigate to the express-server directory:
   ```bash
   cd backend/express-server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your MongoDB connection string:
   ```env
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   ```

4. Start the server:
   ```bash
   npm start
   # or for development with nodemon:
   npm run dev
   ```

The Express server will run on `http://localhost:5000`

### API Endpoints

The Express server provides the following endpoints:

- `GET /api/forms` - Get all forms
- `POST /api/forms` - Create a new form
- `GET /api/forms/:id` - Get a specific form
- `DELETE /api/forms/:id` - Delete a form
- `GET /api/forms/:id/submissions` - Get submissions for a form
- `POST /api/forms/:id/submissions` - Create a new submission
- `GET /api/health` - Health check endpoint

### Frontend Integration

The Next.js application automatically proxies API requests to the Express server through the API routes in `app/api/`. The frontend makes requests to `/api/forms/*` which are then forwarded to the Express server running on port 5000.

### Environment Variables

Make sure to set the `BACKEND_URL` environment variable in your Next.js application:

```env
# .env.local (in root directory)
BACKEND_URL=http://localhost:5000
```

For production, update this to your deployed Express server URL.
