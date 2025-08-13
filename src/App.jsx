import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Dashboard from "@/components/pages/Dashboard";
import Students from "@/components/pages/Students";
import StudentProfile from "@/components/pages/StudentProfile";
import Classes from "@/components/pages/Classes";
import Grades from "@/components/pages/Grades";
import Attendance from "@/components/pages/Attendance";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background-50">
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/students/:id" element={<StudentProfile />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/grades" element={<Grades />} />
            <Route path="/attendance" element={<Attendance />} />
          </Routes>
        </Layout>
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;