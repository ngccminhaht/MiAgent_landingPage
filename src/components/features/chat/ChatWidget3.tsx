// src/components/ChatWidget3.tsx

"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowUp } from "lucide-react"

interface Message {
  id: number
  type: "customer" | "agent"
  content: string
  image?: string
}

const conversationScript: (Message & { delay: number })[] = [
  { id: 1, type: "customer", content: "Shop ơi, áo thun trắng basic size M còn bao nhiêu cái trong kho vậy ạ?", delay: 1200 },
  { id: 2, type: "agent", content: "Em kiểm tra realtime trên hệ thống CRM cho chị nhé 🕐", delay: 1500 },
  { id: 3, type: "agent", content: "Hiện shop còn 12 chiếc size M, và đang có chương trình *mua 2 tặng 1* áp dụng đến hết hôm nay ạ 🎉", delay: 2000 },
  { id: 4, type: "customer", content: "Tốt quá! Vậy chị lấy 2 chiếc nhé, để được tặng thêm 1 chiếc đúng không?", delay: 2000 },
  { id: 5, type: "agent", content: "Dạ đúng rồi ạ 💖\n\nMiAgent đã tạo đơn hàng tạm cho chị:\n\n📦 Áo thun trắng basic – Size M (2 tặng 1)\n💰 Giá: 239k/chiếc → Tổng 478k, tặng thêm 1 chiếc miễn phí\n🚚 Giao hàng: 2–3 giờ tại 123 Trần Duy Hưng, Cầu Giấy, HN\n\nChị có muốn xác nhận đơn ngay để em gửi qua hệ thống ERP xử lý luôn không ạ?", image: "/XF003.jpg", delay: 3000 },
  { id: 6, type: "customer", content: "Ok, xác nhận giúp chị nhé.", delay: 2000 },
  { id: 7, type: "agent", content: "Dạ vâng! ✅\n\nEm vừa đẩy đơn hàng lên hệ thống ERP — mã đơn là *#DH10254*.\nTình trạng hiện tại: **Đang chờ xác nhận kho**.\n\nChị có thể theo dõi realtime trạng thái đơn này trực tiếp ngay tại đây hoặc trong app của shop nhé 📲", delay: 3000 },
];



function TypingIndicator() {
  return (
    <div className="flex gap-2 justify-start">
      <Avatar className="h-8 w-8 bg-primary/10 flex-shrink-0">
        <AvatarFallback className="bg-primary/10 text-primary text-xs">AI</AvatarFallback>
      </Avatar>
      <div className="bg-gray-200 rounded-lg p-3 flex items-center gap-1.5">
        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  )
}

export function ChatWidget3() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // ✅ ĐÃ SỬA: scroll mượt, không hiện thanh scroll
  const scrollToBottom = () => {
    const container = messagesEndRef.current
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  useEffect(() => {
      // ❌ SỬA ĐOẠN NÀY ĐỂ TẠO VÒNG LẶP CHAT
      if (currentMessageIndex >= conversationScript.length) {
        // Khi kịch bản kết thúc (đã hiển thị hết tin nhắn)
        const restartTimer = setTimeout(() => {
          // 1. Xóa tất cả tin nhắn
          setMessages([])
          // 2. Reset index về 0 để bắt đầu lại
          setCurrentMessageIndex(0)
          // 3. (Tùy chọn) Thời gian chờ trước khi bắt đầu lại vòng mới (ví dụ: 5 giây)
        }, 3000) // Chờ 5 giây sau khi kết thúc để bắt đầu lại
  
        return () => clearTimeout(restartTimer) // Cleanup cho timer restart
      }

    const currentMsg = conversationScript[currentMessageIndex]
    const timer = setTimeout(() => {
      if (currentMsg.type === "agent") {
        setIsTyping(true)
        setTimeout(() => {
          setIsTyping(false)
          setMessages((prev) => [...prev, currentMsg])
          setCurrentMessageIndex((prev) => prev + 1)
        }, 1500)
      } else {
        setMessages((prev) => [...prev, currentMsg])
        setCurrentMessageIndex((prev) => prev + 1)
      }
    }, currentMsg.delay)

    return () => clearTimeout(timer)
  }, [currentMessageIndex])

  const handleSend = () => {
    if (inputValue.trim()) {
      const newMessage: Message = { id: Date.now(), type: "customer", content: inputValue }
      setMessages([...messages, newMessage])
      setInputValue("")
    }
  }

  return (
    
    <div className="w-full lg:max-w-[300px] h-full max-h-[90vh] lg:h-[520px] bg-white rounded-3xl border-2 shadow-2xs flex flex-col overflow-hidden">
      <div className="bg-white border-b p-4 flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-black text-white font-semibold">AI</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-sm text-black">AI Agent</h3>
          <p className="text-xs text-gray-500 flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            Đang hoạt động
          </p>
        </div>
      </div>

      {/* ✅ ĐÃ SỬA: thêm class scroll-hide để ẩn thanh cuộn */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 scroll-hide" ref={messagesEndRef}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2 ${
              message.type === "customer" ? "justify-end" : "justify-start"
            } animate-in fade-in slide-in-from-bottom-2 duration-300`}
          >
            {message.type === "agent" && (
              <Avatar className="h-8 w-8 bg-black/10 flex-shrink-0">
                <AvatarFallback className="bg-black/5 text-black text-xs">AI</AvatarFallback>
              </Avatar>
            )}
            <div
              className={`max-w-[80%] rounded-lg p-3 text-sm leading-relaxed ${
                message.type === "customer" ? "bg-black text-white" : "bg-gray-100 text-black"
              }`}
            >
              {message.image && (
                <div className="mb-2 rounded overflow-hidden">
                  <img src={message.image || "/placeholder.svg"} alt="Product" className="w-full h-auto" />
                </div>
              )}
              {message.content && <p className="whitespace-pre-line">{message.content}</p>}
            </div>
          </div>
        ))}
        {isTyping && <TypingIndicator />}
      </div>

      <div className="border-t p-4 bg-white">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Nhập tin nhắn..."
            className="flex-1"
          />
          <Button
            size="icon"
            onClick={handleSend}
            className="bg-black text-white hover:bg-black/90 rounded-full flex-shrink-0"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
