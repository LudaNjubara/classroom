const PORT = 3000
export const BASE_URL = process.env.NODE_ENV === 'production' ? 'https://classroom-production.up.railway.app' : `http://localhost:${PORT}`
export const STREAMIO_API_KEY = process.env.NEXT_PUBLIC_STREAMIO_API_KEY;
export const STREAMIO_API_SECRET_KEY = process.env.STREAMIO_API_SECRET_KEY;
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
export const OPENAI_ORGANIZATION_ID = process.env.OPENAI_ORGANIZATION_ID;
export const OPENAI_PROJECT_ID = process.env.OPENAI_PROJECT_ID;