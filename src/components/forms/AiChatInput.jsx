import { ArrowUp } from "lucide-react";
import { useState, useRef } from "react";
import { BiMicrophone, BiMicrophoneOff } from "react-icons/bi";
import { MdAdd } from "react-icons/md";
import { IoStop } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function AiChatInput({ onSendMessage }) {
  const [prompt, setPrompt] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [filePreview, setFilePreview] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);

  const initPrompt = useLocation()?.state;
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Initialize speech recognition
  const initializeSpeechRecognition = () => {
    // Check if speech recognition is supported
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      // Handle result event
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        setPrompt(transcript);
      };

      // Handle errors
      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        stopSpeechToText();
      };

      return recognition;
    }
    return null;
  };

  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const modifiedPrompt = prompt.trim();
    if (!modifiedPrompt) return;

    await onSendMessage(modifiedPrompt);
    setPrompt("");

    if (location.pathname !== "/user/ai-assistant") {
      navigate("/user/ai-assistant", { state: { modifiedPrompt } });
    }
  };

  const startSpeechToText = async () => {
    try {
      // Initialize speech recognition if not already done
      if (!recognitionRef.current) {
        recognitionRef.current = initializeSpeechRecognition();
      }

      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsRecording(true);
        // Removed toast notifications
      } else {
        console.error("Speech recognition is not supported in your browser");
      }
    } catch (error) {
      console.error("Error starting speech recognition:", error);
    }
  };

  const stopSpeechToText = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      // Removed toast notifications
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }

    const url = URL.createObjectURL(file);
    setFilePreview(url);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    try {
      await onSendMessage(selectedFile, "document");

      toast.success("Document uploaded successfully!");
      setUploadDialogOpen(false);
      setSelectedFile(null);
      setUploadProgress(0);
      URL.revokeObjectURL(filePreview);
      setFilePreview(null);
    } catch (error) {
      toast.error("Failed to upload document.");
      console.error("Error uploading document:", error);
    }
  };

  const handleCancelFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setUploadDialogOpen(false);
  };

  // Toggle speech recognition
  const toggleSpeechRecognition = () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      startSpeechToText();
    }
  };

  return (
    <>
      <div className="left-2 md:left-64 right-0 fixed bottom-3 md:bottom-7 z-50 flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="px-4 py-3 rounded-[100px] border border-[#E9E9E9] flex items-center gap-2 justify-center w-[700px] bg-white"
        >
          <div className="w-full flex items-center pr-2 bg-[#F6F6F6] border border-[#D4D4D4] rounded-3xl">
            <input
              type="text"
              onChange={(e) => setPrompt(e.target.value)}
              value={prompt}
              placeholder={t("userDashboard.ai.askAI")}
              className="w-full h-full px-4 py-3 rounded-3xl bg-[#F6F6F6] focus:outline-none text-sm"
            />

            {/* File upload button (plus icon) - black color & larger size */}
            <button
              type="button"
              onClick={() => setUploadDialogOpen(true)}
              className="text-black hover:text-gray-700 p-1 transition-colors"
            >
              <MdAdd size={24} />
            </button>

            {/* Microphone button - black color */}
            {/* <button
              type="button"
              onClick={toggleSpeechRecognition}
              className={`p-1 transition-colors ${
                isRecording ? "text-red-500" : "text-black hover:text-gray-700"
              }`}
            >
              {isRecording ? (
                <BiMicrophoneOff size={20} />
              ) : (
                <BiMicrophone size={20} />
              )}
            </button> */}
          </div>

          {/* Send/Stop button with conditional background color and icon */}
          <button
            type={isRecording ? "button" : "submit"}
            onClick={isRecording ? stopSpeechToText : undefined}
            className={`rounded-full p-2 transition-colors ${
              isRecording || prompt.trim()
                ? "bg-black text-white"
                : "bg-gray-300 text-white cursor-not-allowed"
            }`}
            disabled={!isRecording && !prompt.trim() && !selectedFile}
          >
            {isRecording ? <IoStop size={20} /> : <ArrowUp size={20} />}
          </button>
        </form>
      </div>

      {/* File Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("userDashboard.ai.uploadDocument")}</DialogTitle>
            <DialogDescription>
              {t("userDashboard.ai.uploadDocumentDesc")}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            {selectedFile && (
              <div className="flex items-start gap-4">
                {selectedFile.type.startsWith("image/") && (
                  <img
                    src={filePreview}
                    alt="preview"
                    className="w-32 h-auto rounded-md"
                  />
                )}
                {selectedFile.type === "application/pdf" && (
                  <embed
                    src={filePreview}
                    type="application/pdf"
                    className="w-64 h-40 rounded-md border"
                  />
                )}
              </div>
            )}

            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              accept=".pdf,.doc,.docx,image/*"
            />
            {selectedFile && (
              <div className="text-sm text-gray-500">
                Selected: {selectedFile.name} (
                {(selectedFile.size / 1024).toFixed(2)} KB)
              </div>
            )}
            {uploadProgress > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => handleCancelFile()}>
                {t("userDashboard.ai.cancel")}
              </Button>
              <Button onClick={handleFileUpload} disabled={!selectedFile}>
                {t("userDashboard.ai.upload")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
