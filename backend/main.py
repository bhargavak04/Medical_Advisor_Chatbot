from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain.prompts import ChatPromptTemplate
from langchain.schema import SystemMessage, HumanMessage
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.orm import sessionmaker, declarative_base, Session

load_dotenv()

app = FastAPI()

# Configure CORS to allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,  # Must be False when allow_origins=["*"]
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=600,
)

# Database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./medical_advisor.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    clerk_id = Column(String(100), unique=True, index=True)
    name = Column(String(100))
    email = Column(String(100), unique=True, index=True)
    age = Column(Integer)
    gender = Column(String(20))
    past_illnesses = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class ChatHistory(Base):
    __tablename__ = "chat_history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    message = Column(Text)
    response = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

# Pydantic models
class MessageRequest(BaseModel):
    message: str
    user_id: Optional[str] = None

class MessageResponse(BaseModel):
    response: str
    
class UserProfileCreate(BaseModel):
    clerk_id: str
    name: str
    email: str
    age: int
    gender: str
    past_illnesses: Optional[str] = None
    
class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    past_illnesses: Optional[str] = None
    
class UserProfileResponse(BaseModel):
    id: int
    clerk_id: str
    name: str
    email: str
    age: int
    gender: str
    pastIllnesses: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

# Initialize Groq client
groq_api_key = os.getenv("GROQ_API_KEY")
if not groq_api_key:
    raise HTTPException(status_code=500, detail="GROQ_API_KEY environment variable is not set")

# Initialize Groq client with proper configuration
llm = ChatGroq(
    api_key=groq_api_key,
    model_name="qwen-2.5-32b",
    temperature=0.7,
    http_client=None  # Explicitly set http_client to None to avoid proxies issue
)

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_user_context(user_id: str, db: Session):
    user = db.query(User).filter(User.clerk_id == user_id).first()
    if user:
        return f"Patient Context: Age: {user.age}, Gender: {user.gender}, Medical History: {user.past_illnesses}"
    return ""

@app.post("/chat")
async def chat_endpoint(message_request: MessageRequest, db: Session = Depends(get_db)):
    try:
        user_context = ""
        if message_request.user_id:
            user_context = get_user_context(message_request.user_id, db)

        system_prompt = f"""You are a medical advisor chatbot. Your role is to provide general health information and guidance.
        Important rules:
        * You're allowed to greet the user for the first time (dont greet everytime), ask them basic questions and provide information about yourself
        * Strictly Answer only medical related questions if asked any question other than medical related do not answer ,
        1. Do not make definitive diagnoses
        2. Always recommend consulting a healthcare professional for specific medical advice
        3. Provide evidence-based information
        4. Be clear about limitations
        5. Focus on general wellness and preventive care
        
        {user_context}
        """

        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=message_request.message)
        ]

        response = llm.invoke(messages)

        # Save chat history if user_id is provided
        if message_request.user_id:
            user = db.query(User).filter(User.clerk_id == message_request.user_id).first()
            if user:
                chat_history = ChatHistory(
                    user_id=user.id,
                    message=message_request.message,
                    response=response.content
                )
                db.add(chat_history)
                db.commit()

        return MessageResponse(response=response.content)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
@app.get("/users/{clerk_id}", response_model=UserProfileResponse)
async def get_user_profile(clerk_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.clerk_id == clerk_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Map the ORM model to the Pydantic response model
    return UserProfileResponse(
        id=user.id,
        clerk_id=user.clerk_id,
        name=user.name,
        email=user.email,
        age=user.age,
        gender=user.gender,
        pastIllnesses=user.past_illnesses,
        created_at=user.created_at
    )

@app.post("/users", response_model=UserProfileResponse, status_code=201)
async def create_user_profile(user_data: UserProfileCreate, db: Session = Depends(get_db)):
    # Check if user with this clerk_id already exists
    existing_user = db.query(User).filter(User.clerk_id == user_data.clerk_id).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    
    # Create new user
    new_user = User(
        clerk_id=user_data.clerk_id,
        name=user_data.name,
        email=user_data.email,
        age=user_data.age,
        gender=user_data.gender,
        past_illnesses=user_data.past_illnesses
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return UserProfileResponse(
        id=new_user.id,
        clerk_id=new_user.clerk_id,
        name=new_user.name,
        email=new_user.email,
        age=new_user.age,
        gender=new_user.gender,
        pastIllnesses=new_user.past_illnesses,
        created_at=new_user.created_at
    )

@app.patch("/users/{clerk_id}", response_model=UserProfileResponse)
async def update_user_profile(clerk_id: str, user_data: UserProfileUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.clerk_id == clerk_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update user fields if provided
    if user_data.name is not None:
        user.name = user_data.name
    if user_data.age is not None:
        user.age = user_data.age
    if user_data.gender is not None:
        user.gender = user_data.gender
    if user_data.past_illnesses is not None:
        user.past_illnesses = user_data.past_illnesses
    
    db.commit()
    db.refresh(user)
    
    return UserProfileResponse(
        id=user.id,
        clerk_id=user.clerk_id,
        name=user.name,
        email=user.email,
        age=user.age,
        gender=user.gender,
        pastIllnesses=user.past_illnesses,
        created_at=user.created_at
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)