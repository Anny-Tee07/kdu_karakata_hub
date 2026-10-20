import { useEffect, useRef } from "react";
import Navbar from "./components/NavBar";
import Hero from "./components/Hero"
import Categories from "./components/Categories"
import Listings from "./components/Listings"
import HowItWorks from "./components/HowItWorks"
import Footer from "./components/Footer"

import { Routes, Route, useLocation } from "react-router-dom";
import SafetyRules from "./pages/SafetyRules";
import VendorsHub from "./pages/VendorsHub";
import CategoriesPage from "./pages/CategoriesPage";
import NotFound from "./pages/NotFound";
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import ProductDetailsPage from './pages/ProductDetailsPage';
import LocationDiscovery from './components/LocationDiscovery';
import AdminDashboard from './pages/AdminDashboard';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './auth/ProtectedRoute';

function RouteScroll() {
  const { pathname, hash } = useLocation();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    const pathChanged = previousPathname.current !== pathname;
    previousPathname.current = pathname;

    if (hash) {
      requestAnimationFrame(() => {
        document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
      });
    } else if (pathChanged) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

function App() {
  return (
    <>
    <RouteScroll />
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
        path="/categories/:categorySlug"
        element={<CategoriesPage />}
      />

      <Route
        path="/categories"
        element={<CategoriesPage />}
      />

      <Route path="/product/:productId" element={<ProductDetailsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/my-listings" element={<ProtectedRoute><VendorsHub /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />

      <Route
        path="/"
        element={
          <div>
            <Navbar />
            <Hero />
            <Categories />
            <LocationDiscovery />
            <Listings />
            <HowItWorks />
            <Footer />
          </div>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
    </>
  )

}

export default App