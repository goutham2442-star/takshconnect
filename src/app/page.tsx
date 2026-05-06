import Ticker from "@/components/landing/Ticker";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Stats from "@/components/landing/Stats";
import FeaturesBrief from "@/components/landing/FeaturesBrief";
import FeaturesGrid from "@/components/landing/FeaturesGrid";
import Announcements from "@/components/landing/Announcements";
import Clubs from "@/components/landing/Clubs";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <Ticker />
      <Navbar />
      
      <div id="home">
        <Hero />
      </div>
      
      <Stats />
      
      <div id="notes">
        <FeaturesBrief />
      </div>
      
      <div id="internships">
        <FeaturesGrid />
      </div>
      
      <div id="events">
        <Announcements />
      </div>
      
      <div id="clubs">
        <Clubs />
      </div>
      
      <div id="contact">
        <Footer />
      </div>
    </main>
  );
}
