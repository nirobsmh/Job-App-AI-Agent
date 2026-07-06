"use client";
import { useState } from "react";
import { CoverLetterResponse } from "./types/analysis";

export default function Home() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const handleResumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setResumeFile(file);
    }
  };

  const handleJobDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setJobDescription(event.target.value);
  };

  const handleAnalyze = async () => {
    if (!resumeFile) {
      setErrorMessage("Please upload a resume PDF.");
      return;
    }

    if (!jobDescription.trim()) {
      setErrorMessage("Please enter a job description.");
      return;
    }

    const formData = new FormData();
    formData.append("resume_file", resumeFile);
    formData.append("job_description", jobDescription.trim());

    setErrorMessage("");
    setIsAnalyzing(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/analyze_upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let detail = "Failed to analyze resume.";
        try {
          const errorPayload = (await response.json()) as { detail?: string };
          if (typeof errorPayload.detail === "string" && errorPayload.detail) {
            detail = errorPayload.detail;
          }
        } catch {
          // Keep default detail message.
        }
        setErrorMessage(detail);
        return;
      }

      const data = (await response.json()) as CoverLetterResponse;
      setCoverLetter(data.cover_letter ?? "");
    } catch {
      setErrorMessage("Unable to reach server. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-1 bg-slate-100">
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 py-8 lg:px-10">
        <section className="mb-8 max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
            Job Application Research Agent
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Upload a resume PDF and paste the job description on the left. The
            AI-generated cover letter appears on the right.
          </p>
        </section>

        <section className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3">
              <label
                htmlFor="resume"
                className="text-sm font-medium text-slate-800"
              >
                Upload Resume
              </label>
              <div className="flex min-h-36 items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4">
                <input
                  type="file"
                  accept="application/pdf"
                  id="resume"
                  name="resume"
                  className="w-full cursor-pointer text-sm text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-900 file:px-4 file:py-3 file:text-sm file:font-medium file:text-white"
                  onChange={handleResumeChange}
                />
              </div>
              <p className="text-xs text-slate-500">
                {resumeFile ? `Selected: ${resumeFile.name}` : "PDF only"}
              </p>
            </div>

            <div className="flex flex-1 flex-col gap-3">
              <label
                htmlFor="job-description"
                className="text-sm font-medium text-slate-800"
              >
                Job Description
              </label>
              <textarea
                id="job-description"
                name="job-description"
                className="h-[420px] w-full resize-none rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-200"
                onChange={handleJobDescriptionChange}
                value={jobDescription}
                placeholder="Paste the full job description here."
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                className={`inline-flex h-12 items-center justify-center rounded-2xl px-6 text-sm font-medium text-white transition ${
                  isAnalyzing
                    ? "cursor-not-allowed bg-slate-400"
                    : "cursor-pointer bg-slate-950 hover:bg-slate-800"
                }`}
                onClick={handleAnalyze}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? "Analyzing..." : "Generate Cover Letter"}
              </button>
              {errorMessage ? (
                <p className="text-sm text-red-600">{errorMessage}</p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-3">
              <label
                htmlFor="cover-letter"
                className="text-sm font-medium text-slate-800"
              >
                AI Generated Cover Letter
              </label>
              <span className="text-xs text-slate-500">
                Ready after analysis
              </span>
            </div>
            <textarea
              id="cover-letter"
              name="cover-letter"
              className="h-full min-h-[620px] w-full flex-1 resize-none rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700 outline-none"
              readOnly
              value={coverLetter}
              placeholder="Your tailored cover letter will appear here."
            />
          </div>
        </section>
      </main>
    </div>
  );
}
