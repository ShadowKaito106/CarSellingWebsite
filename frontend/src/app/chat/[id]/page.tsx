'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeftIcon, PaperAirplaneIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

type Participant = {
  _id: string
  name: string
  avatar?: string
}

type Message = {
  _id: string
  sender: string
  content: string
  timestamp: string
  read: boolean
}

type Chat = {
  _id: string
  participants: Participant[]
  messages: Message[]
  vehicle?: {
    _id: string
    title: string
    price: number
    image: string
  }
}

export default function ChatDetail({ params }: { params: { id: string } }) {
  const { user, isAuthenticated } = useAuth()
  const [chat, setChat] = useState<Chat | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // In a real application, you would fetch chat data from the API
    const mockChat: Chat = {
      _id: params.id,
      participants: [
        { _id: 'user1', name: 'Vinhanmobile', avatar: '/user-avatar.png' },
        { _id: 'current', name: 'You' }
      ],
      messages: [
        {
          _id: '1',
          sender: 'user1',
          content: 'Xin chào, tôi quan tâm đến sản phẩm của bạn',
          timestamp: '2023-04-01T10:00:00Z',
          read: true
        },
        {
          _id: '2',
          sender: 'current',
          content: 'Chào bạn, cảm ơn bạn đã quan tâm. Bạn có thắc mắc gì về sản phẩm không?',
          timestamp: '2023-04-01T10:05:00Z',
          read: true
        },
        {
          _id: '3',
          sender: 'user1',
          content: 'Sản phẩm còn hàng không?',
          timestamp: '2023-04-01T10:10:00Z',
          read: true
        },
        {
          _id: '4',
          sender: 'current',
          content: 'Còn hàng bạn nhé, bạn có thể đặt hàng ngay bây giờ',
          timestamp: '2023-04-01T10:15:00Z',
          read: true
        },
        {
          _id: '5',
          sender: 'user1',
          content: 'Kho MTB Xiaomi Mipad 5 và 6.7 - Hàng VN còn không ạ?',
          timestamp: '2023-04-01T10:20:00Z',
          read: true
        }
      ],
      vehicle: {
        _id: 'v1',
        title: 'Kho MTB Xiaomi Mipad 5 và 6.7 - Hàng VN',
        price: 4500000,
        image: '/product-image.jpg'
      }
    }

    setChat(mockChat)
    setIsLoading(false)
  }, [params.id])

  useEffect(() => {
    scrollToBottom()
  }, [chat?.messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !chat) return

    const newMsg: Message = {
      _id: Date.now().toString(),
      sender: 'current',
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: false
    }

    setChat({
      ...chat,
      messages: [...chat.messages, newMsg]
    })
    setNewMessage('')
  }

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ArrowPathIcon className="h-8 w-8 animate-spin mx-auto text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  if (!chat) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-gray-500">Không tìm thấy cuộc trò chuyện này</p>
          <Link href="/chat" className="mt-4 inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
            <ChevronLeftIcon className="h-4 w-4 mr-1" />
            Quay lại danh sách
          </Link>
        </div>
      </div>
    )
  }

  const otherParticipant = chat.participants.find(p => p._id !== 'current')

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 px-4 py-3 flex items-center bg-white sticky top-0 z-10">
        <Link href="/chat" className="text-gray-500 hover:text-gray-700 mr-3">
          <ChevronLeftIcon className="h-5 w-5" />
        </Link>
        
        <div className="flex-shrink-0 h-10 w-10 relative">
          {otherParticipant?.avatar ? (
            <img 
              src={otherParticipant.avatar} 
              alt={otherParticipant.name}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
              {otherParticipant?.name.charAt(0)}
            </div>
          )}
        </div>
        
        <div className="ml-3 flex-1">
          <h2 className="text-sm font-medium text-gray-900">
            {otherParticipant?.name}
          </h2>
          <p className="text-xs text-gray-500">
            Hoạt động 5 phút trước
          </p>
        </div>
        
        <button className="text-gray-500 hover:text-gray-700 p-1">
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

      {/* Product Info Card (if available) */}
      {chat.vehicle && (
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center bg-gray-50 rounded-lg p-3">
            <div className="flex-shrink-0 h-14 w-14 bg-gray-200 rounded">
              {chat.vehicle.image && (
                <img 
                  src={chat.vehicle.image} 
                  alt={chat.vehicle.title}
                  className="h-14 w-14 object-cover rounded"
                />
              )}
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {chat.vehicle.title}
              </p>
              <p className="text-sm text-gray-500">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(chat.vehicle.price)}
              </p>
            </div>
            <Link href={`/vehicles/${chat.vehicle._id}`} className="text-blue-600 text-xs font-medium">
              XEM
            </Link>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {chat.messages.map(message => (
          <div 
            key={message._id} 
            className={`flex ${message.sender === 'current' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === 'current' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-white text-gray-800 rounded-bl-none shadow'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p 
                className={`text-xs mt-1 text-right ${
                  message.sender === 'current' ? 'text-blue-200' : 'text-gray-500'
                }`}
              >
                {formatTimestamp(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 px-4 py-3 bg-white">
        <form onSubmit={handleSendMessage} className="flex">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-l-full py-2 px-4 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nhập tin nhắn..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white rounded-r-full px-4 flex items-center justify-center hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={!newMessage.trim()}
          >
            <PaperAirplaneIcon className="h-5 w-5 rotate-90" />
          </button>
        </form>
      </div>
    </div>
  )
} 