import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api";
import Header from "../components/Header";

export default function ViewResponses() {
  const { id } = useParams();
  const [responses, setResponses] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    const loadResponses = async () => {
      try {
        const res = await API.get(`/responses/${id}`);
        setResponses(res.data);
      } catch (error) {
        console.error("Load responses error:", error);
        setErr("Failed to load responses");
      }
    };
    loadResponses();
  }, [id]);

  return (
    <>
      <Header />
      <div className="apple-container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <div>
            <h1 className="apple-title">Form Responses</h1>
            <p className="apple-subtitle" style={{ marginBottom: 0 }}>Review all submitted responses for this form</p>
          </div>
          <Link to="/dashboard" className="apple-btn apple-btn-outline">
            Back to Dashboard
          </Link>
        </div>

        {err && (
          <div className="apple-alert apple-alert-danger">
            {err}
          </div>
        )}

        {responses.length === 0 ? (
          <div className="apple-card text-center" style={{ padding: "48px 24px" }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>📬</div>
            <h4 style={{ fontWeight: "600", fontSize: "18px", marginBottom: "8px" }}>No Submissions Yet</h4>
            <p style={{ color: "var(--apple-text-secondary)", fontSize: "14px", marginBottom: 0 }}>
              Once users start filling out this form, their responses will appear right here.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {responses.map((resp, idx) => (
              <div key={idx} className="apple-card" style={{ padding: "28px", margin: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid var(--apple-border)", paddingBottom: "16px", marginBottom: "20px" }}>
                  <div>
                    <span className="apple-badge apple-badge-blue" style={{ fontSize: "11px", fontWeight: "600", marginBottom: "8px" }}>
                      Submission #{idx + 1}
                    </span>
                    <h5 style={{ fontWeight: "600", fontSize: "16px", margin: 0, color: "var(--apple-text)" }}>
                      {resp.respondentEmail}
                    </h5>
                  </div>
                  <span style={{ fontSize: "13px", color: "var(--apple-text-secondary)" }}>
                    {new Date(resp.submittedAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {resp.answers.map((ans, ansIdx) => (
                    <div key={ansIdx} style={{ backgroundColor: "#f5f5f7", padding: "14px 18px", borderRadius: "10px" }}>
                      <span style={{ fontSize: "12px", color: "var(--apple-text-secondary)", fontWeight: "600", display: "block", marginBottom: "4px" }}>
                        {ans.questionText}
                      </span>
                      <span style={{ fontSize: "14.5px", color: "var(--apple-text)", fontWeight: "500" }}>
                        {ans.answer || <span style={{ color: "var(--apple-text-secondary)", fontStyle: "italic" }}>No answer provided</span>}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
