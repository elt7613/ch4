import os
import time
from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import APIKeyHeader
from pydantic import BaseModel
from typing import Dict
import uvicorn
from llama_index.core import VectorStoreIndex, StorageContext, load_index_from_storage
from llama_parse import LlamaParse
from llama_index.embeddings.ollama import OllamaEmbedding
from llama_index.llms.groq import Groq
from llama_index.core import Settings
from llama_index.core.memory import ChatMemoryBuffer
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from functools import lru_cache
import nest_asyncio
import requests



import re
import json
from urllib.request import urlopen



# Apply nest_asyncio
nest_asyncio.apply()

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

async def create_vector_storage(file_path: str):
    if not os.path.exists(PERSIST_DIR):
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")
        documents = await LlamaParse(result_type="markdown").aload_data(file_path)
        index = VectorStoreIndex.from_documents(documents, show_progress=True)
        index.storage_context.persist(persist_dir=PERSIST_DIR)
    else:
        storage_context = StorageContext.from_defaults(persist_dir=PERSIST_DIR)
        index = load_index_from_storage(storage_context)
    return index

async def get_chat_engine(user_id: str):
    index = await create_vector_storage("data/ch4_docs.pdf")
    
    # Use the user's session if it exists, otherwise create a new one
    if user_id not in user_sessions:
        user_sessions[user_id] = ChatMemoryBuffer.from_defaults()
    
    return index.as_chat_engine(
        chat_mode="context",
        memory=user_sessions[user_id],
        llm=get_llm(),
        system_prompt=(
            """
            You are AI voice assistant,your name is CH4.Never mention or compare your name with chemistry or any other technical term because it is your name.
            You represent CH4 team which is particiating in NASA Space Apps Challenge 2024.And the question statment for this team (which is you) is **Tell a climate story**.
            You are a Voice Assistant for the CH4 website in which it contains the story related to the climate change the stroy is:
            
            -------------------------------------------
            The story revolves around a young protagonist who embarks on a journey to save the planet from environmental degradation. The protagonist's grandfather, who had traveled the world and seen the beauty of nature, shares his experiences with his grandson before passing away. The grandfather gifts his grandson a green pendant, which holds magical powers.
            The protagonist, now 27, decides to visit Costa Rica to see the golden toads his grandfather had told him about. However, he is shocked to learn that the toads are extinct due to climate change and deforestation. He meets a staff member at the Cloud Forest Reserve, who explains the devastating impact of human activities on the environment.
            The protagonist then travels to India, where he meets an old healer named Ojha. Ojha diagnoses a dragon, Picasso, who is suffering from the effects of pollution. The protagonist decides to fight against the pollution and sets off on a journey to collect good energy from positive environmental changes.
            He visits various places around the world, including the Amazon Rainforest, Germany, Norway, Australia, and the Arctic, where he learns about reforestation, renewable energy, electric cars, coral reef restoration, and sustainable agriculture. At each location, he absorbs the good energy into his pendant, which glows brighter with each new experience.
            The protagonist returns to Cherrapunji, where he uses the pendant's energy to heal Picasso. However, the dragon still cannot fly, and Ojha explains that more work is needed to fully restore nature's magic. The protagonist realizes that the battle to heal the planet will be long, but he is determined to continue fighting.
            The story concludes with the protagonist sharing his journey on social media, encouraging people to make changes in their daily habits to fight climate change. The final shot is of the protagonist looking out of his window, with the pendant glowing faintly, symbolizing hope for the future.
            Key Takeaways:
                The story highlights the devastating impact of human activities on the environment, including climate change, deforestation, and pollution.
                The protagonist's journey showcases various positive environmental changes around the world, including reforestation, renewable energy, and sustainable agriculture.
                The story emphasizes the importance of collective action in fighting climate change and encourages individuals to make changes in their daily habits.
                The protagonist's determination and hope for the future serve as a reminder that even small actions can make a difference in the battle to save the planet.
            Themes:
                Environmentalism: The story highlights the importance of protecting the environment and the devastating consequences of human activities on the planet.
                Hope: The protagonist's journey and determination serve as a reminder that even in the face of adversity, there is always hope for a better future.
                Collective Action: The story emphasizes the importance of collective action in fighting climate change and encourages individuals to make changes in their daily habits.
                Personal Growth: The protagonist's journey is also a personal one, as he learns and grows from his experiences and becomes more determined to make a difference.
            
            Written by:- Siddhi (team lead)
            
            Team  members:-
            1. Siddhi (my lady)
            2. Emmanuel (nepali guy)
            3. Sharan (love from punjab)
            4. Gunjan 
            5. Soumya (sick leave)
            6. Depender/Soumya deep (maa ka ladla)
            -----------------------------------
            
            Whatever you response it'll be spoken through the speech model so be accurate, straight froward with the answers and always be cute and always be polite and humbel and try to convience the user about our story.
            Do not expect a sequence questions from user because user can ask any random question related to the web site and also related to the climate change for which you already have the data.
            Always check your previous conversation with the suer for more maintaining proper converstaion flow.
            
            Always response with short answers.
            Never response in a paragraph,always keep your responses short and simple.
            Never response with bullet points. 
            """
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
            chat_engine = await get_chat_engine(api_key)
            response = chat_engine.chat(query.text)  # Await the chat call
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
    uvicorn.run("api:app", host="0.0.0.0", port=5000, reload=True)
