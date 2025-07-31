import { xai } from "@ai-sdk/xai"

export async function GET() {
  try {
    if (!process.env.XAI_API_KEY) {
      return Response.json({ error: "XAI_API_KEY not set" })
    }

    // Test if we can create the model instance
    const model = xai("x-1")
    
    return Response.json({
      success: true,
      model: "x-1",
      message: "XAI model instance created successfully"
    })
  } catch (error) {
    return Response.json({
      error: "Failed to create XAI model",
      details: error instanceof Error ? error.message : "Unknown error"
    })
  }
} 