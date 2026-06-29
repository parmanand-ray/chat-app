import { Navigate, Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import getCurrentUser from "./costomHooks/getCurrectUser";
import { useSelector } from "react-redux";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import getAllusers from "./costomHooks/getAllusers";

function App() {
  getCurrentUser();
  getAllusers();

  const { userData, loading } = useSelector((state) => state.user);

  if (loading) {
    return <h1>Loading...</h1>;
  }
  return (
    <Routes>
      <Route
        path="/"
        element={userData ? <Home /> : <Navigate to="/login" />}
      />

      <Route
        path="/profile"
        element={userData ? <Profile /> : <Navigate to="/signup" />}
      />
      <Route
        path="/signup"
        element={!userData ? <SignUp /> : <Navigate to="/profile" />}
      />
      <Route
        path="/login"
        element={!userData ? <Login /> : <Navigate to="/" />}
      />
    </Routes>
  );
}

export default App;
