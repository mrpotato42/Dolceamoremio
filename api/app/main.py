from fastapi import FastAPI;
from fastapi.middleware.cors import CORSMiddleware;

app = FastAPI(
    title="Dolce Amore Mio API",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Run Dolce Amore Mio API!"};

@app.get("/health")
def health():
    return {"status": "OK"};

