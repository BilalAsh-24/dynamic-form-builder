import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateForm from "./pages/CreateForm";
import EditForm from "./pages/EditForm";
import FillForm from "./pages/FillForm";
import ViewResponses from "./pages/ViewResponses";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forms/:id" element={<FillForm />} />
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create" element={<CreateForm />} />
            <Route path="/edit/:id" element={<EditForm />} />
            <Route path="/responses/:id" element={<ViewResponses />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
