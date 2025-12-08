import Home from "./Pages/Home";
import { Routes, Route } from "react-router-dom";
import Footer from "../src/components/Footer";
import Courses from "../src/Pages/Courses"  // Make sure this path is correct
import Navbar from "../src/components/Navbar"
import CollegeTraining from "./Pages/CollegeTraining";
import Corparate from "./Pages/CorporateTraining";
import Contact from "./Pages/Contact";
import Blog from "./Pages/BlogList";
import Study from "./Pages/StudyAbroad";
import Ebook from "./Pages/Ebook";
import CourseDetail from './Pages/CourseDetail';
import About from './Pages/About';
import BlogDetail from './Pages/BlogDetail';
import CodingForKids from './Pages/CodingForKids';
import ReferAndEarn from './Pages/ReferAndEarn';
import ScrollToTop from "../src/components/ScrollToTop";

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar className="z-[999]" />  {/* Add Navbar here so it appears on all pages */}
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/college-training" element={<CollegeTraining />} />
        <Route path="/corporate" element={<Corparate />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog"  element={<Blog/>} />
        <Route path="/study" element={<Study/>}/>
        <Route path="/ebook" element={<Ebook/>}/>
        <Route path="/course/:id" element={<CourseDetail />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/coding-for-kids" element={<CodingForKids />} />
        <Route path="/refer-and-earn" element={<ReferAndEarn />} /> 
      </Routes>
      <Footer />  {/* Add Footer here so it appears on all pages */}
    </div>
  );
}

export default App;