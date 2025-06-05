import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import { Button } from "@/components/ui/button";
import { BiArrowBack } from "react-icons/bi";
import { MdContentCopy } from "react-icons/md";
import { toast } from "sonner";

function SharedChat() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const fetchSharedSession = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/ai/shared-chat/${sessionId}`
        );
        const data = await response.json();
        setSession(data.data);
        setMessages(data.data.messages || []);
        setError(null);
      } catch (error) {
        setError(
          error?.response?.data?.message || "Failed to load shared chat"
        );
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
    navigator.clipboard
      .writeText(shareableLink)
      .then(() => toast.success("Link copied to clipboard!"))
      .catch(() => toast.error("Failed to copy link"));
  };

  if (loading) {
    return (
      // <DashboardLayout>
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
      // </DashboardLayout>
    );
  }

  if (error) {
    return (
      // <DashboardLayout>
      <div className="flex flex-col items-center justify-center h-64">
        <h3 className="text-xl font-semibold text-red-500">Error</h3>
        <p className="text-gray-600">{error}</p>
        <Button onClick={handleGoBack} className="mt-4">
          <BiArrowBack className="mr-2" /> Go Back
        </Button>
      </div>
      // </DashboardLayout>
    );
  }

  return (
    // <DashboardLayout>
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
          <h2 className="text-xl font-semibold">
            {session?.title || "Shared Chat"}
          </h2>
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
        <div className="w-full max-w-3xl mx-auto px-2 md:px-4">
          {messages?.length === 0 ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-gray-500">
                No messages in this conversation yet
              </p>
            </div>
          ) : (
            messages?.map((msg, index) => (
              <div
                key={index}
                className={`flex my-3 ${
                  msg.senderId === "aichatId" ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`py-2 px-3 rounded-2xl max-w-[85%] ${
                    msg.senderId === "aichatId"
                      ? "bg-[#EEEFF8] text-black"
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
    // </DashboardLayout>
  );
}

export default SharedChat;
