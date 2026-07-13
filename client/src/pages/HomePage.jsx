import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import Statistics from "../components/Statistics";

function HomePage() {
    return (
        <>
            <Navbar />
            <Hero />
            <Features />
            <HowItWorks />
            <Statistics />
            <Footer />
        </>
    );
}

export default HomePage;