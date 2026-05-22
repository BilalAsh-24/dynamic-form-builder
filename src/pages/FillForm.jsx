import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api";

export default function FillForm() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [email, setEmail] = useState("");
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isEditingResponse, setIsEditingResponse] = useState(false);
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [msg, setMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    API.get(`/forms/${id}`)
      .then((res) => setForm(res.data))
      .catch(() => setMsg("Form Not Found or Expired"));
  }, [id]);

  // Load a respondent's previous submission
  const handleLoadResponse = async () => {
    if (!email) {
      setErrorMsg("Please enter your email first to load previous answers.");
      return;
    }
    setErrorMsg("");
    setSuccessMsg("");
    setLoadingResponse(true);

    try {
      const res = await API.get(`/responses/${id}/respondent?email=${email}`);
      const loadedAnswers = {};
      
      // Match question_id to question index in the form
      res.data.answers.forEach((ans) => {
        const qIdx = form.Questions.findIndex((q) => q.question_id === ans.question_id);
        if (qIdx !== -1) {
          loadedAnswers[qIdx] = ans.answer;
        }
      });

      setAnswers(loadedAnswers);
      setIsEditingResponse(true);
      setSuccessMsg("Found and loaded your previous response! You can modify or delete it below.");
    } catch (error) {
      console.error(error);
      setIsEditingResponse(false);
      setErrorMsg("No previous submission found for this email. You can fill the form as a new response.");
    } finally {
      setLoadingResponse(false);
    }
  };

  // Submit new response or update existing one
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const answerPayload = form.Questions.map((q, idx) => ({
      question_id: q.question_id,
      answer: answers[idx] || "",
    }));

    try {
      if (isEditingResponse) {
        // Update response (PUT)
        await API.put(`/responses/${id}/respondent`, {
          respondentEmail: email,
          answers: answerPayload,
        });
        setSuccessMsg("Your response has been updated successfully!");
      } else {
        // Create new response (POST)
        await API.post(`/responses/${id}`, {
          respondentEmail: email,
          answers: answerPayload,
        });
        setSuccessMsg("Your response has been submitted successfully!");
      }
      setSubmitted(true);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Failed to submit response. Please try again.");
    }
  };

  // Delete an existing response
  const handleDeleteResponse = async () => {
    if (!email) return;
    if (!window.confirm("Are you sure you want to delete your previous submission? This action cannot be undone.")) {
      return;
    }

    setErrorMsg("");
    setSuccessMsg("");

    try {
      await API.delete(`/responses/${id}/respondent?email=${email}`);
      setAnswers({});
      setIsEditingResponse(false);
      setEmail("");
      setSuccessMsg("Your previous submission has been successfully deleted.");
    } catch (error) {
      setErrorMsg("Failed to delete submission. Please try again.");
    }
  };

  if (!form) {
    return (
      <div className="apple-container-sm text-center" style={{ marginTop: "100px" }}>
        <div className="apple-card">
          <h4 className="apple-title" style={{ fontSize: "24px" }}>{msg || "Loading form..."}</h4>
          <p className="apple-subtitle" style={{ marginBottom: 0 }}>Please wait while we retrieve the details.</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="apple-container-sm text-center" style={{ marginTop: "80px" }}>
        <div className="apple-card" style={{ padding: "40px" }}>
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>✓</div>
          <h3 className="apple-title" style={{ fontSize: "28px" }}>Thank You!</h3>
          <p className="apple-subtitle">Your responses have been securely recorded.</p>
          {successMsg && <div className="apple-alert apple-alert-success mb-20">{successMsg}</div>}
          <div className="d-flex justify-content-center gap-15 mt-20">
            <button
              onClick={() => {
                setSubmitted(false);
                setIsEditingResponse(false);
                setAnswers({});
                setEmail("");
                setSuccessMsg("");
              }}
              className="apple-btn apple-btn-primary"
            >
              Fill Again
            </button>
            <Link to="/dashboard" className="apple-btn apple-btn-secondary">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="apple-container-sm">
      <div className="apple-card" style={{ padding: "36px", marginBottom: "30px" }}>
        <h3 className="apple-title" style={{ fontSize: "30px", marginBottom: "10px" }}>{form.title}</h3>
        <p className="apple-subtitle" style={{ fontSize: "15px", marginBottom: "0" }}>{form.description || "No description provided."}</p>
      </div>

      {successMsg && (
        <div className="apple-alert apple-alert-success">
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="apple-alert apple-alert-danger">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Email Field & Lookup Action */}
        <div className="apple-card">
          <h5 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "16px" }}>Respondent Identity</h5>
          <div className="apple-form-group">
            <label className="apple-label">Email Address</label>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="email"
                required
                placeholder="Enter your email to fill or load submission..."
                className="apple-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isEditingResponse}
                style={{ flexGrow: 1 }}
              />
              {!isEditingResponse && (
                <button
                  type="button"
                  onClick={handleLoadResponse}
                  disabled={loadingResponse || !email}
                  className="apple-btn apple-btn-secondary"
                  style={{ whiteSpace: "nowrap" }}
                >
                  {loadingResponse ? "Checking..." : "Load Previous"}
                </button>
              )}
              {isEditingResponse && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingResponse(false);
                    setAnswers({});
                    setEmail("");
                    setSuccessMsg("");
                    setErrorMsg("");
                  }}
                  className="apple-btn apple-btn-outline"
                >
                  Change Email
                </button>
              )}
            </div>
            <p className="text-muted" style={{ fontSize: "12px", marginTop: "8px", color: "var(--apple-text-secondary)" }}>
              If you have already submitted this form, click "Load Previous" to retrieve, modify, or delete your previous response.
            </p>
          </div>
        </div>

        {/* Questions Section */}
        {form.Questions.map((q, idx) => (
          <div key={q.question_id} className="apple-card">
            <div style={{ marginBottom: "14px" }}>
              <span className="apple-badge apple-badge-blue" style={{ marginRight: "10px", fontSize: "11px" }}>
                Question {idx + 1}
              </span>
              {q.required && <span className="apple-badge apple-badge-red" style={{ fontSize: "11px" }}>Required</span>}
            </div>

            <h5 className="apple-label" style={{ fontSize: "16px", fontWeight: "500", marginBottom: "16px" }}>
              {q.question_text}
            </h5>

            {q.question_type === "text" ? (
              <div className="apple-form-group" style={{ marginBottom: 0 }}>
                <input
                  type="text"
                  placeholder="Your answer..."
                  className="apple-input"
                  required={q.required}
                  value={answers[idx] || ""}
                  onChange={(e) =>
                    setAnswers({ ...answers, [idx]: e.target.value })
                  }
                />
              </div>
            ) : (
              <div className="apple-radio-group">
                {q.Options.map((opt, oi) => {
                  const isSelected = answers[idx] === opt.option_text;
                  return (
                    <label
                      key={opt.option_id}
                      className={`apple-radio-option ${isSelected ? "selected" : ""}`}
                    >
                      <input
                        className="apple-radio-input"
                        type="radio"
                        name={`question_${q.question_id}`}
                        value={opt.option_text}
                        checked={isSelected}
                        onChange={() =>
                          setAnswers({ ...answers, [idx]: opt.option_text })
                        }
                        required={q.required && !answers[idx]}
                      />
                      <span style={{ fontSize: "14px", color: "var(--apple-text)" }}>
                        {opt.option_text}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        ))}

        {/* Actions Bar */}
        <div className="d-flex justify-content-between align-items-center gap-15 mt-20" style={{ marginBottom: "50px" }}>
          {isEditingResponse ? (
            <>
              <button
                type="button"
                onClick={handleDeleteResponse}
                className="apple-btn apple-btn-danger"
                style={{ flex: 1 }}
              >
                Delete Response
              </button>
              <button
                type="submit"
                className="apple-btn apple-btn-primary"
                style={{ flex: 2 }}
              >
                Update Response
              </button>
            </>
          ) : (
            <button type="submit" className="apple-btn apple-btn-primary w-100">
              Submit Answers
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
