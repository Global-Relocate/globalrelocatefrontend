import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import axiosInstance from "@/config/axiosInstance";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { BiArrowBack } from "react-icons/bi";
import { MdContentCopy } from "react-icons/md";
import { toast } from "sonner";
import AiChatInput from "@/components/forms/AiChatInput";

function SharedChat() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const chatContainerRef = useRef(null);
  
  useEffect(() => {
    const fetchSharedSession = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/ai/session/${sessionId}`);
        setSession(response.data.data);
        setMessages(response.data.data.messages || []);
        setError(null);
      } catch (error) {
        setError(error?.response?.data?.message || "Failed to load shared chat");
        toast.error("Failed to load shared chat");
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchSharedSession();
    }
  }, [sessionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleCopyLink = () => {
    const shareableLink = window.location.href;
    navigator.clipboard.writeText(shareableLink)
      .then(() => toast.success("Link copied to clipboard!"))
      .catch(() => toast.error("Failed to copy link"));
  };

  const handleSendMessage = async (message) => {
    if (!sessionId) return;
    
    setIsSending(true);
    
    // Add the user message to the local messages for immediate feedback
    setMessages((prevMessages) => [
      ...prevMessages,
      { senderId: "user", message },
    ]);
    
    scrollToBottom();

    try {
      // This endpoint would be for continuing conversation in a shared chat
      await axiosInstance.post(`/ai/shared/${sessionId}/reply`, { message });
      
      // Fetch the updated messages
      const response = await axiosInstance.get(`/ai/shared/${sessionId}`);
      setMessages(response.data.data.messages || []);
    } catch (error) {
      toast.error("Failed to send message");
      // Remove the optimistically added message if there was an error
      setMessages((prevMessages) => 
        prevMessages.slice(0, prevMessages.length - 1)
      );
    } finally {
      setIsSending(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <h3 className="text-xl font-semibold text-red-500">Error</h3>
          <p className="text-gray-600">{error}</p>
          <Button onClick={handleGoBack} className="mt-4">
            <BiArrowBack className="mr-2" /> Go Back
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col h-screen">
        <div className="flex items-center justify-between mb-4 p-4 border-b">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleGoBack}
              className="rounded-full"
            >
              <BiArrowBack />
            </Button>
            <h2 className="text-xl font-semibold">{session?.title || "Shared Chat"}</h2>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleCopyLink}
            className="rounded-full flex items-center gap-2"
          >
            <MdContentCopy /> Copy Link
          </Button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="w-full max-w-4xl mx-auto">
            {messages?.length === 0 ? (
              <div className="flex justify-center items-center h-32">
                <p className="text-gray-500">No messages in this conversation yet</p>
              </div>
            ) : (
              messages?.map((msg, index) => (
                <div
                  key={index}
                  className={`flex my-10 ${
                    msg.senderId === "aichatId" ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`p-4 rounded-lg max-w-[90%] ${
                      msg.senderId === "aichatId"
                        ? "bg-gray-200 text-black"
                        : "bg-blue-500 text-white"
                    }`}
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(msg.message),
                    }}
                  />
                </div>
              ))
            )}

            <div ref={chatContainerRef} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default SharedChat;