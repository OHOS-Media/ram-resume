import { useState, useEffect } from "react";
import { IconUpload, IconFile, IconX, IconDownload } from "@tabler/icons-react";
import Button from "@/components/ui/Button";
import FileUpload from "@/components/ui/FileUpload";
import { useApi } from "@/hooks/useApi";

export default function ResumeModal({ active, setActive, onResumeUpdate }) {
  const [showUpload, setShowUpload] = useState(false);
  const [resume, setResume] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const api = useApi();

  const fetchResume = async () => {
    try {
      const response = await api.request("/api/files");
      setResume(response[0]);
    } catch (error) {
      console.error("Error fetching resume:", error);
    }
  };

  const fetchPdf = async () => {
    if (!resume) return;
    try {
      const blob = await api.request("/api/files/download", {
        responseType: "blob",
      });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      console.error("Error fetching PDF:", error);
    }
  };

  useEffect(() => {
    fetchResume();
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, []);

  useEffect(() => {
    if (resume) fetchPdf();
  }, [resume]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleDownload = async () => {
    try {
      const response = await api.request("/api/files/download", {
        responseType: "blob",
      });
      const url = URL.createObjectURL(response);
      const a = document.createElement("a");
      a.href = url;
      a.download = resume?.filename || "resume.pdf";
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleUploadSuccess = () => {
    setShowUpload(false);
    fetchResume();
    if (onResumeUpdate) {
      onResumeUpdate();
    }
  };

  return (
    <div className="fixed inset-0 bg-fordham-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-fordham-brown rounded-[16px] p-6 w-full max-w-3xl h-fit relative">
        <button
          onClick={() => setActive(false)}
          className="absolute top-6 right-6 text-fordham-white/80 hover:text-fordham-white"
        >
          <IconX className="w-6 h-6" />
        </button>

        <h2 className="text-fordham-white text-2xl font-medium mb-6">Resume</h2>

        {showUpload ? (
          <div className="flex flex-col justify-center items-center h-fit">
            <FileUpload onSuccess={handleUploadSuccess} />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {resume && (
              <div className="bg-fordham-white/10 rounded-[16px] p-6">
                <div className="flex items-center gap-4">
                  <IconFile className="w-8 h-8 text-fordham-white" />
                  <div className="flex-1">
                    <h3 className="text-fordham-white font-medium">{resume.filename}</h3>
                    <p className="text-fordham-white/60 text-sm">
                      {formatFileSize(resume.size)} • Uploaded {formatDate(resume.uploadDate)}
                    </p>
                  </div>
                  <button
                    onClick={handleDownload}
                    className="p-2 hover:bg-fordham-white/10 rounded-lg"
                  >
                    <IconDownload className="w-6 h-6 text-fordham-white" />
                  </button>
                </div>
              </div>
            )}

            <div className="flex-1 rounded-[16px] h-fit overflow-hidden gap-6 flex flex-col">
              {pdfUrl ? (
                <iframe src={pdfUrl} className="w-full h-[50vh]" title="Resume Preview" />
              ) : (
                <div className="flex items-center justify-center h-fit py-20 text-fordham-white/60">
                  No resume uploaded
                </div>
              )}
            </div>
            <Button
              variant="secondary"
              icon={<IconUpload />}
              text="Upload New Resume"
              onClick={() => setShowUpload(true)}
              className="w-full"
            />
          </div>
        )}
      </div>
    </div>
  );
}
