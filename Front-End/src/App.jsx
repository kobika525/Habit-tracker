import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Habits from "./pages/HabitPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/profile";

function App() {
  return (
    <div className="min-h-screen bg-slate-100 text-gray-900 flex flex-col">
      <Navbar />

      <main className="pt-16 flex-1">
        <div
          className="
          max-w-7xl
          mx-auto
          px-3
          sm:px-4
          md:px-6
          lg:px-8
          py-4
        "
        >
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/habits"
              element={
                <PrivateRoute>
                  <Habits />
                </PrivateRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
