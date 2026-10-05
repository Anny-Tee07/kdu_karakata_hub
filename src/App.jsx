import Navbar from "./components/NavBar";
import Hero from "./components/Hero"
import Categories from "./components/Categories"
import Listings from "./components/Listings"
import HowItWorks from "./components/HowItWorks"
import Footer from "./components/Footer"

import { Routes, Route } from "react-router-dom";
import SafetyRules from "./pages/SafetyRules";
import VendorsHub from "./pages/VendorsHub";

function App() {
  return (
    <Routes>
      <Route
        path="/safety"
        element={<SafetyRules />}
      />

      <Route
        path="/vendor-hub"
        element={<VendosrHub />}
      />

      <Route
        path="/"
        element={
          <main>
            <Navbar />
            <Hero />
            <Categories />
            <Listings />
            <HowItWorks />
            <Footer />
          </main>
        }
      />
    </Routes>
  )

}

export default App