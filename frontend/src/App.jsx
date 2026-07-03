import { Navigate, Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import getCurrentUser from "./costomHooks/getCurrectUser";
import { useDispatch, useSelector } from "react-redux";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import getAllusers from "./costomHooks/getAllusers";
import { io } from "socket.io-client";
import { useEffect } from "react";
import { serverUrl } from "./main";
import { setOnlineUsers, setSocket } from "./redux/userSlice";
function App() {
  getCurrentUser();
  getAllusers();

  const { userData, socket, onlineUsers } = useSelector((state) => state.user);
  let dispatch = useDispatch();
  useEffect(() => {
    if (userData) {
      const socketio = io(`${serverUrl}`, {
        query: {
          userId: userData?._id,
        },
      });
      dispatch(setSocket(socketio));
      socketio.on("getOnlineUesrs", (users) => {
        dispatch(setOnlineUsers(users));
      });

      return () => socketio.close("getOnlineUesrs");
    }else{
      if(socket){
        socket.close();
        dispatch(setSocket(null))
      }
    }
  }, [userData]);

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
