import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";

import AiChatInput from "@/components/forms/AiChatInput";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { BiEdit, BiPlus } from "react-icons/bi";
import { PiShare } from "react-icons/pi";
import { TbDots } from "react-icons/tb";
import { MdDelete } from "react-icons/md";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAIChat } from "@/context/AiChatContext";
import { AuthContext } from "@/context/AuthContext";
import { toast } from "sonner";

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
  const chatContainerRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const displayName = user?.username || user?.name || "User";

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

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSendMessage = async (message) => {
    setIsSending(true);
    let sessionId = currentSession?.id;

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

    setLocalMessages((prevMessages) => [
      ...prevMessages,
      { senderId: "user", message },
    ]);

    scrollToBottom();

    try {
      await askAI(sessionId, message);
    } catch (error) {
      toast.error("Failed to send the message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleStartNewSession = () => {
    setCurrentSession(null);
    setLocalMessages([]);
    navigate(`/user/ai-assistant`);
  };

  const handleRenameSession = async () => {
    const newName = prompt("Enter a new name for this session:");
    if (newName && currentSession) {
      try {
        await renameChatSession(currentSession.id, newName);

        setCurrentSession({ ...currentSession, title: newName });
        toast.success("Session renamed successfully!");
      } catch (error) {
        toast.error("Failed to rename the session. Please try again.");
      }
    }
  };

  const handleDeleteSession = async () => {
    if (currentSession) {
      try {
        await clearChatSession(currentSession.id);
        setCurrentSession(null);
        toast.success("Session deleted successfully!");
      } catch {
        toast.error("Failed to delete the session. Please try again.");
      }
    }
  };

  const handleSwitchSession = async (sessionId) => {
    try {
      await fetchSingleSession(sessionId);
    } catch {
      toast.error("Failed to fetch the session. Please try again.");
    }
  };

  const handleShareSession = () => {
    if (!currentSession) {
      toast.error("You need an active session to share");
      return;
    }

    const shareableLink = `${window.location.origin}/shared-chat/${currentSession.id}`;

    navigator.clipboard
      .writeText(shareableLink)
      .then(() => toast.success("Link copied to clipboard!"))
      .catch(() => toast.error("Failed to copy link"));
  };

  return (
    <DashboardLayout>
      <AiChatInput onSendMessage={handleSendMessage} />

      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-x-2">
          <Button
            className="text-3xl rounded-2xl outline-none border-none px-0"
            size="icon"
            onClick={handleStartNewSession}
          >
            <BiPlus />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                {currentSession ? currentSession.title : "New Chat"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuGroup>
                {sessions
                  ?.filter((s) => s.id !== currentSession?.id)
                  .map((session) => (
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

          <Button className="rounded-2xl bg-[#F6F6F6] text-black hover:text-white" onClick={handleShareSession}>
            <PiShare /> Share
          </Button>
        </div>
      </div>

      <div className="w-full flex flex-col mt-3 items-center h-[65vh] overflow-auto">
        {!currentSession && localMessages?.length < 1 && (
          <h2 className="text-3xl mt-52">Hello, {displayName}.</h2>
        )}

        {currentSession && (
          <div className="w-full max-w-4xl h-full overflow-auto">
            {localMessages?.map((msg, index) => (
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
            ))}

            {isSending && (
              <div className="flex justify-start">
                <div className="px-4 py-1 rounded-lg bg-gray-200 text-black">
                  <div className="typing-animation">...</div>
                </div>
              </div>
            )}

            <div ref={chatContainerRef} />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default AiAssistant;
