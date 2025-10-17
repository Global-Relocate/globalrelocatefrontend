import axiosInstance from "@/config/axiosInstance";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "./LanguageContext";

const CountryAiChatContext = createContext();

export const CountryAiChatProvider = ({ children, countrySlug }) => {
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const { selectedLanguage } = useLanguage();

  // Fetch all sessions
  const fetchAllSessions = async () => {
    if (!countrySlug) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/countries/${countrySlug}/ai-assistant/sessions`
      );
      setSessions(response.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    } finally {
      setLoading(false);
    }
  };

  // Start new chat
  const startChatSession = async () => {
    if (!countrySlug) return;
    setLoading(true);
    try {
      const { data } = await axiosInstance.post(
        `/countries/${countrySlug}/ai-assistant/start`
      );
      const newSession = { id: data.data.sessionId, title: data.data.title };
      setCurrentSession(newSession);
      setMessages([]);
      toast.success("New chat session started!");
      return newSession;
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Ask AI
  const askAI = async (sessionId, content) => {
    if (!countrySlug || !sessionId) return;
    setLoading(true);
    try {
      if (content) {
        await axiosInstance.post(
          `/countries/${countrySlug}/ai-assistant/${sessionId}`,
          { message: content, language: selectedLanguage.name }
        );
      }
      await fetchSingleSession(sessionId);
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch single session
  const fetchSingleSession = async (sessionId) => {
    if (!countrySlug || !sessionId) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/countries/${countrySlug}/ai-assistant/sessions/${sessionId}`
      );
      const { id, title } = response.data.data;
      setCurrentSession({ id, title });
      setMessages(response.data.data.messages || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    } finally {
      setLoading(false);
    }
  };

  // Clear chat
  const clearChatSession = async (sessionId) => {
    if (!countrySlug || !sessionId) return;
    setLoading(true);
    try {
      await axiosInstance.delete(
        `/countries/${countrySlug}/ai-assistant/sessions/${sessionId}`
      );
      if (currentSession?.id === sessionId) {
        setCurrentSession(null);
        setMessages([]);
      }
      await fetchAllSessions();
      toast.success("Chat session cleared!");
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    } finally {
      setLoading(false);
    }
  };

  // Rename chat
  const renameChatSession = async (sessionId, newName) => {
    if (!countrySlug || !sessionId) return;
    setLoading(true);
    try {
      await axiosInstance.put(
        `/countries/${countrySlug}/ai-assistant/sessions/${sessionId}`,
        { title: newName }
      );
      toast.success("Chat session renamed!");
      await fetchAllSessions();
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch sessions on load
  useEffect(() => {
    if (countrySlug) fetchAllSessions();
  }, [countrySlug]);

  return (
    <CountryAiChatContext.Provider
      value={{
        sessions,
        currentSession,
        setCurrentSession,
        loading,
        messages,
        startChatSession,
        askAI,
        clearChatSession,
        renameChatSession,
        fetchSingleSession,
        fetchAllSessions,
      }}
    >
      {children}
    </CountryAiChatContext.Provider>
  );
};

export const useCountryAIChat = () => useContext(CountryAiChatContext);
