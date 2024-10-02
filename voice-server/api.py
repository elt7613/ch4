from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import APIKeyHeader
from pydantic import BaseModel
from typing import Dict, Optional
import os
import time
import uvicorn
from llama_index.core import VectorStoreIndex, StorageContext, load_index_from_storage
from llama_parse import LlamaParse
from llama_index.embeddings.ollama import OllamaEmbedding
from llama_index.llms.openai import OpenAI
from llama_index.llms.groq import Groq
from llama_index.core import Settings
from llama_index.core.memory import ChatMemoryBuffer
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from functools import lru_cache

load_dotenv()

openai_api_key = os.getenv("OPENAI_API_KEY")
groq_api_key = os.getenv("GROQ_API_KEY")
PERSIST_DIR = "./VectorStorage_Data"
MAX_RETRIES = 3
RETRY_DELAY = 1

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add API key header for user identification
API_KEY_HEADER = APIKeyHeader(name="API-Key")

# Dictionary to store user sessions
user_sessions: Dict[str, ChatMemoryBuffer] = {}

@lru_cache()
def get_embed_model():
    return OllamaEmbedding(
        model_name="nomic-embed-text:latest",
        base_url="http://localhost:11434",
        ollama_additional_kwargs={"mirostat": 0},
    )

Settings.embed_model = get_embed_model()

@lru_cache()
def get_llm():
    return Groq(model="llama-3.2-90b-text-preview", api_key=groq_api_key)

@lru_cache()
def create_vector_storage(file_path: str):
    if not os.path.exists(PERSIST_DIR):
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")
        documents = LlamaParse(result_type="markdown").load_data(file_path)
        index = VectorStoreIndex.from_documents(documents, show_progress=True)
        index.storage_context.persist(persist_dir=PERSIST_DIR)
    else:
        storage_context = StorageContext.from_defaults(persist_dir=PERSIST_DIR)
        index = load_index_from_storage(storage_context)
    return index

def get_chat_engine(user_id: str):
    index = create_vector_storage("data/KTC SOW.pdf")
    
    # Use the user's session if it exists, otherwise create a new one
    if user_id not in user_sessions:
        user_sessions[user_id] = ChatMemoryBuffer.from_defaults()
    
    return index.as_chat_engine(
        chat_mode="context",
        memory=user_sessions[user_id],
        llm=get_llm(),
        system_prompt=(
            "You are an AI assistant who answers user questions. "
            "Do not respond with long answers,***always respond in short answers***."
            "Never respond in bullet points"
        )
    )

class Query(BaseModel):
    text: str

class Response(BaseModel):
    answer: str

@app.post("/chat", response_model=Response)
async def chat_endpoint(query: Query, api_key: str = Depends(API_KEY_HEADER)):
    for attempt in range(MAX_RETRIES):
        try:
            chat_engine = get_chat_engine(api_key)
            response = chat_engine.chat(query.text)
            print(f"User: {query.text} \nLLM: {str(response)}")
            return Response(answer=str(response))
        except Exception as e:
            print(f"Attempt {attempt + 1} failed: {str(e)}")
            if attempt < MAX_RETRIES - 1:
                time.sleep(RETRY_DELAY)
            else:
                raise HTTPException(status_code=500, detail=f"Failed after {MAX_RETRIES} attempts: {str(e)}")

@app.post("/clear-session")
async def clear_session(api_key: str = Depends(API_KEY_HEADER)):
    if api_key in user_sessions:
        del user_sessions[api_key]
        return {"message": "Session cleared successfully"}
    else:
        return {"message": "No active session found"}

if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=5000,reload = True)