"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

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
      content: `Hello! I'm your HR Assistant powered by Grok. I can help you with questions about ${getSectionContext(currentSection)}. How can I assist you today?`,
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
          message: inputValue,
          context: currentSection,
          conversationHistory: messages.slice(-5), // Send last 5 messages for context
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
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
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 z-50 group"
          size="icon"
        >
          <MessageCircle className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-2xl z-50 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60">
          <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg text-slate-800 dark:text-slate-200">HR Assistant</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-slate-600 dark:text-slate-400">Powered by Grok</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMinimize}
                  className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  {isMinimized ? (
                    <Maximize2 className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  ) : (
                    <Minimize2 className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleChat}
                  className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <X className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                </Button>
              </div>
            </div>
            <Badge variant="secondary" className="w-fit text-xs">
              {getSectionContext(currentSection).split(",")[0]}
            </Badge>
          </CardHeader>

          {!isMinimized && (
            <>
              <CardContent className="p-0 flex-1">
                <ScrollArea className="h-[340px] p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {message.role === "assistant" && (
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <div
                          className={`max-w-[280px] rounded-2xl px-4 py-2 ${
                            message.role === "user"
                              ? "bg-blue-600 text-white ml-auto"
                              : "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{message.content}</p>
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
                          <div className="w-8 h-8 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex gap-3 justify-start">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-slate-100 dark:bg-slate-700 rounded-2xl px-4 py-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
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

              <div className="p-4 border-t border-slate-200/60 dark:border-slate-700/60">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about HR..."
                    className="flex-1 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
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
