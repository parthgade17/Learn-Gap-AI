import os
from dotenv import load_dotenv

# Load .env file from project root or backend folder
load_dotenv()
load_dotenv(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))

class Settings:
    PROJECT_NAME: str = "LearnGap AI Backend"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Supabase Configuration
    SUPABASE_URL: str = os.getenv("VITE_SUPABASE_URL", os.getenv("SUPABASE_URL", "https://demo-placeholder.supabase.co"))
    SUPABASE_KEY: str = os.getenv("VITE_SUPABASE_ANON_KEY", os.getenv("SUPABASE_KEY", "demo-anon-key"))
    
    # Server settings
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    
    # Redis Configuration (Temporary buffer & rate limiter)
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    
    # School context (Kopargaon taluka, Ahilyanagar)
    DEFAULT_SCHOOL_ID: str = "ZP-KPG-01"
    DEFAULT_SCHOOL_NAME: str = "जि. प. प्राथमिक शाळा, कोपरगाव"
    
    @property
    def is_supabase_configured(self) -> bool:
        return (
            bool(self.SUPABASE_URL)
            and self.SUPABASE_URL != "https://demo-placeholder.supabase.co"
            and bool(self.SUPABASE_KEY)
            and self.SUPABASE_KEY != "demo-anon-key"
        )

settings = Settings()
