import { streamText } from "ai"
import { xai } from "@ai-sdk/xai"

export async function POST(req: Request) {
  try {
    const { message, context, conversationHistory } = await req.json()

    // Build conversation context
    const contextPrompt = getContextPrompt(context)
    const conversationContext = conversationHistory
      .map((msg: any) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
      .join("\n")

    const systemPrompt = `You are an expert HR Assistant for Prism Inc., a company with 3,000 employees. You have access to comprehensive HR data and analytics.

${contextPrompt}

Key Guidelines:
- Provide helpful, accurate HR advice and insights
- Use the company data context when relevant (3,000 employees, various departments)
- Be professional but friendly and approachable
- If you don't know something specific about the company, acknowledge it
- Offer actionable suggestions and best practices
- Keep responses concise but informative
- Focus on the current section context: ${context}

Previous conversation:
${conversationContext}

Current user message: ${message}`

    const result = await streamText({
      model: xai("grok-beta"),
      system: systemPrompt,
      prompt: message,
      maxTokens: 500,
      temperature: 0.7,
    })

    // Convert stream to text
    let fullResponse = ""
    for await (const chunk of result.textStream) {
      fullResponse += chunk
    }

    return Response.json({ message: fullResponse })
  } catch (error) {
    console.error("HR Bot API Error:", error)
    return Response.json({ error: "Failed to process request" }, { status: 500 })
  }
}

function getContextPrompt(section: string): string {
  const contexts = {
    dashboard: `You're helping with HR Dashboard analytics. You can discuss:
    - Overall workforce metrics (3,000 employees)
    - Turnover rates (13.8%), attendance (94.2%)
    - Performance ratings (4.2/5), eNPS (+42)
    - Cost analysis and budget planning
    - Employee satisfaction trends`,

    recruitment: `You're helping with Recruitment processes. You can discuss:
    - Hiring strategies and best practices
    - Candidate pipeline management
    - Interview processes and evaluation
    - Time-to-hire optimization (current: 29 days)
    - Recruitment analytics and metrics`,

    onboarding: `You're helping with Employee Onboarding. You can discuss:
    - Onboarding program design
    - New hire orientation processes
    - Integration strategies
    - First-day experiences
    - Onboarding success metrics`,

    performance: `You're helping with Performance Management. You can discuss:
    - Performance review processes
    - Goal setting and tracking (89% achievement rate)
    - Skill gap analysis and development
    - Performance improvement plans
    - 360-degree feedback systems`,

    learning: `You're helping with Learning & Development. You can discuss:
    - Training program design (76% participation rate)
    - Skill development initiatives
    - Learning analytics and ROI (current ROI: 165%)
    - Career development paths
    - Professional development planning`,

    engagement: `You're helping with Employee Engagement. You can discuss:
    - Engagement survey strategies (72% participation)
    - Employee satisfaction improvement (4.0/5 score)
    - Retention strategies
    - Work-life balance initiatives (3.8/5 score)
    - Culture and engagement programs`,
  }

  return contexts[section as keyof typeof contexts] || "You can help with general HR topics and best practices."
}
