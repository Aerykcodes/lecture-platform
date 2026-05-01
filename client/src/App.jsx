import { Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TutorSetup from "./pages/TutorSetup";
import TutorPublic from "./pages/TutorPublic";
import TutorDashboard from "./pages/TutorDashboard";

import CreateCourse from "./pages/CreateCourse";
import CourseDetail from "./pages/CourseDetail";
import UploadLecture from "./pages/UploadLecture";
import ProtectedRoute from "./components/ProtectedRoute";
import ManageCourse from "./pages/ManageCourse";
import AddLecture from "./pages/AddLecture";
import MyCourses from "./pages/MyCourses";
import ExploreCourses from "./pages/ExploreCourses";
export default function App(){
  return(
    <Routes>

      {/* PUBLIC */}
      <Route path="/" element={<Landing/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/site/:subdomain" element={<TutorPublic/>}/>
      <Route path="/course/:courseId" element={<CourseDetail/>}/>
      <Route path="/tutor/course/:courseId" element={<ManageCourse/>}/>
      <Route path="/courses" element={<ExploreCourses />} />
      <Route
  path="/tutor/course/:courseId/add-lecture"
  element={<AddLecture/>}
/>
      {/* TUTOR */}
      <Route
        path="/tutor/setup"
        element={
          <ProtectedRoute>
            <TutorSetup/>
          </ProtectedRoute>
        }
      />

      <Route
        path="/tutor/dashboard"
        element={
          <ProtectedRoute>
            <TutorDashboard/>
          </ProtectedRoute>
        }
      />

      <Route
        path="/tutor/create-course"
        element={
          <ProtectedRoute>
            <CreateCourse/>
          </ProtectedRoute>
        }
      />

      
<Route
  path="/tutor/upload"
  element={
    <ProtectedRoute>
      <UploadLecture/>
    </ProtectedRoute>
  }
/>
{/* STUDENT */}
<Route
  path="/student/courses"
  element={
    <ProtectedRoute>
      <MyCourses />
    </ProtectedRoute>
  }
/>
<Route
  path="/tutor/course/:courseId"
  element={<ManageCourse/>}
/>


    </Routes>
  );
}