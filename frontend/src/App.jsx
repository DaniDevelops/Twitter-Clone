import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SignUpPage from "./Pages/Auth/SignUpPage";
import LoginPage from "./Pages/Auth/LoginPage";
import HomePage from "./Pages/Home/HomePage";
import AppLayout from "./Layout/AppLayout";
import ProfilePage from "./Pages/Profile/ProfilePage";
import { Toaster } from "react-hot-toast";
import { useQuery } from "react-query";
import { getClient } from "./api-client";
import LoadingSpinner from "./Components/Common/LoadingSpinner";
import NotificationPage from "./Pages/Notifications/NoificationPage";
import Main from "./Layout/Main";

function App() {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: getClient,
    retry: false,
  });

  console.log(authUser);

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={authUser ? <AppLayout /> : <Main />}>
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/signup"
            element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/notifications"
            element={authUser ? <NotificationPage /> : <Navigate to="/login" />}
          />

          <Route
            path="/profile/:username"
            element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
          />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
