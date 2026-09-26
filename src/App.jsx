import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import JobsPage from './pages/JobsPage';
import TalentPage from './pages/TalentPage';
import PostJobPage from './pages/PostJobPage';
import RegisterPage from './pages/RegisterPage';
import PricingPage from './pages/PricingPage';
import AboutPage from './pages/AboutPage';
import QuotePage from './pages/QuotePage';
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
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/talent" element={<TalentPage />} />
          <Route path="/post-job" element={<PostJobPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/quote" element={<QuotePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
