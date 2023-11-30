import { Link, Outlet } from "@tanstack/react-router";

export function App() {
  return (
    <>
      <h1>App</h1>
      <Link to="/signup">Sign up</Link>
      <Link to="/login">Login</Link>
      <Outlet />
    </>
  );
}
