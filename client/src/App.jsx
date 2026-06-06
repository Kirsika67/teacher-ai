import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import OverviewPage from './pages/OverviewPage'
import StudentsPage from './pages/StudentsPage'
import StudentDetailPage from './pages/StudentDetailPage'
import GradeEntryPage from './pages/GradeEntryPage'
import ClassesPage from './pages/ClassesPage'
import MaterialsPage from './pages/MaterialsPage'
import FeedbackPage from './pages/FeedbackPage'
import PlanningPage from './pages/PlanningPage'

function PrivateRoute({ children }) {
  const { teacher, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center h-screen text-gray-500">Laadin...</div>
  if (!teacher) return <Navigate to="/login" replace />
  return children
}

function PublicRoute({ children }) {
  const { teacher, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center h-screen text-gray-500">Laadin...</div>
  if (teacher) return <Navigate to="/ulevaade" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Navigate to="/ulevaade" replace />} />
        <Route path="ulevaade" element={<OverviewPage />} />
        <Route path="opilased" element={<StudentsPage />} />
        <Route path="opilased/:studentId" element={<StudentDetailPage />} />
        <Route path="hinded" element={<GradeEntryPage />} />
        <Route path="klassid" element={<ClassesPage />} />
        <Route path="materjalid" element={<MaterialsPage />} />
        <Route path="tagasiside" element={<FeedbackPage />} />
        <Route path="planeerimine" element={<PlanningPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/ulevaade" replace />} />
    </Routes>
  )
}
