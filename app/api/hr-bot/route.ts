import { streamText } from "ai"
import { xai } from "@ai-sdk/xai"

export async function POST(req: Request) {
  try {
    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY is not set")
      return Response.json({ error: "API key not configured" }, { status: 500 })
    }

    const { message, context, conversationHistory } = await req.json()

    const contextPrompt = getContextPrompt(context)
    const conversationContext = conversationHistory
      .map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      }))

    // Compose the messages array for Groq API
    const messages = [
      {
        role: "system",
        content: `You are an expert HR Assistant for FutureTech, a company with 3,000 employees. You have access to comprehensive HR data and analytics.

${contextPrompt}

Key Guidelines:
- Provide helpful, accurate HR advice and insights
- Use the company data context when relevant (3,000 employees, various departments)
- Be professional but friendly and approachable
- If you don't know something specific about the company, acknowledge it
- Offer actionable suggestions and best practices
- Keep responses concise but informative
- Focus on the current section context: ${context}
- Always respond in a helpful and professional manner`,
      },
      ...conversationContext,
      {
        role: "user",
        content: message,
      },
    ]

    console.log("Making Groq API call with model: llama-3.3-70b-versatile")
    
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages,
        max_tokens: 500,
        temperature: 0.7,
        stream: true,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("Groq API Error:", error)
      return Response.json({ 
        error: "Groq API call failed", 
        details: error.error?.message || "Unknown error"
      }, { status: 500 })
    }

    console.log("Groq API call successful, returning streaming response")
    
    // Return the streaming response directly
    return new Response(response.body, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    })
  } catch (error) {
    console.error("HR Bot API Error:", error)
    return Response.json({ 
      error: "Failed to process request",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

function getContextPrompt(section: string): string {
  const contexts = {
    dashboard: `You're helping with HR Dashboard analytics. You can discuss:
    - Overall workforce metrics (3,000 employees)
    - Turnover rates (13.8%), attendance (94.2%)
    - Performance ratings (4.2/5), eNPS (+42)
    - Cost analysis and budget planning
    - Employee satisfaction trends
    - Key performance indicators and trends
    - Workforce analytics and insights`,

    recruitment: `You're helping with Recruitment processes. You can discuss:
    - Hiring strategies and best practices
    - Candidate pipeline management
    - Interview processes and evaluation
    - Time-to-hire optimization (current: 29 days)
    - Recruitment analytics and metrics
    - Sourcing strategies and candidate experience
    - Recruitment technology and tools`,

    onboarding: `You're helping with Employee Onboarding. You can discuss:
    - Onboarding program design
    - New hire orientation processes
    - Integration strategies
    - First-day experiences
    - Onboarding success metrics
    - Employee engagement during onboarding
    - Onboarding technology and automation`,

    performance: `You're helping with Performance Management. You can discuss:
    - Performance review processes
    - Goal setting and tracking (89% achievement rate)
    - Skill gap analysis and development
    - Performance improvement plans
    - 360-degree feedback systems
    - Performance metrics and KPIs
    - Performance management technology`,

    learning: `You're helping with Learning & Development. You can discuss:
    - Training program design (76% participation rate)
    - Skill development initiatives
    - Learning analytics and ROI (current ROI: 165%)
    - Career development paths
    - Professional development planning
    - Learning technology and platforms
    - Training effectiveness measurement`,

    engagement: `You're helping with Employee Engagement. You can discuss:
    - Engagement survey strategies (72% participation)
    - Employee satisfaction improvement (4.0/5 score)
    - Retention strategies
    - Work-life balance initiatives (3.8/5 score)
    - Culture and engagement programs
    - Employee recognition programs
    - Communication and feedback systems`,
  }

  return contexts[section as keyof typeof contexts] || "You can help with general HR topics and best practices."
}
