import { ArrowUp } from "lucide-react";
import React, { useState, useRef } from "react";
import { BiMicrophone, BiMicrophoneOff } from "react-icons/bi";
import { MdFileUpload } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function AiChatInput({ onSendMessage }) {
  const [prompt, setPrompt] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  
  const initPrompt = useLocation()?.state;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const modifiedPrompt = prompt.trim();
    if (!modifiedPrompt) return;
    
    console.log(modifiedPrompt);
    await onSendMessage(modifiedPrompt); // Call the onSendMessage prop with the prompt
    setPrompt(""); // Clear the input after sending

    navigate("/user/ai-assistant", { state: { modifiedPrompt } });
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await processVoiceInput(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.info("Recording started...");
    } catch (error) {
      toast.error("Failed to access microphone. Please check permissions.");
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.info("Processing your voice...");

      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
  };

  const processVoiceInput = async (audioBlob) => {
    try {
      // Simply pass the audio blob to the same handler
      await onSendMessage(audioBlob, 'audio');
      toast.success("Voice message sent!");
    } catch (error) {
      toast.error("Failed to process voice recording.");
      console.error("Error processing voice:", error);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    try {
      // Pass the file directly to the same handler
      await onSendMessage(selectedFile, 'document');
      
      // Update UI and close dialog
      toast.success("Document uploaded successfully!");
      setUploadDialogOpen(false);
      setSelectedFile(null);
      setUploadProgress(0);
    } catch (error) {
      toast.error("Failed to upload document.");
      console.error("Error uploading document:", error);
    }
  };

  return (
    <>
      <div className="left-2 md:left-64 right-0 fixed bottom-3 md:bottom-7 z-50 flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="px-4 py-3 rounded-[100px] shadow-md flex items-center gap-2 justify-center w-[700px] bg-white"
        >
          <div className="w-full flex items-center pr-2 bg-[#F6F6F6] border border-gray-600 rounded-3xl">
            <input
              type="text"
              onChange={(e) => setPrompt(e.target.value)}
              value={prompt}
              placeholder="Ask AI Anything..."
              className="w-full h-full px-4 py-3 rounded-3xl bg-[#F6F6F6] focus:outline-none text-sm"
            />
            <Button
              type="button"
              size="icon"
              className="rounded-2xl bg-[#F6F6F6] text-black hover:text-white"
              onClick={() => setUploadDialogOpen(true)}
            >
              <MdFileUpload />
            </Button>
            <Button
              type="button"
              size="icon"
              className={`rounded-2xl ${
                isRecording
                  ? "bg-red-500 text-white"
                  : "bg-[#F6F6F6] text-black hover:text-white"
              }`}
              onClick={isRecording ? stopRecording : startRecording}
            >
              {isRecording ? <BiMicrophoneOff /> : <BiMicrophone />}
            </Button>
          </div>
          <button 
            type="submit" 
            className="bg-black text-white rounded-full p-1"
            disabled={!prompt.trim()}
          >
            <ArrowUp />
          </button>
        </form>
      </div>

      {/* File Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload a document to process with AI assistant
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {selectedFile && (
              <div className="text-sm text-gray-500">
                Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
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
              <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleFileUpload} disabled={!selectedFile}>
                Upload
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}