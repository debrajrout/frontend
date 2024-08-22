import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import Home from "./Home";
import Dashboard from "./Dashbord";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import PostJob from "./PostJob";
import PostedJobsWithApplications from "./components/section/ApplicationDashbord";
import AppliedJobs from "./components/section/AppliedJob";
import AdminDashboard from "./components/section/Admin";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Home />} />
      <Route
        path="/dashboard"
        element={
          <>
            <Dashboard />
          </>
        }
      />
      <Route
        path="/job-post"
        element={
          <>
            <SignedIn>
              <PostJob />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>

          </>
        }
      />
      <Route
        path="/job-application"
        element={
          <>
            <SignedIn>
              <PostedJobsWithApplications />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />
      <Route
        path="/job-status"
        element={
          <>
            <SignedIn>
              <AppliedJobs />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />
      <Route
        path="/admin-cz"
        element={
          <>
            <SignedIn>
              <AdminDashboard />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />
    </>
  )
);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
