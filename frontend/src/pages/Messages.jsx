import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { MessageCircle, Send, CheckCheck, User, Store, Stethoscope } from "lucide-react";

const INITIAL_CONVERSATIONS = [
  {
    id: "conv-1",
    name: "Paws & Whiskers Store",
    role: "Official Seller",
    type: "seller",
    avatar: Store,
    lastMessage: "Your order for Royal Canin Maxi is being prepared for dispatch!",
    time: "10:30 AM",
    unread: 1,
    messages: [
      { id: "m1", sender: "them", text: "Hello! Thank you for inquiring about our dog food stock.", time: "10:15 AM" },
      { id: "m2", sender: "me", text: "Hi, do you have fresh batches available for shipment?", time: "10:20 AM" },
      { id: "m3", sender: "them", text: "Your order for Royal Canin Maxi is being prepared for dispatch!", time: "10:30 AM" }
    ]
  },
  {
    id: "conv-2",
    name: "Metropolitan Veterinary 24/7",
    role: "Emergency Clinic",
    type: "vet",
    avatar: Stethoscope,
    lastMessage: "Our emergency desk is open 24 hours. Call directly for urgent surgery.",
    time: "Yesterday",
    unread: 0,
    messages: [
      { id: "v1", sender: "them", text: "Welcome to Metropolitan Veterinary ER directory chat.", time: "Yesterday" },
      { id: "v2", sender: "them", text: "Our emergency desk is open 24 hours. Call directly for urgent surgery.", time: "Yesterday" }
    ]
  },
  {
    id: "conv-3",
    name: "Petly Support Desk",
    role: "Support Team",
    type: "support",
    avatar: User,
    lastMessage: "Welcome to Petly! Feel free to ask any questions about our marketplace.",
    time: "Oct 25",
    unread: 0,
    messages: [
      { id: "s1", sender: "them", text: "Welcome to Petly! Feel free to ask any questions about our marketplace.", time: "Oct 25" }
    ]
  }
];

export default function Messages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [activeId, setActiveId] = useState("conv-1");
  const [inputText, setInputText] = useState("");

  if (!user) {
    return (
      <div className="card mx-auto max-w-md p-8 text-center">
        <MessageCircle className="mx-auto mb-3 text-leaf-600" size={36} />
        <h1 className="text-2xl font-bold">Your Messages</h1>
        <p className="mt-2 text-sm text-gray-600">Please sign in to chat with sellers and veterinary clinic desks.</p>
        <Link to="/login" className="btn mt-6 inline-block w-full">Sign In / Register</Link>
      </div>
    );
  }

  const activeConv = conversations.find(c => c.id === activeId) || conversations[0];

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      id: "msg-" + Date.now(),
      sender: "me",
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setConversations(conversations.map(c => {
      if (c.id === activeId) {
        return {
          ...c,
          lastMessage: newMsg.text,
          time: newMsg.time,
          messages: [...c.messages, newMsg]
        };
      }
      return c;
    }));

    setInputText("");
  };

  return (
    <div className="card mx-auto flex h-[620px] max-w-5xl overflow-hidden">
      {/* Conversations List */}
      <div className="w-1/3 border-r border-gray-100 flex flex-col bg-gray-50/50">
        <div className="border-b border-gray-100 p-4">
          <h1 className="text-lg font-bold text-gray-900">Messages</h1>
          <p className="text-xs text-gray-500">Inquiries with sellers and clinics</p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {conversations.map(c => {
            const Icon = c.avatar;
            const active = c.id === activeId;
            return (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={`w-full flex items-start gap-3 p-3.5 text-left transition ${
                  active ? "bg-leaf-50 border-r-4 border-leaf-600" : "hover:bg-white"
                }`}
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-leaf-100 text-leaf-700">
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="truncate text-sm font-semibold text-gray-900">{c.name}</p>
                    <span className="text-[10px] text-gray-400">{c.time}</span>
                  </div>
                  <p className="truncate text-xs text-gray-500 mt-0.5">{c.lastMessage}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Chat Window */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-leaf-100 text-leaf-700">
              <activeConv.avatar size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">{activeConv.name}</h2>
              <span className="text-xs text-leaf-700">{activeConv.role}</span>
            </div>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeConv.messages.map(m => {
            const isMe = m.sender === "me";
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-md rounded-2xl px-4 py-2.5 text-sm ${
                    isMe
                      ? "bg-leaf-600 text-white rounded-br-xs shadow-sm"
                      : "bg-gray-100 text-gray-800 rounded-bl-xs"
                  }`}
                >
                  <p>{m.text}</p>
                </div>
                <span className="mt-1 flex items-center gap-1 text-[10px] text-gray-400 px-1">
                  {m.time} {isMe && <CheckCheck size={12} className="text-leaf-600" />}
                </span>
              </div>
            );
          })}
        </div>

        {/* Message Input Box */}
        <form onSubmit={handleSend} className="border-t border-gray-100 p-4 flex gap-2">
          <input
            type="text"
            className="input"
            placeholder={`Message ${activeConv.name}…`}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="btn px-4 flex items-center justify-center disabled:opacity-40"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
