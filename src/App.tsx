import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from '@pages/AuthPage/index.tsx';
import endPoint from '@routes/router.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
      </Routes>
    </Router>
  );
}

export default App;
