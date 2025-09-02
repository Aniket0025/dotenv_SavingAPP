import { Navigate } from 'react-router-dom';
import { isAuthed } from '../api/client';

export default function ProtectedRoute({ children }) {
  if (!isAuthed()) {
    return <Navigate to="/signin" replace />;
  }
  return children;
}
