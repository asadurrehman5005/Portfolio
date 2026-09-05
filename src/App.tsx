import { useState } from "react";
import type { Project } from "./types";

// Components
import LoadingScreen from "./components/LoadingScreen";
import DynamicHeader from "./components/DynamicHeader";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Statement from "./components/Statement";
import Work from "./components/Work";
import Expertise from "./components/Expertise";
import TechCloud from "./components/TechCloud";
import Process from "./components/Process";
import Journey from "./components/Journey";
import About from "./components/About";
import Services from "./components/Services";
import Trust from "./components/Trust";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ProjectModal from "./components/ProjectModal";

// Dedicated Second Pages
import DedicatedWorkPage from "./pages/DedicatedWorkPage";
import DedicatedContactPage from "./pages/DedicatedContactPage";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<"home" | "work-page" | "contact-page">("home");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const openPage = (viewName: string) => {
    if (viewName === "work-page" || viewName === "contact-page") {
      setActiveView(viewName);
    } else {
      setActiveView("home");
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <div style={{ fontFamily: "'Instrument Sans', sans-serif", overflowX: "hidden" }}>
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onContact={() => openPage("contact-page")}
        />
      )}

      <div style={{ opacity: loading ? 0 : 1, transition: "opacity 0.5s ease" }}>
        <DynamicHeader activeView={activeView} onOpenPage={openPage} />

        {/* View 1: Complete Portfolio with all sections & tight spacing */}
        {activeView === "home" && (
          <main key="home">
            <Hero onOpenPage={openPage} />
            <Marquee />
            <Statement />
            <Work onSelectProject={(p) => setSelectedProject(p)} />
            <Expertise />
            <TechCloud />
            <Process />
            <Journey />
            <About />
            <Services onOpenContact={() => openPage("contact-page")} />
            <Trust onOpenPage={openPage} />
            <Contact />
            <Footer onOpenPage={openPage} />
          </main>
        )}

        {/* View 2: Dedicated Work Page (Page 2) */}
        {activeView === "work-page" && (
          <main key="work-page">
            <DedicatedWorkPage
              onBack={() => openPage("home")}
              onOpenContact={() => openPage("contact-page")}
              onSelectProject={(p) => setSelectedProject(p)}
            />
            <Footer onOpenPage={openPage} />
          </main>
        )}

        {/* View 3: Dedicated Contact Page (Page 3) */}
        {activeView === "contact-page" && (
          <main key="contact-page">
            <DedicatedContactPage onBack={() => openPage("home")} />
            <Footer onOpenPage={openPage} />
          </main>
        )}
      </div>
    </div>
  );
}
