import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import Products from "./Components/Context/Products";
import ScrollToTop from "./Components/ScrollToTop/ScrollToTop";
import Layout from "./Components/Layout/Layout";
import ProtectedRoute from "./Components/AdminAuth/ProtectedRoute";
import { AdminAuthProvider } from "./Components/AdminAuth/AdminAuth";
import RouteFallback from "./Components/RouteFallback/RouteFallback";

/**
 * Every route is code-split. Previously all 17 routes plus ~445 statically
 * imported images were pulled into a single bundle, so a visitor landing on the
 * contact page downloaded the entire admin panel and every product photo import
 * in the project.
 */
const HomePage     = lazy(() => import("./Pages/HomePage/HomePage"));
const Aboutus      = lazy(() => import("./Pages/Aboutus/Aboutus"));
const Contact      = lazy(() => import("./Pages/Contact/Contact"));
const Projects     = lazy(() => import("./Pages/Projects/Projects"));
const CategoryPage = lazy(() => import("./Pages/CategoryPage/CategoryPage"));
const Product1Page = lazy(() => import("./Pages/Product1Page/Product1Page"));
const Project1Page = lazy(() => import("./Pages/Project1Page/Project1Page"));
const NotFound     = lazy(() => import("./Pages/NotFound/NotFound"));
const AdminDashboard = lazy(() => import("./Pages/Admin/AdminDashboard"));

/**
 * The ten category paths that used to be hardcoded routes, each passing an
 * Albanian display name as both the query key and the page heading. They are
 * now redirects onto `/category/:slug`, so existing links, bookmarks and any
 * indexed URLs keep working.
 */
const LEGACY_CATEGORY_PATHS = {
  "/OfficeChairs":  "office-chairs",
  "/MeetingChairs": "meeting-chairs",
  "/WaitingChairs": "waiting-chairs",
  "/WorkingTable":  "working-tables",
  "/Workstation":   "workstations",
  "/MeetingTable":  "meeting-tables",
  "/Cabinets":      "cabinets",
  "/Drawers":       "drawers",
  "/Bathrooms":     "bathrooms",
  "/Others":        "others",
};

function App() {
  return (
    <AdminAuthProvider>
      <Router>
        <ScrollToTop />
        <Products>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              {/* Admin — outside <Layout>, behind a real auth check. */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/Aboutus" element={<Aboutus />} />
                <Route path="/Contact" element={<Contact />} />
                <Route path="/Projects" element={<Projects />} />

                <Route path="/category/:slug" element={<CategoryPage />} />

                {Object.entries(LEGACY_CATEGORY_PATHS).map(([path, slug]) => (
                  <Route
                    key={path}
                    path={path}
                    element={<Navigate to={`/category/${slug}`} replace />}
                  />
                ))}

                <Route path="/product/:slug" element={<Product1Page />} />
                <Route path="/project/:slug" element={<Project1Page />} />

                {/* Previously absent: an unknown URL rendered a blank page
                    between the navbar and the footer. */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </Products>
      </Router>
    </AdminAuthProvider>
  );
}

export default App;
