import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Root from "./routes/root";
import "./index.css";
import ErrorPage from "./error-page";
import Register from "./routes/register";
import PaymentsPage from "./routes/payments";
import Donate from "./routes/donate";
import Upgrade from "./routes/upgrade";
import Reprint from "./routes/reprint";
import DonorStats, { loader as donorWallLoader } from "./routes/donorstats";
import { Toaster } from "./components/ui/toaster";
import AgentLogin from "./routes/agentlogin";
import AgentDashboard from "./routes/agentDashboard";
import Admin from "./routes/admin";
import AdminDash from "./routes/adminDashboard";
import AdminAgents from "./routes/adminAgents";
import Home from "./routes/home";
import DonorView from "./routes/donorview";
import DonorReports from "./routes/donorReports";
import { queryClient } from "./services/queryClient";

const router = createBrowserRouter([
  {
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "register",
        element: <Register />,
        // errorElement: <ErrorPage />
      },
      {
        path: "arrears",
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
        path: "donorwall",
        element: <DonorStats />,
        loader: donorWallLoader
      },
      {
        path: "reprint",
        element: <Reprint />
      },
      // Wrap the below routes in a protectedRoute
      // element once auth is implemented
      {
        path: "agent",
        element: <AgentLogin />,
      },
      
      {
        path: "admin",
        element: <Admin />
      },
    ]
  },
  {
    path: "dashboard",
    element: <AgentDashboard />
  },
  {
    path: 'admindashboard',
    element: <AdminDash />
  },
  {
    path: 'adminagents',
    element: <AdminAgents />
  },
  {
    path: 'donordetails',
    element: <DonorView />
  },
  {
    path: 'report',
    element: <DonorReports />
  }
  
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
  </React.StrictMode>
);
