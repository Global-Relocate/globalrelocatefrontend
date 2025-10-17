import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useCountryAIChat } from "@/context/CountryAIChatContext";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function CountriesAIAssistant({ countryName, countrySlug }) {
  const {
    sessions,
    currentSession,
    setCurrentSession,
    fetchAllSessions,
    messages,
    startChatSession,
    askAI,
    clearChatSession,
    renameChatSession,
    fetchSingleSession,
  } = useCountryAIChat();
  const { t } = useTranslation();

  const chatContainerRef = useRef(null);

  const [isSending, setIsSending] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [localMessages, setLocalMessages] = useState([]);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Auto-load existing sessions on mount
  useEffect(() => {
    const initSession = async () => {
      try {
        const allSessions = await fetchAllSessions();

        if (allSessions?.length > 0 && !currentSession) {
          const session = allSessions[0];
          setCurrentSession(session);
          await fetchSingleSession(session.id);
        }
      } catch (e) {
        console.error("Failed to fetch sessions:", e);
      }
    };

    // only run if no session is currently loaded
    if (!currentSession) {
      initSession();
    }
  }, [countrySlug]);

  // Sync local messages with context messages
  useEffect(() => {
    setLocalMessages(messages);
    scrollToBottom();
  }, [messages]);

  // Scroll listener to toggle “scroll to bottom” button
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 20);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const modifiedPrompt = prompt.trim();
    if (!modifiedPrompt) return;
    setPrompt("");
    await handleSendMessage(modifiedPrompt);
  };

  const handleSendMessage = async (content) => {
    setIsSending(true);
    let sessionId = currentSession?.id;

    if (!sessionId) {
      try {
        const newSession = await startChatSession();
        sessionId = newSession.id;
        setCurrentSession(newSession);
        await fetchAllSessions();
      } catch (e) {
        toast.error(t("toast.newSessionFailed"));
        setIsSending(false);
        return;
      }
    }

    setLocalMessages((prevMessages) => [
      ...prevMessages,
      { senderId: "user", message: content },
    ]);

    scrollToBottom();

    try {
      await askAI(sessionId, content);
    } catch (e) {
      toast.error("Failed to process input. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleStartNewSession = () => {
    setCurrentSession(null);
    setLocalMessages([]);
  };

  const handleRenameSession = async () => {
    const userInput = window.prompt(t("toast.enterSessionName"))?.trim();
    if (!userInput || !currentSession) return;

    const newName = userInput.replace(/[^a-zA-Z0-9\s]/g, "");
    if (!newName) return;

    try {
      await renameChatSession(currentSession.id, newName);
      setCurrentSession({ ...currentSession, title: newName });
      toast.success(t("toast.sessionRenameSuccess"));
    } catch {
      toast.error(t("toast.sessionRenameFailed"));
    }
  };

  const handleDeleteSession = async () => {
    if (!currentSession) return;
    try {
      await clearChatSession(currentSession.id);
      setCurrentSession(null);
      setLocalMessages([]);
      toast.success(t("toast.sessionDeleteSuccess"));
    } catch {
      toast.error(t("toast.sessionDeleteFailed"));
    }
  };

  const handleSwitchSession = async (sessionId) => {
    try {
      const selectedSession = sessions.find((s) => s.id === sessionId);
      setCurrentSession(selectedSession); // set it first
      await fetchSingleSession(sessionId); // then fetch its data
    } catch {
      toast.error(t("toast.newSessionFailed"));
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] overflow-hidden">
      {/* Session management */}
      <div className="flex w-full items-center justify-between mt-6 px-4">
        <div className="flex items-center gap-x-2">
          <Button
            className="rounded-[12px] bg-black text-white"
            size="icon"
            onClick={handleStartNewSession}
          >
            <i className="fas fa-plus" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                {currentSession
                  ? currentSession.title
                  : t("userDashboard.ai.newChat")}
                <i className="fas fa-chevron-down text-black ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuGroup>
                {sessions
                  ?.filter((s) => s.id !== currentSession?.id)
                  .map((session) => (
                    <DropdownMenuItem
                      className="cursor-pointer"
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
              <Button variant="outline" size="icon" className="rounded-[12px]">
                <i className="fas fa-ellipsis-h" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={handleRenameSession}
                  className="cursor-pointer"
                >
                  {t("userDashboard.ai.rename")}
                  <DropdownMenuShortcut>
                    <i className="fas fa-edit" />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDeleteSession}
                  className="cursor-pointer"
                >
                  {t("userDashboard.ai.deleteConversation")}
                  <DropdownMenuShortcut>
                    <i className="fas fa-trash" />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Chat area */}
      <div
        className="flex-grow overflow-auto md:px-4 px-2 mt-4"
        ref={chatContainerRef}
      >
        {!currentSession && localMessages?.length < 1 ? (
          <div className="text-center my-24 flex items-center justify-center gap-3">
            <div className="flex flex-col items-center gap-y-6">
              <span className="text-4xl">👋</span>
              <h2 className="text-xl md:text-3xl ml-3 -mt-1">
                {t("userDashboard.ai.hiThere")},{" "}
                {t("userDashboard.ai.howCanIHelp")}
              </h2>
            </div>
          </div>
        ) : (
          <div className="w-full md:max-w-5xl mx-auto md:px-4">
            {localMessages?.map((msg, index) => (
              <div key={index} className="w-full my-3">
                <div
                  className={`flex ${
                    msg.senderId === "aichatId"
                      ? "justify-start"
                      : "justify-end"
                  }`}
                >
                  <div
                    className={`py-2 px-3 ${
                      msg.senderId === "aichatId"
                        ? "text-black w-full space-y-4"
                        : "bg-blue-500 text-white max-w-[85%] rounded-2xl"
                    }`}
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.message}
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
          </div>
        )}
      </div>

      {/* Input area (sticky bottom) */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 px-2 py-3 z-1">
        <div className="flex justify-center items-center gap-2">
          {!isAtBottom && (
            <Button
              variant="outline"
              className="hidden md:inline-flex rounded-full"
              onClick={scrollToBottom}
            >
              <i className="fas fa-arrow-down" />
            </Button>
          )}
          <form
            onSubmit={handleSubmit}
            className="px-2 py-2 rounded-[100px] border border-[#E9E9E9] flex items-center gap-2 justify-center w-full max-w-[640px] bg-white"
          >
            <div className="w-full flex items-center gap-x-3 pr-2 rounded-3xl">
              <input
                type="text"
                onChange={(e) => setPrompt(e.target.value)}
                value={prompt}
                placeholder={t("userDashboard.ai.askAICountry", {
                  country: countryName,
                })}
                className="w-full h-full px-4 py-3 rounded-3xl bg-[#F6F6F6] border border-[#D4D4D4] focus:outline-none text-sm"
              />
              <Button
                type="submit"
                variant="icon"
                className={`rounded-full p-3 transition-colors ${
                  prompt.trim()
                    ? "bg-black text-white cursor-pointer"
                    : "bg-gray-600 text-white cursor-not-allowed"
                }`}
                disabled={!prompt.trim()}
              >
                <i className="fas fa-send" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
