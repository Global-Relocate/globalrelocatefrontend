import AiChatInput from "@/components/forms/AiChatInput";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
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
import { useAIChat } from "@/context/AiChatContext"; // Import the AI Chat context
import { toast } from "sonner"; // For toast notifications

function AiAssistant() {
  const {
    sessions,
    currentSession,
    loading,
    messages,
    startChatSession,
    askAI,
    clearChatSession,
    renameChatSession,
    fetchSingleSession,
    fetchAllSessions,
  } = useAIChat();

  const [displayedMessages, setDisplayedMessages] = useState([]); // For typing animation

  // Handle sending a message
  const handleSendMessage = async (message) => {
    let sessionId = currentSession;

    // If no session exists, create a new one
    if (!sessionId) {
      try {
        const newSession = await startChatSession();
        sessionId = newSession.session_id; // Use the new session ID
      } catch (error) {
        toast.error("Failed to start a new session. Please try again.");
        return; // Exit if session creation fails
      }
    }

    // Send the message using the session ID
    if (sessionId) {
      try {
        await askAI(sessionId, message);
      } catch (error) {
        toast.error("Failed to send the message. Please try again.");
      }
    }
  };

  // Handle starting a new session
  const handleStartNewSession = async () => {
    try {
      await startChatSession();
      toast.success("New chat session started!");
    } catch (error) {
      toast.error("Failed to start a new session. Please try again.");
    }
  };

  // Handle renaming a session
  const handleRenameSession = async () => {
    const newName = prompt("Enter a new name for this session:");
    if (newName && currentSession) {
      try {
        await renameChatSession(currentSession, newName);
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
        await clearChatSession(currentSession);
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

  // Simulate typing animation
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && !lastMessage.isComplete) {
      const interval = setInterval(() => {
        setDisplayedMessages((prev) => {
          const updatedMessages = [...prev];
          const lastDisplayedMessage = updatedMessages[updatedMessages.length - 1];

          if (lastDisplayedMessage.text.length < lastMessage.text.length) {
            lastDisplayedMessage.text = lastMessage.text.slice(
              0,
              lastDisplayedMessage.text.length + 1
            );
          } else {
            clearInterval(interval);
          }

          return updatedMessages;
        });
      }, 50); // Adjust typing speed here

      return () => clearInterval(interval);
    } else {
      setDisplayedMessages(messages);
    }
  }, [messages]);

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
                {currentSession ? `${currentSession}` : "New Chat"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuGroup>
                {/* Other chat sessions */}
                {sessions?.map((session) => (
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

      <div className="w-full flex flex-col items-center h-[70vh]">
        {/* New session display */}
        {!currentSession && (
          <h2 className="text-3xl mt-52">Hello, Friend.</h2>
        )}

        {/* Chat messages display */}
        {currentSession && (
          <div className="w-full max-w-2xl mt-8 space-y-4">
            {displayedMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
              >
                <div
                  className={`p-4 rounded-lg ${msg.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                    }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default AiAssistant;