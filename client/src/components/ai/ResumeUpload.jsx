import { useRef, useState } from "react";
import {
    FaCloudUploadAlt,
    FaFilePdf,
    FaRobot
} from "react-icons/fa";

import { analyzeResume } from "../../services/aiService";
import "./ResumeUpload.css";

function ResumeUpload({ onAnalysisComplete }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const fileInputRef = useRef(null);

    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    const handleFileChange = (e) => {
        setError("");

        const file = e.target.files[0];

        if (!file) {
            setSelectedFile(null);
            return;
        }

        // Validate PDF
        if (file.type !== "application/pdf") {
            setError("Please upload a PDF resume.");
            setSelectedFile(null);
            return;
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            setError("Resume size should not exceed 5 MB.");
            setSelectedFile(null);
            return;
        }

        setSelectedFile(file);
    };

    const openFilePicker = () => {
        fileInputRef.current.click();
    };

    const handleAnalyze = async () => {
        if (!selectedFile) {
            setError("Please select a PDF resume.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const formData = new FormData();
            formData.append("resume", selectedFile);

            const result = await analyzeResume(formData);

            onAnalysisComplete(result.analysis);

        } catch (error) {
            console.error(error);

            const originalMessage = error.response?.data?.message || "";
            const message = originalMessage.toLowerCase();

            if (
                message.includes("resource_exhausted") ||
                message.includes("quota") ||
                error.response?.status === 429
            ) {
                setError(
                    "⚠ AI Service Temporarily Unavailable. Please try again later."
                );
            } else {
                setError(
                    originalMessage || "Failed to analyze resume. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="resume-upload-card">

            <h3>Upload Your Resume</h3>

            <p>
                Analyze your resume using AI to receive
                ATS score, role matching and improvement suggestions.
            </p>

            <div
                className="upload-box"
                onClick={openFilePicker}
            >
                <FaCloudUploadAlt className="upload-icon" />

                <div className="upload-title">                
                    Drag & Drop your resume here
                </div>

                <div className="upload-subtitle">
                    or click to browse • PDF Only • Max 5 MB
                </div>                

                <input
                    ref={fileInputRef}
                    className="hidden-input"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                />

            </div>

            {selectedFile && (
                <div className="file-info">

                    <FaFilePdf
                        style={{
                            marginRight: "10px",
                            fontSize: "1.4rem"
                        }}
                    />

                    <div>
                        <div>
                            {selectedFile.name}
                        </div>

                        <small>
                            Ready to analyze
                        </small>
                    </div>

                </div>
            )}

            {error && (
                <p className="upload-error">
                    {error}
                </p>
            )}

            <button
                className="analyze-btn"
                onClick={handleAnalyze}
                disabled={loading || !selectedFile}
            >
                <>
                    <FaRobot
                        style={{
                            marginRight: "8px",
                        }}
                    />

                    {loading ? "Analyzing..." : "Analyze with AI"}
                </>
            </button>

        </div>
    );
}

export default ResumeUpload;