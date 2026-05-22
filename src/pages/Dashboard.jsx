import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import Header from "../components/Header";

export default function Dashboard() {
  const [forms, setForms] = useState([]);
  const [err, setErr] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  const loadForms = async () => {
    try {
      const res = await API.get("/forms/myforms");
      setForms(res.data);
    } catch (error) {
      setErr("Failed to load forms");
    }
  };

  useEffect(() => {
    loadForms();
  }, []);

  const copyFormLink = async (formId) => {
    const link = `${window.location.origin}/forms/${formId}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopiedId(formId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      alert("Failed to copy link");
    }
  };

  const handleDelete = async (formId) => {
    if (!window.confirm("Are you sure you want to delete this form? This action cannot be undone and will delete all responses.")) {
      return;
    }

    try {
      await API.delete(`/forms/${formId}`);
      loadForms();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to delete form");
    }
  };

  return (
    <>
      <Header />
      <div className="apple-container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <div>
            <h1 className="apple-title">My Forms</h1>
            <p className="apple-subtitle" style={{ marginBottom: 0 }}>Create, publish, and inspect your custom forms</p>
          </div>
          <Link to="/create" className="apple-btn apple-btn-primary">
            + Create New Form
          </Link>
        </div>

        {err && (
          <div className="apple-alert apple-alert-danger">
            {err}
          </div>
        )}

        {forms.length === 0 ? (
          <div className="apple-card text-center" style={{ padding: "48px 24px" }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>📋</div>
            <h4 style={{ fontWeight: "600", fontSize: "18px", marginBottom: "8px" }}>No Forms Yet</h4>
            <p style={{ color: "var(--apple-text-secondary)", fontSize: "14px", marginBottom: "24px" }}>
              Get started by creating your very first interactive questionnaire.
            </p>
            <Link to="/create" className="apple-btn apple-btn-primary">
              Create First Form
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
            {forms.map((form) => (
              <div key={form.form_id} className="apple-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", margin: 0 }}>
                <div style={{ marginBottom: "20px" }}>
                  <h4 style={{ fontWeight: "600", fontSize: "18px", marginBottom: "8px", wordBreak: "break-word" }}>
                    {form.title}
                  </h4>
                  <p style={{ color: "var(--apple-text-secondary)", fontSize: "13.5px", margin: 0, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>
                    {form.description || "No description provided."}
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {/* Share Link Action */}
                  <button
                    onClick={() => copyFormLink(form.form_id)}
                    className="apple-btn apple-btn-outline apple-btn-sm w-100"
                    style={{
                      backgroundColor: copiedId === form.form_id ? "var(--apple-blue-light)" : "",
                      borderColor: copiedId === form.form_id ? "var(--apple-blue)" : "",
                      color: copiedId === form.form_id ? "var(--apple-blue)" : "",
                      fontWeight: copiedId === form.form_id ? "600" : "500"
                    }}
                  >
                    {copiedId === form.form_id ? "✓ Link Copied!" : "Copy Share Link"}
                  </button>

                  {/* Operational CRUD Actions */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    <Link
                      to={`/edit/${form.form_id}`}
                      className="apple-btn apple-btn-secondary apple-btn-sm"
                      style={{ textAlign: "center" }}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(form.form_id)}
                      className="apple-btn apple-btn-danger apple-btn-sm"
                    >
                      Delete
                    </button>
                  </div>

                  <Link
                    to={`/responses/${form.form_id}`}
                    className="apple-btn apple-btn-primary apple-btn-sm w-100"
                    style={{ textAlign: "center", backgroundColor: "#34c759", hover: { backgroundColor: "#30b050" } }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#30b050"}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#34c759"}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleDeleteConfirm}
                    disabled={deleting}
                  >
                    {deleting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Deleting...
                      </>
                    ) : (
                      "Delete Form"
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

