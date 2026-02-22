"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Upload,
  FileText,
  Loader2,
  ChevronDown,
  ChevronUp,
  Info,
} from "lucide-react";
import { useResumeStore } from "@/store/resume-store";
import type { ResumeData } from "@/lib/types/resume";
import { Notification } from "@/components/ui/notification";

export function ResumeUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const { setParsedResume } = useResumeStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      let response: Response;
      try {
        response = await fetch("/api/parse-resume", {
          method: "POST",
          body: formData,
        });
      } catch (fetchError: any) {
        console.error("Network error:", fetchError);
        throw new Error(
          fetchError.message?.includes("Failed to fetch") ||
            fetchError.message?.includes("NetworkError")
            ? "Connection error. Please check if the server is running and try again."
            : `Network error: ${fetchError.message || "Unable to connect to server"}`,
        );
      }

      let responseData: any;
      try {
        responseData = await response.json();
      } catch (jsonError) {
        console.error("JSON parse error:", jsonError);
        const text = await response.text();
        console.error("Response text:", text);
        throw new Error(
          "Invalid response from server. Please check the server console for errors.",
        );
      }

      if (!response.ok) {
        const errorMessage =
          responseData.error ||
          `Server error (${response.status}): ${response.statusText}`;
        console.error("Parse error:", errorMessage);
        throw new Error(errorMessage);
      }

      const { data, costInfo } = responseData;

      // Log cost information to browser console
      if (costInfo) {
        console.log(
          "%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          "color: #4CAF50; font-weight: bold; font-size: 12px;",
        );
        console.log(
          "%c📊 OpenAI API Usage & Cost",
          "color: #4CAF50; font-weight: bold; font-size: 14px;",
        );
        console.log(
          "%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          "color: #4CAF50; font-weight: bold; font-size: 12px;",
        );
        console.log(
          `%cModel: ${costInfo.model}`,
          "color: #2196F3; font-weight: bold;",
        );
        console.log(
          `%cInput Tokens:  ${costInfo.inputTokens.toLocaleString()}`,
          "color: #666;",
        );
        console.log(
          `%cOutput Tokens: ${costInfo.outputTokens.toLocaleString()}`,
          "color: #666;",
        );
        console.log(
          `%cTotal Tokens:  ${costInfo.totalTokens.toLocaleString()}`,
          "color: #666;",
        );
        console.log(
          "%c──────────────────────────────────────────────────────",
          "color: #ccc;",
        );
        console.log(
          `%cInput Cost:    $${costInfo.inputCost.toFixed(6)}`,
          "color: #FF9800; font-weight: bold;",
        );
        console.log(
          `%cOutput Cost:   $${costInfo.outputCost.toFixed(6)}`,
          "color: #FF9800; font-weight: bold;",
        );
        console.log(
          `%cTotal Cost:    $${costInfo.totalCost.toFixed(6)}`,
          "color: #4CAF50; font-weight: bold; font-size: 14px;",
        );
        console.log(
          `%cTotal Cost:    ₹${costInfo.totalCostINR.toFixed(4)} (approx @ ₹91/$)`,
          "color: #4CAF50; font-weight: bold; font-size: 14px;",
        );
        console.log(
          "%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          "color: #4CAF50; font-weight: bold; font-size: 12px;",
        );
      }

      // Merge parsed data with existing resume structure
      const newResume: ResumeData = {
        id: crypto.randomUUID(),
        title: "Imported Resume",
        personalInfo: data.personalInfo || {
          fullName: "",
          email: "",
          phone: "",
          location: "",
        },
        summary: data.summary || "",
        experiences: (data.experiences || []).map((exp: any) => ({
          ...exp,
          id: crypto.randomUUID(),
          description: Array.isArray(exp.description)
            ? exp.description.join("\n")
            : exp.description || "",
          achievements: exp.achievements || [],
        })),
        education: (data.education || []).map((edu: any) => ({
          ...edu,
          id: crypto.randomUUID(),
        })),
        skills: (data.skills || []).map((skill: any) => ({
          ...skill,
          id: crypto.randomUUID(),
        })),
        projects: (data.projects || []).map((proj: any) => ({
          ...proj,
          id: crypto.randomUUID(),
        })),
        certifications: (data.certifications || []).map((cert: any) => ({
          ...cert,
          id: crypto.randomUUID(),
        })),
        hobbies: (data.hobbies || []).map((hobby: any) => ({
          ...hobby,
          id: crypto.randomUUID(),
        })),
        customSections: [],
        sectionOrder: [
          "personalInfo",
          "summary",
          "experiences",
          "education",
          "skills",
          "projects",
          "certifications",
          "hobbies",
        ],
        sectionNames: {
          personalInfo: "Personal Information",
          summary: "Summary",
          experiences: "Experience",
          education: "Education",
          skills: "Skills",
          projects: "Projects",
          certifications: "Certifications",
          hobbies: "Hobbies",
        },
        templateId: "modern",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Store parsed resume but don't apply it yet - wait for Preview button
      setParsedResume(newResume);

      // Show success notification
      setShowNotification(true);
    } catch (err: any) {
      setError(err.message || "Failed to upload resume");
      setParsedResume(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {showNotification && (
        <Notification
          message="Resume parsed successfully! Click 'Preview and Save' to apply the changes."
          onClose={() => setShowNotification(false)}
          duration={6000}
        />
      )}
      <div className="border rounded-lg bg-card">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-4 hover:bg-accent transition-colors"
        >
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <h3 className="font-semibold">Upload Current Resume</h3>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>

        {isExpanded && (
          <div className="px-4 pb-4 space-y-4">
            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-800">
                Upload your existing resume (PDF or DOCX) to automatically
                extract and populate your information. This helps you avoid
                typing everything from scratch and gets you started quickly!
              </p>
            </div>
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-4">
                Upload PDF or DOCX file
              </p>
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
                id="resume-upload"
                ref={fileInputRef}
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                variant="outline"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Parsing...
                  </>
                ) : (
                  "Choose File"
                )}
              </Button>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        )}
      </div>
    </>
  );
}
