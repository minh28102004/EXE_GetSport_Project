import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from '@pages/AuthPage/index.tsx';
import TermsOfServicePage from '@pages/TermsOfServicePage/index.tsx';
import endPoint from '@routes/router.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path={endPoint.TERMSOFSERVICE} element={<TermsOfServicePage />} />
      </Routes>
    </Router>
  );
}

export default App;
