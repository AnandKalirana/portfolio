
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
} from "@/lib/portfolio-data";

export const instant = false;

export default async function Home() {
  const [projects, experiences, skillGroups] = await Promise.all([
    getProjects(),
    getExperiences(),
    getSkillGroups(),
  ]);

  return (
    <main>
      <Navigation />
      <Hero />
      <About />
      <Projects projects={projects} />
      <Experience experiences={experiences} />
      <Skills skillGroups={skillGroups} />
      <Contact />
      <Footer />
    </main>
  );
}
