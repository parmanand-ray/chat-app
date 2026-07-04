import { Navigate, Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import getCurrentUser from "./costomHooks/getCurrectUser";
import { useDispatch, useSelector } from "react-redux";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import getAllusers from "./costomHooks/getAllusers";
import { io } from "socket.io-client";
import { useEffect, useRef } from "react";
import { serverUrl } from "./main";
import {
  setOnlineUsers,
  setSocket,
  updateUserLastMessage,
} from "./redux/userSlice";
function App() {
  getCurrentUser();
  getAllusers();

  const { userData, socket, onlineUsers, selectedUser } = useSelector(
    (state) => state.user,
  );
  let dispatch = useDispatch();
  const selectedUserRef = useRef(selectedUser);

  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

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

      socketio.on("conversationUpdated", (data) => {
        const isChatOpen =
          String(data.userId) === String(selectedUserRef.current?._id);

        dispatch(
          updateUserLastMessage({
            userId: data.userId,
            lastMessage: data.lastMessage,
            lastMessageAt: data.lastMessageAt,
            unreadCount: isChatOpen ? 0 : data.unreadCount,
          }),
        );
      });

      socketio.on("messagesRead", (data) => {
        dispatch(
          updateUserLastMessage({
            userId: data.userId,
            unreadCount: data.unreadCount ?? 0,
          }),
        );
      });

      return () => {
        socketio.off("getOnlineUesrs");
        socketio.off("conversationUpdated");
        socketio.off("messagesRead");
        socketio.close();
      };
    } else {
      if (socket) {
        socket.close();
        dispatch(setSocket(null));
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
        path="/admin"
        element={
          userData?.role === "admin" ? (
            <Admin />
          ) : (
            <Navigate to={userData ? "/" : "/login"} />
          )
        }
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
