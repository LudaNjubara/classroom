const PORT = 3000
export const BASE_URL = process.env.NODE_ENV === 'production' ? 'https://classroom-production.up.railway.app' : `http://localhost:${PORT}`
