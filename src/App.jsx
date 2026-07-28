import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import QuotePage from './pages/QuotePage';
import AdminRoute from './pages/admin/AdminRoute';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quote" element={<QuotePage />} />
          <Route path="/admin/*" element={<AdminRoute />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
