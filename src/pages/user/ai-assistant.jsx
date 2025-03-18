import AiChatInput from "@/components/forms/AiChatInput";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect, useRef, useContext } from "react";
import { BiEdit, BiPlus } from "react-icons/bi";
import { PiShare } from "react-icons/pi";
import { TbDots } from "react-icons/tb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MdDelete } from "react-icons/md";
import { useAIChat } from "@/context/AiChatContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";

function AiAssistant() {
  const {
    sessions,
    currentSession,
    setCurrentSession,
    fetchAllSessions,
    loading,
    messages,
    startChatSession,
    askAI,
    clearChatSession,
    renameChatSession,
    fetchSingleSession,
  } = useAIChat();

  const [isSending, setIsSending] = useState(false);
  const [localMessages, setLocalMessages] = useState([]);
  const navigate = useNavigate();
  const chatContainerRef = useRef(null);
  const { user } = useContext(AuthContext);
  const displayName = user?.username || user?.name || "User";

  console.log(currentSession)

  useEffect(() => {
    if (currentSession) {
      navigate(`/user/ai-assistant/${currentSession.id}`);
    } else {
      navigate(`/user/ai-assistant`);
    }
  }, [currentSession, navigate]);

  useEffect(() => {
    setLocalMessages(messages);
    scrollToBottom();
  }, [messages]);

  // Scroll to the bottom of the chat container
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollIntoView({ behaviour: "smooth" });
    }
  };

  // Handle sending a message
  const handleSendMessage = async (message) => {
    setIsSending(true);
    let sessionId = currentSession?.id;

    // If no session exists, create a new one
    if (!sessionId) {
      try {
        const newSession = await startChatSession();
        sessionId = newSession.id;
        setCurrentSession(newSession);
        await fetchAllSessions();
      } catch (error) {
        toast.error("Failed to start a new session. Please try again.");
        setIsSending(false);
        return;
      }
    }

    // Add the user's message to local messages
    setLocalMessages((prevMessages) => [
      ...prevMessages,
      { senderId: "user", message },
    ]);

    // Scroll to the bottom after adding the message
    scrollToBottom();

    // Send the message using the session ID
    if (sessionId) {
      try {
        await askAI(sessionId, message);
      } catch (error) {
        toast.error("Failed to send the message. Please try again.");
      } finally {
        setIsSending(false);
      }
    }
  };

  // Handle starting a new session
  const handleStartNewSession = () => {
    setCurrentSession(null);
    setLocalMessages([])
    navigate(`/user/ai-assistant`);
  };

  // Handle renaming a session
  const handleRenameSession = async () => {
    const newName = prompt("Enter a new name for this session:");
    if (newName && currentSession) {
      try {
        await renameChatSession(currentSession?.id, newName);
        toast.success("Session renamed successfully!");
      } catch (error) {
        toast.error("Failed to rename the session. Please try again.");
      }
    }
  };

  // Handle deleting a session
  const handleDeleteSession = async () => {
    if (currentSession) {
      try {
        await clearChatSession(currentSession?.id);
        setCurrentSession(null);
        toast.success("Session deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete the session. Please try again.");
      }
    }
  };

  // Handle switching to a different session
  const handleSwitchSession = async (sessionId) => {
    try {
      await fetchSingleSession(sessionId);
    } catch (error) {
      toast.error("Failed to fetch the session. Please try again.");
    }
  };

  return (
    <DashboardLayout>
      {/* Ai chat box to send message */}
      <AiChatInput onSendMessage={handleSendMessage} />

      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-x-2">
          {/* Button to create a new session/chat */}
          <Button
            className="text-3xl rounded-2xl outline-none border-none px-0"
            size="icon"
            onClick={handleStartNewSession}
          >
            <BiPlus />
          </Button>

          <DropdownMenu>
            {/* Current chat session */}
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                {currentSession ? `${currentSession?.title}` : "New Chat"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuGroup>
                {/* Other chat sessions */}
                {sessions?.filter(session => session.id !== currentSession?.id).map((session) => (
                  <DropdownMenuItem
                    key={session.id}
                    onClick={() => handleSwitchSession(session.id)}
                  >
                    {session.title || `Session ${session.id}`}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex gap-3 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                className="rounded-2xl bg-[#F6F6F6] text-black hover:text-white"
              >
                <TbDots />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={handleRenameSession}>
                  Rename
                  <DropdownMenuShortcut>
                    <BiEdit />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={handleDeleteSession}>
                  Delete Conversation
                  <DropdownMenuShortcut>
                    <MdDelete />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Share chat session button */}
          <Button className="rounded-2xl bg-[#F6F6F6] text-black hover:text-white">
            <PiShare /> Share
          </Button>
        </div>
      </div>

      <div className="w-full flex flex-col mt-3 items-center h-[65vh] overflow-auto">
        {/* New session display */}
        {(!currentSession && localMessages?.length < 1) && (
          <h2 className="text-3xl mt-52">Hello, {displayName}.</h2>
        )}

        {/* Chat messages display */}
        {currentSession && (
          <div className="w-full max-w-4xl h-full overflow-auto">
            {localMessages?.map((msg, index) => (
              <div
                key={index}
                className={`flex my-10 ${msg.senderId === "aichatId" ? "justify-start" : "justify-end"
                  }`}
              >
                <div
                  className={`p-4 rounded-lg max-w-[90%] ${msg.senderId === "aichatId"
                    ? "bg-gray-200 text-black"
                    : "bg-blue-500 text-white"
                    }`}
                >
                  {msg.message}
                </div>
              </div>
            ))}
            {/* Loading animation */}
            {isSending && (
              <div className="flex justify-start">
                <div className="px-4 py-1 rounded-lg bg-gray-200 text-black">
                  <div className="typing-animation">...</div>
                </div>
              </div>
            )}
            {/* Reference element to scroll into view */}
            <div ref={chatContainerRef} />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default AiAssistant;