import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import AiChatInput from "@/components/forms/AiChatInput";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { BiEdit } from "react-icons/bi";
import { PiShareFat } from "react-icons/pi";
import { TbDots } from "react-icons/tb";
import { MdDelete, MdAdd } from "react-icons/md";
import { IoChevronDownOutline } from "react-icons/io5";

import aiActiveIcon from "../../assets/svg/ai-assistant.svg";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAIChat } from "@/context/AiChatContext";
import { AuthContext } from "@/context/AuthContextExport";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";

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
  const { t } = useTranslation();
  const { selectedLanguage } = useLanguage();
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

  const handleSendMessage = async (content, type = "text") => {
    setIsSending(true);
    let sessionId = currentSession?.id;

    if (!sessionId) {
      try {
        const newSession = await startChatSession();
        sessionId = newSession.id;
        setCurrentSession(newSession);
        await fetchAllSessions();
      } catch (error) {
        toast.error(t("toast.newSessionFailed"));
        setIsSending(false);
        return;
      }
    }

    if (type === "text") {
      setLocalMessages((prevMessages) => [
        ...prevMessages,
        { senderId: "user", message: content },
      ]);
    } else if (type === "image") {
      setLocalMessages((prevMessages) => [
        ...prevMessages,
        { senderId: "user", message: `🖼️ Image: ${content.name}` },
      ]);
    } else if (type === "audio") {
      setLocalMessages((prevMessages) => [
        ...prevMessages,
        { senderId: "user", message: "🎤 Voice message" },
      ]);
    } else if (type === "document") {
      setLocalMessages((prevMessages) => [
        ...prevMessages,
        { senderId: "user", message: `📄 Document: ${content.name}` },
      ]);
    }

    scrollToBottom();

    try {
      if (type === "text") {
        await askAI(sessionId, content, "text");
      } else {
        const formData = new FormData();
        formData.append("type", type);
        formData.append("language", selectedLanguage.name);
        if (type === "audio") formData.append("audio", content);
        if (type === "document") formData.append("document", content);
        await askAI(sessionId, formData, type);
      }
    } catch (error) {
      toast.error(`Failed to process ${type} input. Please try again.`);
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
    const userInput = prompt(t("toast.enterSessionName")).trim();
    const newName = userInput.replace(/[^a-zA-Z0-9\s]/g, "");
    if (newName && currentSession) {
      try {
        await renameChatSession(currentSession.id, newName);

        setCurrentSession({ ...currentSession, title: newName });
        toast.success(t("toast.sessionRenameSuccess"));
      } catch (e) {
        toast.error(t("toast.sessionRenameFailed"));
      }
    }
  };

  const handleDeleteSession = async () => {
    if (currentSession) {
      try {
        await clearChatSession(currentSession.id);
        setCurrentSession(null);
        toast.success(t("toast.sessionDeleteSuccess"));
      } catch {
        toast.error(t("toast.sessionDeleteFailed"));
      }
    }
  };

  const handleSwitchSession = async (sessionId) => {
    try {
      await fetchSingleSession(sessionId);
    } catch {
      toast.error(t("toast.newSessionFailed"));
    }
  };

  const handleShareSession = () => {
    if (!currentSession) {
      toast.error(t("toast.activeSessionShare"));
      return;
    }

    const shareableLink = `${window.location.origin}/shared-chat/${currentSession.id}`;

    navigator.clipboard
      .writeText(shareableLink)
      .then(() => toast.success(t("toast.linkCopied")))
      .catch(() => toast.error(t("toast.linkCopyFailed")));
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-160px)]">
        {/* <div className="h-[72px] mb-12"> */}
        <AiChatInput onSendMessage={handleSendMessage} />
        {/* </div> */}

        <div className="flex w-full items-center justify-between mb-4">
          <div className="flex items-center gap-x-2">
            <Button
              className="rounded-[12px] bg-black text-white"
              size="icon"
              onClick={handleStartNewSession}
            >
              <MdAdd size={32} />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1">
                  {currentSession
                    ? currentSession.title
                    : t("userDashboard.ai.newChat")}
                  <IoChevronDownOutline className="text-black" size={16} />
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
                  className="rounded-[12px] bg-[#F6F6F6] text-black hover:text-black hover:bg-[#F6F6F6] shadow-none"
                >
                  <TbDots />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={handleRenameSession}>
                    {t("userDashboard.ai.rename")}
                    <DropdownMenuShortcut>
                      <BiEdit />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDeleteSession}>
                    {t("userDashboard.ai.deleteConversation")}
                    <DropdownMenuShortcut>
                      <MdDelete />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              className="rounded-[12px] bg-[#F6F6F6] text-black hover:text-black hover:bg-[#F6F6F6] flex items-center gap-2 shadow-none"
              onClick={handleShareSession}
            >
              <PiShareFat /> {t("userDashboard.ai.share")}
            </Button>
          </div>
        </div>

        <div className="flex-grow overflow-auto px-4 pb-36 mb-16">
          {!currentSession && localMessages?.length < 1 && (
            <div className="text-center mt-32 flex items-center justify-center gap-3">
              <div className="flex items-center">
                <img
                  src={aiActiveIcon}
                  alt="AI Assistant"
                  className="w-8 h-8"
                />
                <h2
                  className="text-3xl ml-3"
                  style={{ position: "relative", top: "-2px" }}
                >
                  {t("userDashboard.ai.hello")}, {displayName}.
                </h2>
              </div>
            </div>
          )}

          {currentSession && (
            <div className="w-full max-w-3xl mx-auto px-2 md:px-4">
              {localMessages?.map((msg, index) => (
                <div className="w-full" key={index}>
                  {msg.type === "image" && msg.fileUrl.length > 0 && (
                    <div className="">
                      <img
                        key={index}
                        src={msg.fileUrl}
                        alt="User uploaded"
                        className="max-w-full rounded-lg my-2"
                      />
                    </div>
                  )}
                  <div
                    key={index}
                    className={`flex my-3 ${
                      msg.senderId === "aichatId"
                        ? "justify-start"
                        : "justify-end"
                    }`}
                  >
                    <div
                      className={`py-2 px-3 rounded-2xl max-w-[85%] ${
                        msg.senderId === "aichatId"
                          ? "bg-[#EEEFF8] text-black"
                          : "bg-blue-500 text-white"
                      }`}
                    >
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.type === "text"
                          ? msg.message
                          : msg.type === "audio"
                          ? "🎤 Voice message"
                          : msg.type === "document"
                          ? `📄 Document: ${msg.message}`
                          : msg.type === "image"
                          ? "🖼️ Image"
                          : msg.message}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}

              {isSending && (
                <div className="flex justify-start my-3">
                  <div className="px-3 py-2 rounded-2xl bg-[#EEEFF8] text-black">
                    <div className="typing-animation">...</div>
                  </div>
                </div>
              )}

              <div ref={chatContainerRef} className="h-2" />
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AiAssistant;
