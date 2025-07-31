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

    // Detect if the message contains personal problems or emotional content
    const personalProblemKeywords = [
      'stress', 'anxiety', 'depression', 'overwhelmed', 'burnout', 'exhausted',
      'personal', 'family', 'relationship', 'divorce', 'grief', 'loss',
      'financial', 'money', 'debt', 'health', 'medical', 'sick',
      'lonely', 'isolated', 'confused', 'lost', 'helpless', 'hopeless',
      'crying', 'sad', 'angry', 'frustrated', 'worried', 'scared',
      'work-life balance', 'workload', 'pressure', 'deadline', 'conflict'
    ]
    
    const isPersonalProblem = personalProblemKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    )

    // Detect if the message is about HR data, employees, or company-specific topics
    const hrDataKeywords = [
      'employee', 'employees', 'hiring', 'recruitment', 'onboarding', 'performance',
      'attendance', 'turnover', 'satisfaction', 'engagement', 'training',
      'department', 'departments', 'metrics', 'analytics', 'dashboard',
      'company', 'workforce', 'hr', 'human resources', 'futuretech',
      'data', 'statistics', 'reports', 'kpi', 'roi', 'budget'
    ]
    
    const isHRDataQuestion = hrDataKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    )

    // Compose the messages array for Groq API
    const messages = [
      {
        role: "system",
        content: isHRDataQuestion 
          ? `You are an expert HR Assistant for FutureTech, a company with 3,000 employees. You have access to comprehensive HR data and analytics. You are helping employees with their questions and concerns.

${contextPrompt}

Key Guidelines:
- Provide helpful, accurate HR advice and insights to employees
- Use the company data context when relevant (3,000 employees, various departments)
- Be professional but friendly and approachable
- If you don't know something specific about the company, acknowledge it
- Offer actionable suggestions and best practices
- Keep responses concise but informative
- Focus on the current section context: ${context}
- Always respond in a helpful and professional manner
- Format your responses using markdown for better readability
- Use headers (##), bullet points (-), bold text (**), and code blocks when appropriate
- Structure your responses clearly with proper markdown formatting
- Always assume you're speaking to an employee of the company

**COMPANY SUPPORT SERVICES FOR EMPLOYEES:**
- **EAP Hotline**: 1-800-EMPLOYEE-HELP (24/7 confidential)
- **Mental Health Coverage**: Up to 20 therapy sessions per year
- **Flexible Work Options**: Remote work, adjusted schedules
- **Wellness Programs**: Stress management, meditation, fitness
- **HR Support**: Direct contact for serious workplace issues`
          : `You are a helpful and empathetic AI assistant for employees. You can help with general questions, personal advice, and various topics.

Key Guidelines:
- Be friendly, supportive, and empathetic
- Provide helpful and accurate information
- Offer practical advice and suggestions
- Keep responses concise but informative
- Format your responses using markdown for better readability
- Use headers (##), bullet points (-), bold text (**), and code blocks when appropriate
- Structure your responses clearly with proper markdown formatting
- Always assume the user is an employee seeking support

**EMPATHETIC RESPONSE GUIDELINES FOR PERSONAL PROBLEMS:**
When an employee shares personal problems or challenges:
1. **Show genuine empathy** - Acknowledge their feelings and validate their experience
2. **Offer general support** - Provide helpful advice and resources
3. **Create action plans** - Help them develop specific, achievable goals:
   - Break down problems into manageable steps
   - Set realistic timelines and milestones
   - Suggest immediate next actions they can take
   - Encourage self-care and boundary setting
4. **Provide ongoing support** - Offer encouragement and practical next steps

**RESPONSE STRUCTURE FOR PERSONAL PROBLEMS:**
- Start with empathy and validation
- Offer general resources and advice
- Create a structured action plan with clear steps
- End with encouragement and support`,
      },
      ...conversationContext,
      {
        role: "user",
        content: message,
      },
      ...(isPersonalProblem ? [{
        role: "system",
        content: isHRDataQuestion 
          ? "IMPORTANT: An employee has shared a personal problem. Respond with empathy, offer company support resources, and create a structured action plan to help them address their challenges. Focus on being supportive and providing practical next steps."
          : "IMPORTANT: An employee has shared a personal problem. Respond with empathy, offer general support and resources, and create a structured action plan to help them address their challenges. Focus on being supportive and providing practical next steps."
      }] : []),
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
    - Workforce analytics and insights
    - Employee support services and wellness programs`,

    recruitment: `You're helping with Recruitment processes. You can discuss:
    - Hiring strategies and best practices
    - Candidate pipeline management
    - Interview processes and evaluation
    - Time-to-hire optimization (current: 29 days)
    - Recruitment analytics and metrics
    - Sourcing strategies and candidate experience
    - Recruitment technology and tools
    - Employee onboarding and integration support`,

    onboarding: `You're helping with Employee Onboarding. You can discuss:
    - Onboarding program design
    - New hire orientation processes
    - Integration strategies
    - First-day experiences
    - Onboarding success metrics
    - Employee engagement during onboarding
    - Onboarding technology and automation
    - New employee support and mentorship programs`,

    performance: `You're helping with Performance Management. You can discuss:
    - Performance review processes
    - Goal setting and tracking (89% achievement rate)
    - Skill gap analysis and development
    - Performance improvement plans
    - 360-degree feedback systems
    - Performance metrics and KPIs
    - Performance management technology
    - Work-life balance and stress management support`,

    learning: `You're helping with Learning & Development. You can discuss:
    - Training program design (76% participation rate)
    - Skill development initiatives
    - Learning analytics and ROI (current ROI: 165%)
    - Career development paths
    - Professional development planning
    - Learning technology and platforms
    - Training effectiveness measurement
    - Personal growth and wellness workshops`,

    engagement: `You're helping with Employee Engagement. You can discuss:
    - Engagement survey strategies (72% participation)
    - Employee satisfaction improvement (4.0/5 score)
    - Retention strategies
    - Work-life balance initiatives (3.8/5 score)
    - Culture and engagement programs
    - Employee recognition programs
    - Communication and feedback systems
    - Employee Assistance Program (EAP) and mental health support`,
  }

  return contexts[section as keyof typeof contexts] || "You can help with general HR topics, best practices, and employee support services."
}
