import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root";
import "./index.css";
import ErrorPage from "./error-page";
import Register from "./routes/register";
import PaymentsPage from "./routes/payments";
import Donate from "./routes/donate";
import Upgrade from "./routes/upgrade";
import Reprint from "./routes/reprint";
import DonorStats from "./routes/donorstats";
import { Toaster } from "./components/ui/toaster";
import AgentLogin from "./routes/agentlogin";
import AgentDashboard from "./routes/agentDashboard";
import Admin from "./routes/admin";
import AdminDash from "./routes/adminDashboard";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: "register",
    element: <Register />,
    // errorElement: <ErrorPage />
  },
  {
    path: "donate",
    element: <Donate />
  },
  {
    path: "payment",
    element: <PaymentsPage />,

  },
  {
    path: "upgrade",
    element: <Upgrade />,

  },
  {
    path: "reprint",
    element: <Reprint />
  },
  {
    path: "agent",
    element: <AgentLogin />,
  },
  {
    path: "dashboard",
    element: <AgentDashboard />
  },
  {
    path: "donorwall",
    element: <DonorStats />
  },
  {
    path: "admin",
    element: <Admin />
  },
  {
    path: 'admindashboard',
    element: <AdminDash />
  }
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <Toaster />
  </React.StrictMode>
);
