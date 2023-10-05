import React, { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { Auth, Home, Profile } from "./pages";
import {
  NavBar,
  ProtectedHomeRoute,
  ProtectedProfileRoute,
} from "./components";

const App = () => {
  const [theme, setTheme] = useState("");

  function NavbarWrapper() {
    return (
      <div>
        <NavBar theme={theme} />
        <Outlet />
      </div>
    );
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <NavbarWrapper />,
      children: [
        {
          path: "/",
          element: <Auth theme={theme} />,
        },
        {
          path: "/home",
          element: (
            <ProtectedHomeRoute>
              <Home theme={theme} />
            </ProtectedHomeRoute>
          ),
        },
        {
          path: "/profile/:userName",
          element: (
            <ProtectedProfileRoute>
              <Profile theme={theme} setTheme={setTheme} />
            </ProtectedProfileRoute>
          ),
        },
      ],
    },
  ]);

  useEffect(() => {
    if (theme == "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [theme]);

  function handleThemeSwitch() {
    setTheme(theme == "dark" ? "light" : "dark");
  }

  return (
    <div className="min-h-screen text-black bg-gray-100 cursor-default dark:text-gray-200 dark:bg-black ">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme === "dark" ? "dark" : "colored"}
      />
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
