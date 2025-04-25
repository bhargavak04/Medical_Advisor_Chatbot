# MedAdvisor - Your Personal Medical Advisor

![MedAdvisor](https://img.shields.io/badge/MedAdvisor-AI%20Powered%20Medical%20Advice-blue)

MedAdvisor is an AI-powered medical advice platform that provides personalized healthcare guidance. This application combines a React frontend with a FastAPI backend to deliver a seamless user experience for receiving medical advice and managing health information.

## Features

- **24/7 AI Medical Support**: Get instant medical advice through our advanced AI chatbot
- **Secure User Authentication**: Powered by Clerk for safe and reliable user management
- **Personalized Health Profiles**: Store and manage your medical history for tailored advice
- **Chat History**: Keep track of your previous medical consultations
- **Responsive Design**: Access from any device with a fully responsive interface

## Technology Stack

### Frontend
- React 18
- TypeScript
- React Router for navigation
- Clerk for authentication
- TailwindCSS for styling
- Vite as build tool
- Lucide React for icons

### Backend
- FastAPI (Python)
- SQLite database
- LangChain with Groq for AI integration
- SQLAlchemy for ORM

## Installation

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8+ 
- npm or yarn

### Frontend Setup

1. Clone the repository
   ```bash
   git clone https://github.com/bhargavak04/Medical_Advisor_Chatbot
   cd medical-advisor-chatbot
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your Clerk public key
   ```
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

### Backend Setup

1. Navigate to the backend directory
   ```bash
   cd backend
   ```

2. Create a virtual environment (optional but recommended)
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the backend directory with your API keys
   ```
   GROQ_API_KEY=your_groq_api_key
   ```

5. Start the backend server
   ```bash
   uvicorn main:app --reload
   ```

## Usage

1. Register for an account or log in if you already have one
2. Complete your health profile with relevant medical history
3. Navigate to the Medical Chat section to start a conversation with the AI advisor
4. View your chat history and profile information in the Dashboard

## Project Structure

```
├── backend/                # FastAPI backend
│   ├── main.py            # Main API endpoints and logic
│   ├── requirements.txt   # Python dependencies
│   └── medical_advisor.db # SQLite database
├── src/                   # React frontend
│   ├── components/        # Reusable UI components
│   ├── pages/             # Application pages
│   ├── models/            # TypeScript interfaces
│   └── services/          # API service functions
├── package.json           # Node.js dependencies
└── vite.config.ts        # Vite configuration
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Clerk](https://clerk.dev/) for authentication
- [Groq](https://groq.com/) for AI capabilities
- [TailwindCSS](https://tailwindcss.com/) for styling
- [FastAPI](https://fastapi.tiangolo.com/) for the backend framework