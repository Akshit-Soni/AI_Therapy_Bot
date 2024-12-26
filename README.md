# AI Therapy Website

A modern web application providing AI-powered therapy sessions using a fine-tuned Mistral AI model.

## Features

### Core Features
- 🤖 AI-Powered Therapy Sessions
	- Real-time chat interface
	- Voice input/output capabilities
	- Context-aware conversations
	- Session summarization
	- Therapeutic response formatting

### User Features
- 📝 Session Management
	- View session history
	- Resume active sessions
	- Session expiration handling
	- Feedback submission
- 🔐 User Authentication
	- Secure login/registration
	- Protected routes
	- User settings

### Admin Features
- 📊 Analytics Dashboard
	- User statistics
	- Session analytics
	- Feedback monitoring
	- Performance metrics
- 👥 User Management
	- User list view
	- Session monitoring
	- Activity tracking

## Technical Architecture

### Frontend
- React.js
- Context API for state management
- CSS Modules for styling
- Error Boundaries for reliability
- Protected routing

### Backend
- Firebase Authentication
- Cloud Firestore database
- Real-time data synchronization
- Secure data access rules

### AI Integration
- Custom fine-tuned Mistral model
- Real-time response generation
- Conversation context management
- Error handling and retry logic

## Requirements

- Node.js 18.x or higher
- npm 9.x or higher
- Firebase account
- Mistral AI API key

## Dependencies

### Core Dependencies
- React 18.2.0
- Firebase 10.14.1
- @mistralai/mistralai 0.0.7
- React Router DOM 6.21.1
- Recharts 2.15.0 (for analytics visualization)

### Development Dependencies
- Vite 6.0.1
- ESLint 9.15.0
- Various React-specific ESLint plugins
- TypeScript types for React

## Available Scripts

- `npm run dev` - Start development server (with environment variable checks)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code quality checks

## Setup

1. Clone the repository
2. Install dependencies:
	 ```bash
	 npm install
	 ```

3. Configure environment variables:
	 Create a `.env` file with:
	 ```
	 VITE_FIREBASE_API_KEY=your_firebase_api_key
	 VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
	 VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
	 VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
	 VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
	 VITE_FIREBASE_APP_ID=your_firebase_app_id
	 VITE_MISTRAL_API_KEY=your_mistral_api_key
	 ```

4. Start the development server:
	 ```bash
	 npm run dev
	 ```

## Security

### Authentication & Authorization
- Firebase Authentication for user management
- Protected routes for authenticated access
- Admin-only sections with role-based access control
- Session expiration handling
- Secure API key management

### Firestore Security Rules
```javascript
// User Data
match /users/{userId} {
	// Users can only read and write their own data
	allow read, write: if request.auth != null && request.auth.uid == userId;
}

// Sessions
match /sessions/{sessionId} {
	// Authenticated users can read sessions
	allow read: if request.auth != null;
	
	// Users can only create sessions for themselves
	allow create: if request.auth != null && 
		request.resource.data.userId == request.auth.uid;
	
	// Users can only update/delete their own sessions
	allow update, delete: if request.auth != null && 
		resource.data.userId == request.auth.uid;
}

// Feedback
match /feedback/{feedbackId} {
	// Authenticated users can read and write feedback
	allow read, write: if request.auth != null;
}
```

### Data Protection
- Input sanitization and validation
- Secure environment variable handling
- API key encryption
- Real-time data access control
- Session data isolation

### Best Practices
- HTTPS-only communication
- Secure WebSocket connections for real-time updates
- Regular security audits
- Automated vulnerability scanning
- Secure password policies

## Project Structure

```
src/
├── components/
│   ├── admin/      # Admin dashboard components
│   ├── auth/       # Authentication components
│   ├── chat/       # Chat interface components
│   ├── common/     # Shared components
│   ├── feedback/   # Feedback components
│   ├── history/    # Session history components
│   └── settings/   # User settings components
├── contexts/       # React contexts
├── services/       # External service integrations
└── utils/         # Utility functions
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Deployment

### Prerequisites
- Firebase CLI installed (`npm install -g firebase-tools`)
- Firebase project configured
- Environment variables set
- Build artifacts generated

### Deployment Steps
1. Build the project:
   ```bash
   npm run build
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase (if not already done):
   ```bash
   firebase init
   ```
   - Select Hosting
   - Select your project
   - Set build directory to 'dist'
   - Configure as single-page application

4. Deploy to Firebase:
   ```bash
   firebase deploy
   ```

### Environment Setup
- Production environment variables must be set in Firebase Console
- SSL certificates are automatically managed by Firebase
- CDN and caching are configured automatically

### Post-Deployment
- Verify the deployment at the provided Firebase URL
- Check all environment variables are properly set
- Verify authentication flows
- Test AI integration in production environment

## Development

### Prerequisites
1. Node.js and npm installed
2. Firebase project created
3. Mistral AI API key obtained
4. Environment variables configured

### Code Quality
- ESLint configuration for code quality
- React-specific linting rules
- TypeScript types for better development experience

### Best Practices
- Use of React hooks and functional components
- Context-based state management
- Error boundary implementation
- Protected routing for security
- Real-time data synchronization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
