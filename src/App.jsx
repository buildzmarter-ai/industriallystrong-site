import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Concepts from "./pages/Concepts";
import Systems from "./pages/Systems";
import Research from "./pages/Research";
import About from "./pages/About";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import QRLPhoenix from "./pages/QRLPhoenix";
import GutSense from "./pages/GutSense";
import Contact from "./pages/Contact";
import Architecture from "./pages/Architecture";
import Decks from "./pages/Decks";
import Programs from "./pages/Programs";

import { useEffect } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { trackStatcounterPageView } from "./utils/statcounter";
import Lithography from "./pages/Lithography";
import Lab from "./pages/Lab";

// External redirect component for /z
function ExternalRedirect({ to }) {
  useEffect(() => { window.location.href = to; }, [to]);
  return null;
}

export default function App() {

  const location = useLocation();

  useEffect(() => {
    trackStatcounterPageView();
  }, [location.pathname]);

  return (
    <div>
      <SiteHeader />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/concepts" element={<Concepts />} />
        <Route path="/systems" element={<Systems />} />
        <Route path="/research" element={<Research />} />
        <Route path="/about" element={<About />} />
        <Route path="/systems/qrlphoenix" element={<QRLPhoenix />} />
        <Route path="/systems/gutsense" element={<GutSense />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/architecture" element={<Architecture />} />
        <Route path="/decks" element={<Decks />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/lithography" element={<Lithography />} />
        <Route path="/lab" element={<Lab />} />
        <Route path="/z" element={<ExternalRedirect to="https://z.industriallystrong.com" />} />
      </Routes>

      <SiteFooter />
    </div>
  );
}
