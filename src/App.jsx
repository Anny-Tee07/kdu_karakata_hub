import Navbar from "./components/NavBar";
import Hero from "./components/Hero"
import Categories from "./components/Categories"
import Listings from "./components/Listings"
import HowItWorks from "./components/HowItWorks"
import Footer from "./components/Footer"

import { Routes, Route } from "react-router-dom";
import SafetyRules from "./pages/SafetyRules";
import VendorsHub from "./pages/VendorsHub";
import CategoriesPage from "./pages/CategoriesPage";
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';


function App() {
  return (
    <Routes>
      <Route
        path="/safety"
        element={<SafetyRules />}
      />

      <Route
        path="/vendor-hub"
        element={<VendorsHub />}
      />

      <Route path="/signin" element={<SignIn />} />

      <Route path="/signup" element={<SignUp />} />

      <Route
        path="/category/:categorySlug"
        element={<CategoriesPage />}
      />

      <Route
        path="/categories"
        element={<CategoriesPage />}
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