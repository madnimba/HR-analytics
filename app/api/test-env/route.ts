export async function GET() {
  const hasXaiKey = !!process.env.XAI_API_KEY
  const keyLength = process.env.XAI_API_KEY?.length || 0
  
  return Response.json({
    hasXaiKey,
    keyLength,
    message: hasXaiKey 
      ? "XAI_API_KEY is configured" 
      : "XAI_API_KEY is not configured"
  })
} 