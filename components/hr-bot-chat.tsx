"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

interface HRBotChatProps {
  currentSection: string
}

export function HRBotChat({ currentSection }: HRBotChatProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: `Hello! I'm your HR Assistant powered by Groq. I can help you with questions about ${getSectionContext(currentSection)}. How can I assist you today?`,
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus()
    }
  }, [isOpen, isMinimized])

  // Handle mobile viewport height changes (virtual keyboard)
  useEffect(() => {
    const handleResize = () => {
      // Force re-render when viewport changes
      if (isOpen) {
        setTimeout(() => {
          scrollToBottom()
        }, 100)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isOpen])

  function getSectionContext(section: string): string {
    const contexts = {
      dashboard: "HR analytics, employee metrics, and overall workforce insights",
      recruitment: "hiring processes, candidate management, and recruitment analytics",
      onboarding: "employee onboarding, orientation programs, and new hire processes",
      performance: "performance reviews, goal setting, skill development, and employee evaluations",
      learning: "training programs, skill development, learning analytics, and professional development",
      engagement: "employee satisfaction, engagement surveys, retention strategies, and workplace culture",
    }
    return contexts[section as keyof typeof contexts] || "HR-related topics"
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/hr-bot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `${inputValue} . When you are answering, be precise and comprehensive while answering`,
          context: currentSection,
          conversationHistory: messages.slice(-5), // Send last 5 messages for context
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      // Handle streaming response from Groq
      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error("No response body")
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "",
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      const decoder = new TextDecoder()
      let fullResponse = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split("\n")

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6)
            if (data === "[DONE]") {
              break
            }
            try {
              const parsed = JSON.parse(data)
              if (parsed.choices && parsed.choices[0] && parsed.choices[0].delta && parsed.choices[0].delta.content) {
                const content = parsed.choices[0].delta.content
                fullResponse += content
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessage.id ? { ...msg, content: fullResponse } : msg
                  )
                )
              }
            } catch (e) {
              // Ignore parsing errors for incomplete JSON
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
    setIsMinimized(false)
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={toggleChat}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 z-50 group"
          size="icon"
        >
          <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white group-hover:scale-110 transition-transform" />
          <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full animate-pulse"></div>
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed inset-2 sm:inset-4 md:bottom-6 md:right-6 md:left-auto md:top-auto w-auto h-auto md:w-96 md:h-[500px] max-h-[calc(100vh-1rem)] md:max-h-[500px] shadow-2xl z-50 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 flex flex-col">
          <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base sm:text-lg text-slate-800 dark:text-slate-200">HR Assistant</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-slate-600 dark:text-slate-400">Powered by Groq</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMinimize}
                  className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  {isMinimized ? (
                    <Maximize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-600 dark:text-slate-400" />
                  ) : (
                    <Minimize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-600 dark:text-slate-400" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleChat}
                  className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-600 dark:text-slate-400" />
                </Button>
              </div>
            </div>
            <Badge variant="secondary" className="w-fit text-xs">
              {getSectionContext(currentSection).split(",")[0]}
            </Badge>
          </CardHeader>

          {!isMinimized && (
            <>
              <CardContent className="p-0 flex-1 min-h-0">
                <ScrollArea className="h-full p-3 sm:p-4">
                  <div className="space-y-3 sm:space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-2 sm:gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {message.role === "assistant" && (
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                          </div>
                        )}
                        <div
                          className={`max-w-[calc(100vw-6rem)] sm:max-w-[280px] rounded-2xl px-3 py-2 sm:px-4 ${
                            message.role === "user"
                              ? "bg-blue-600 text-white ml-auto"
                              : "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                          }`}
                        >
                          {message.role === "assistant" ? (
                            <div className="text-sm leading-relaxed break-words prose prose-sm dark:prose-invert max-w-none">
                              <ReactMarkdown 
                                remarkPlugins={[remarkGfm]}
                                components={{
                                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                  h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                                  h2: ({ children }) => <h2 className="text-base font-semibold mb-2">{children}</h2>,
                                  h3: ({ children }) => <h3 className="text-sm font-semibold mb-1">{children}</h3>,
                                  ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                                  ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                                  li: ({ children }) => <li className="text-sm">{children}</li>,
                                  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                                  em: ({ children }) => <em className="italic">{children}</em>,
                                  code: ({ children }) => <code className="bg-slate-200 dark:bg-slate-600 px-1 py-0.5 rounded text-xs">{children}</code>,
                                  pre: ({ children }) => <pre className="bg-slate-200 dark:bg-slate-600 p-2 rounded text-xs overflow-x-auto mb-2">{children}</pre>,
                                  blockquote: ({ children }) => <blockquote className="border-l-4 border-slate-300 dark:border-slate-600 pl-3 italic mb-2">{children}</blockquote>,
                                }}
                              >
                                {message.content}
                              </ReactMarkdown>
                            </div>
                          ) : (
                            <p className="text-sm leading-relaxed break-words">{message.content}</p>
                          )}
                          <p
                            className={`text-xs mt-1 ${
                              message.role === "user" ? "text-blue-100" : "text-slate-500 dark:text-slate-400"
                            }`}
                          >
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        {message.role === "user" && (
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex gap-2 sm:gap-3 justify-start">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                          <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                        </div>
                        <div className="bg-slate-100 dark:bg-slate-700 rounded-2xl px-3 py-2 sm:px-4">
                          <div className="flex space-x-1">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-slate-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-slate-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-slate-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div ref={messagesEndRef} />
                </ScrollArea>
              </CardContent>

              <div className="p-3 sm:p-4 border-t border-slate-200/60 dark:border-slate-700/60 flex-shrink-0">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about HR..."
                    className="flex-1 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-sm"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white flex-shrink-0"
                    size="icon"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
                  AI responses may not always be accurate. Please verify important information.
                </p>
              </div>
            </>
          )}
        </Card>
      )}
    </>
  )
}
