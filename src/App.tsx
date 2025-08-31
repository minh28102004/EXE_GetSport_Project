import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "@pages/AuthPage/index.tsx";
import TermsOfServicePage from "@pages/TermsOfServicePage/index.tsx";
import HomePage from "@pages/HomePage/homePage.tsx";
import BlogPost from "@pages/HomePage/BlogPost";
import MainLayout from "@layout/MainLayout";
import endPoint from "@routes/router.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route element={<MainLayout />}>
          <Route path={endPoint.HOMEPAGE} element={<HomePage />} />
          <Route path={endPoint.BLOGPOST} element={<BlogPost />} />
          <Route
            path={endPoint.TERMSOFSERVICE}
            element={<TermsOfServicePage />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
