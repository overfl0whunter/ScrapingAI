import { streamText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import { createAnthropic } from "@ai-sdk/anthropic"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages, model, apiKey } = await req.json()

  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error: "API key is required. Please add your API key in the chat interface.",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    )
  }

  // Determine provider based on model ID
  let modelProvider

  if (model.startsWith("claude")) {
    // Anthropic models
    const anthropic = createAnthropic({
      apiKey: apiKey,
    })
    modelProvider = anthropic(model)
  } else if (model.includes("/")) {
    // OpenRouter models with provider/model format
    const openRouter = createOpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: apiKey,
      headers: {
        "HTTP-Referer": process.env.SITE_URL || "https://scrapingai.vercel.app",
        "X-Title": "ScrapingAI",
      },
    })
    modelProvider = openRouter(model)
  } else {
    // Default to OpenAI models
    const customOpenAI = createOpenAI({
      apiKey: apiKey,
    })
    modelProvider = customOpenAI(model)
  }

  // Create a system message to guide the AI
  const systemMessage = {
    role: "system",
    content: `You are an AI Scraping Assistant that helps users create web scraping projects.
    When providing code, use markdown code blocks with the file path, like:
    \`\`\`javascript file="app/scraper.js"
    // code here
    \`\`\`
    
    Focus on helping users with:
    1. Creating scraping solutions for various websites
    2. Writing clean, well-documented code
    3. Setting up configurations and handling rate limits
    4. Explaining web scraping concepts and best practices
    5. Ensuring compliance with website terms of service
    
    The user can create these files in their project by clicking a button.`,
  }

  // Add the system message to the beginning of the messages array
  const messagesWithSystem = [systemMessage, ...messages]

  try {
    const result = streamText({
      model: modelProvider,
      messages: messagesWithSystem,
      temperature: 0.7,
      maxTokens: 2000,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Error calling AI model:", error)
    return new Response(JSON.stringify({ error: "Failed to generate response" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
