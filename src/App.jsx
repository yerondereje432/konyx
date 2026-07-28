import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import QuotePage from './pages/QuotePage';
import AdminRoute from './pages/admin/AdminRoute';
import ScrollToTop from './components/ScrollToTop';

// Layout for public pages (includes Navbar and Footer)
function PublicLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/quote" element={<QuotePage />} />
        </Route>

        {/* Admin Routes (No Navbar/Footer) */}
        <Route path="/admin/*" element={<AdminRoute />} />
      </Routes>
    </Router>
  );
}

export default App;
