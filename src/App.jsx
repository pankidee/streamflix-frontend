import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { VJProvider } from './context/VJContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Welcome from './pages/Welcome';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Watch from './pages/Watch';
import MovieDetail from './pages/MovieDetail';
import VJMovies from './pages/VJMovies';
import Search from './pages/Search';
import History from './pages/History';
import SeriesList from './pages/SeriesList';
import SeriesDetail from './pages/SeriesDetail';
import WatchEpisode from './pages/WatchEpisode';
import Dashboard from './pages/admin/Dashboard';
import UploadMovie from './pages/admin/UploadMovie';
import EditMovie from './pages/admin/EditMovie';
import UploadSeries from './pages/admin/UploadSeries';
import ManageEpisodes from './pages/admin/ManageEpisodes';

export default function App() {
  return (
    <AuthProvider>
      <VJProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route path="/" element={<ProtectedRoute><Welcome /></ProtectedRoute>} />
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/movie/:id" element={<ProtectedRoute><MovieDetail /></ProtectedRoute>} />
            <Route path="/vj/:vjName" element={<ProtectedRoute><VJMovies /></ProtectedRoute>} />
            <Route path="/watch/:id" element={<ProtectedRoute><Watch /></ProtectedRoute>} />
            <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />

            <Route path="/series" element={<ProtectedRoute><SeriesList /></ProtectedRoute>} />
            <Route path="/series/:id" element={<ProtectedRoute><SeriesDetail /></ProtectedRoute>} />
            <Route path="/watch-episode/:id" element={<ProtectedRoute><WatchEpisode /></ProtectedRoute>} />

            <Route path="/admin" element={<AdminRoute><Dashboard /></AdminRoute>} />
            <Route path="/admin/upload" element={<AdminRoute><UploadMovie /></AdminRoute>} />
            <Route path="/admin/edit/:id" element={<AdminRoute><EditMovie /></AdminRoute>} />
            <Route path="/admin/series/new" element={<AdminRoute><UploadSeries /></AdminRoute>} />
<Route path="/admin/series/:seriesId/episodes" element={<AdminRoute><ManageEpisodes /></AdminRoute>} />
          </Routes>
        </BrowserRouter>
      </VJProvider>
    </AuthProvider>
  );
}