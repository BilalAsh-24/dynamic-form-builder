import React, { useState, useEffect } from "react";
import API from "../api";
import { useNavigate, useParams, Link } from "react-router-dom";
import Header from "../components/Header";

export default function EditForm() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([
    { questionText: "", questionType: "text", options: [], required: false },
  ]);
  const [expiresAt, setExpiresAt] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    loadForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadForm = async () => {
    try {
      const res = await API.get(`/forms/${id}`);
      const form = res.data;

      setTitle(form.title);
      setDescription(form.description || "");
      setExpiresAt(form.expires_at ? new Date(form.expires_at).toISOString().slice(0, 16) : "");

      const transformedQuestions = form.Questions.map((q) => ({
        questionText: q.question_text,
        questionType: q.question_type,
        options: q.Options ? q.Options.map((opt) => opt.option_text) : [],
        required: q.required,
      }));

      setQuestions(transformedQuestions.length > 0 ? transformedQuestions : [
        { questionText: "", questionType: "text", options: [], required: false }
      ]);

      setLoading(false);
    } catch (error) {
      console.error(error);
      const message = error.response
        ? (error.response.data?.message || "Failed to load form.")
        : "Cannot connect to server. Please ensure the backend is running.";
      setErr(message);
      setLoading(false);
    }
  };

  const addQuestion = () =>
    setQuestions([
      ...questions,
      { questionText: "", questionType: "text", options: [], required: false },
    ]);

  const deleteQuestion = (index) => {
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated.length > 0 ? updated : [
      { questionText: "", questionType: "text", options: [], required: false }
    ]);
  };

  const updateQuestion = (i, key, value) => {
    const updated = [...questions];
    updated[i][key] = value;
    setQuestions(updated);
  };

  const addOption = (i) => {
    const updated = [...questions];
    updated[i].options.push("");
    setQuestions(updated);
  };

  const updateOption = (qi, oi, value) => {
    const updated = [...questions];
    updated[qi].options[oi] = value;
    setQuestions(updated);
  };

  const deleteOption = (qi, oi) => {
    const updated = [...questions];
    updated[qi].options = updated[qi].options.filter((_, i) => i !== oi);
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    
    // Simple validation
    if (questions.some(q => q.questionType === "multipleChoice" && q.options.length === 0)) {
      setErr("Multiple choice questions must have at least one option.");
      return;
    }

    try {
      await API.put(`/forms/${id}`, {
        title,
        description,
        expiresAt,
        questions,
      });
      alert("Form Updated Successfully!");
      nav("/dashboard");
    } catch (error) {
      console.error(error);
      const message = error.response
        ? (error.response.data?.message || "Failed to update form.")
        : "Cannot connect to server. Please ensure the backend is running.";
      setErr(message);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="apple-container-sm text-center" style={{ marginTop: "100px" }}>
          <div className="apple-card">
            <h4 style={{ fontWeight: "600" }}>Loading form editor...</h4>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="apple-container-sm">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <div>
            <h1 className="apple-title">Edit Form</h1>
            <p className="apple-subtitle" style={{ marginBottom: 0 }}>Modify form metadata and structure</p>
          </div>
          <Link to="/dashboard" className="apple-btn apple-btn-outline">
            Cancel
          </Link>
        </div>

        {err && (
          <div className="apple-alert apple-alert-danger">
            {err}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Metadata Card */}
          <div className="apple-card" style={{ padding: "32px" }}>
            <h5 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "20px" }}>Form Metadata</h5>
            
            <div className="apple-form-group">
              <label className="apple-label">Form Title</label>
              <input
                className="apple-input"
                placeholder="Enter form title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="apple-form-group" style={{ marginBottom: 0 }}>
              <label className="apple-label">Form Description</label>
              <textarea
                className="apple-input"
                placeholder="Enter form description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ minHeight: "80px", resize: "vertical" }}
              />
            </div>
          </div>

          <h5 style={{ fontSize: "16px", fontWeight: "600", marginTop: "40px", marginBottom: "20px", color: "var(--apple-text)" }}>
            Questions Configuration
          </h5>

          {/* Questions list */}
          {questions.map((q, i) => (
            <div key={i} className="apple-card" style={{ padding: "28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <span className="apple-badge apple-badge-blue" style={{ fontWeight: "600" }}>
                  Question {i + 1}
                </span>
                
                {questions.length > 1 && (
                  <button
                    type="button"
                    className="apple-btn apple-btn-danger apple-btn-sm"
                    style={{ padding: "4px 10px", borderRadius: "6px" }}
                    onClick={() => deleteQuestion(i)}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="apple-form-group">
                <label className="apple-label">Question Text</label>
                <input
                  className="apple-input"
                  placeholder="Enter the question query..."
                  value={q.questionText}
                  onChange={(e) =>
                    updateQuestion(i, "questionText", e.target.value)
                  }
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "16px" }}>
                <div>
                  <label className="apple-label">Response Type</label>
                  <select
                    className="apple-select"
                    value={q.questionType}
                    onChange={(e) =>
                      updateQuestion(i, "questionType", e.target.value)
                    }
                  >
                    <option value="text">Text Response</option>
                    <option value="multipleChoice">Multiple Choice</option>
                  </select>
                </div>

                <div style={{ display: "flex", alignItems: "flex-end", height: "100%", paddingBottom: "10px" }}>
                  <label className="apple-radio-option w-100" style={{ margin: 0, padding: "10px 14px", border: "1px solid var(--apple-border)", borderRadius: "var(--apple-radius-md)" }}>
                    <input
                      type="checkbox"
                      className="apple-radio-input"
                      style={{ borderRadius: "4px" }}
                      checked={q.required}
                      onChange={(e) =>
                        updateQuestion(i, "required", e.target.checked)
                      }
                    />
                    <span style={{ fontSize: "14px", fontWeight: "500" }}>Mark as Required</span>
                  </label>
                </div>
              </div>

              {/* Options Sub-menu for Multiple Choice */}
              {q.questionType === "multipleChoice" && (
                <div style={{ borderTop: "1px solid var(--apple-border)", paddingTop: "16px", marginTop: "16px" }}>
                  <label className="apple-label" style={{ marginBottom: "10px" }}>Options List</label>
                  {q.options.map((opt, oi) => (
                    <div key={oi} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                      <input
                        className="apple-input"
                        placeholder={`Option ${oi + 1}`}
                        value={opt}
                        onChange={(e) =>
                          updateOption(i, oi, e.target.value)
                        }
                        required
                        style={{ flexGrow: 1 }}
                      />
                      <button
                        type="button"
                        className="apple-btn apple-btn-secondary apple-btn-sm"
                        style={{ padding: "0 14px", borderRadius: "10px" }}
                        onClick={() => deleteOption(i, oi)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="apple-btn apple-btn-outline apple-btn-sm mt-10"
                    onClick={() => addOption(i)}
                  >
                    + Add Option
                  </button>
                </div>
              )}
            </div>
          ))}

          <button
            type="button"
            className="apple-btn apple-btn-outline w-100"
            style={{ borderStyle: "dashed", borderWidth: "2px", height: "48px", marginBottom: "40px" }}
            onClick={addQuestion}
          >
            + Add Another Question
          </button>

          {/* Expiration Settings */}
          <div className="apple-card" style={{ padding: "32px", marginBottom: "40px" }}>
            <h5 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "20px" }}>Expiry Configuration</h5>
            <div className="apple-form-group" style={{ marginBottom: 0 }}>
              <label className="apple-label">Expiration Date & Time (Optional)</label>
              <input
                type="datetime-local"
                className="apple-input"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "15px", marginBottom: "80px" }}>
            <button type="submit" className="apple-btn apple-btn-primary w-100" style={{ height: "48px" }}>
              Update Form
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
