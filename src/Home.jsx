import Footer from "./components/section/Footer";
import Header from "./components/section/Header";
import Hero from "./components/section/Hero";


export default function Home() {
    return (
        <div className="flex flex-col">
            <Header />
            <Hero />
            <Footer />
        </div>
    )
}
