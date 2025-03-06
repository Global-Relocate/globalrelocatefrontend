import axiosInstance from "@/config/axiosInstance";
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

const AiChatContext = createContext();

export const AiChatProvider = ({ children }) => {
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  // Fetch all sessions
  const fetchAllSessions = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/ai/session");
      const aisessions = response?.data?.data;
      if (aisessions) {
        setSessions(response.data.data);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    } finally {
      setLoading(false);
    }
  };

  // Start a new chat session
  const startChatSession = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/ai/start");
      setCurrentSession(response.data.session_id);
      setMessages([]); // Clear messages for the new session
      toast.success("New chat session started!");
      return response.data; // Return the new session data
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Send a message to the AI and handle the event stream
  const askAI = async (sessionId, message) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        `/ai/${sessionId}`,
        { message },
        {
          responseType: "stream", // Enable streaming
        }
      );

      let fullResponse = "";

      // Process the event stream
      response.data.on("data", (chunk) => {
        const chunkStr = chunk.toString();
        const lines = chunkStr.split("\n");

        lines.forEach((line) => {
          if (line.startsWith("data: ")) {
            const data = JSON.parse(line.slice(6)); // Remove "data: " prefix
            fullResponse += data.text; // Concatenate the text
            updateMessage(sessionId, fullResponse); // Update the UI
          }
        });
      });

      response.data.on("end", () => {
        // Mark the message as complete
        updateMessage(sessionId, fullResponse, true);
      });

      response.data.on("error", (error) => {
        throw new Error("Failed to process the event stream.");
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    } finally {
      setLoading(false);
    }
  };

  // Update messages incrementally
  const updateMessage = (sessionId, text, isComplete = false) => {
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages];
      const messageIndex = updatedMessages.findIndex(
        (msg) => msg.sessionId === sessionId && !msg.isComplete
      );

      if (messageIndex === -1) {
        // Add a new message
        updatedMessages.push({
          sessionId,
          sender: "ai",
          text,
          isComplete,
        });
      } else {
        // Update the existing message
        updatedMessages[messageIndex].text = text;
        updatedMessages[messageIndex].isComplete = isComplete;
      }

      return updatedMessages;
    });
  };

  // Clear a chat session
  const clearChatSession = async (sessionId) => {
    setLoading(true);
    try {
      await axiosInstance.delete(`/ai/${sessionId}`);
      if (currentSession === sessionId) {
        setCurrentSession(null);
        setMessages([]);
      }
      toast.success("Chat session cleared!");
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    } finally {
      setLoading(false);
    }
  };

  // Rename a chat session
  const renameChatSession = async (sessionId, newName) => {
    setLoading(true);
    try {
      await axiosInstance.put(`/ai/${sessionId}`, { name: newName });
      toast.success("Chat session renamed!");
      fetchAllSessions(); // Refresh the list of sessions
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch a single session by ID
  const fetchSingleSession = async (sessionId) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/ai/session/${sessionId}`);
      setCurrentSession(sessionId);
      setMessages(response.data.messages || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all sessions on component mount
  useEffect(() => {
    fetchAllSessions();
  }, []);

  return (
    <AiChatContext.Provider
      value={{
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
        updateMessage,
      }}
    >
      {children}
    </AiChatContext.Provider>
  );
};

export const useAIChat = () => useContext(AiChatContext);