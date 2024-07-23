import { OPENAI_API_KEY, OPENAI_ORGANIZATION_ID, OPENAI_PROJECT_ID } from "@/constants"
import OpenAI from "openai"

const client = new OpenAI({
    organization: OPENAI_ORGANIZATION_ID,
    project: OPENAI_PROJECT_ID,
    apiKey: OPENAI_API_KEY
})

export { client }

