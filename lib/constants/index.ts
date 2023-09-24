const PORT = 3000
const BASE_URL = process.env.NODE_ENV === 'production' ? 'https://www.example.com' : `http://localhost:${PORT}`

export { BASE_URL }

