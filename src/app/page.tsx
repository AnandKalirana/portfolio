
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import {
  getProjects,
  getExperiences,
  getSkillGroups,
  getSiteFiles,
} from "@/lib/portfolio-data";

export const instant = false;

export default async function Home() {
  const [projects, experiences, skillGroups, files] = await Promise.all([
    getProjects(),
    getExperiences(),
    getSkillGroups(),
    getSiteFiles(),
  ]);

  return (
    <main>
      <Navigation />
      <Hero portraitSrc={files.portraitSrc} resumeHref={files.resumeHref} />
      <About />
      <Projects projects={projects} />
      <Experience experiences={experiences} />
      <Skills skillGroups={skillGroups} />
      <Contact />
      <Footer />
    </main>
  );
}
