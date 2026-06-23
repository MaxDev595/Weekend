import './assets/sccs/index.scss';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';

import Register from './pages/Register';
import Home from './pages/Home';
import ComingSoon from './pages/coming-soon';
import Photos from './pages/Photos';
import Bookmarks from './pages/Bookmarks';
import Likes from './pages/Likes';
import MyPage from './pages/MyPage';
import News from './pages/News';
import Friends from './pages/Friends';
import Communities from './pages/Communities';
import Messages from './pages/Messages';

function AppContent() {
  const location = useLocation();

  const hiddenLayoutRoutes = ['/', '/coming-soon'];

  const showLayout = !hiddenLayoutRoutes.includes(
    location.pathname
  );

  return (
    <>
      {showLayout && (
        <>
          <Header />
          <Sidebar />
        </>
      )}

      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/coming-soon" element={<ComingSoon />} />
        <Route path="/news" element={<News />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/communities" element={<Communities />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/photos" element={<Photos />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/likes" element={<Likes />} />
        <Route path="/my-page" element={<MyPage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
