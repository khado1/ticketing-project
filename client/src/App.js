import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import {
  Login,
  Register,
  BookingForm,
  NavbarMenu,
  MyTickets,
} from "./components";
import useIsAuthenticated from "./useIsAuthenticated";
import AvailableDepartures from "./components/AvailableDepartures";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import "./App.css";

const App = () => {
  const {
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
  } = useIsAuthenticated();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <BrowserRouter>
      <AppBar position="static" color="primary">
        <Toolbar className="header">
          <Typography variant="h6">Norwegian railways</Typography>

          {isAuthenticated && (
            <NavbarMenu onLogout={() => setIsAuthenticated(false)} />
          )}
        </Toolbar>
      </AppBar>

      <div>
        <Switch>
          <RedirectIfLoggedIn path="/login">
            <Login onLogin={() => setIsAuthenticated(true)} />
          </RedirectIfLoggedIn>

          <RedirectIfLoggedIn path="/register">
            <Register />
          </RedirectIfLoggedIn>

          <ProtectedRoute
            path="/availableDepartures"
            isAuthenticated={isAuthenticated}
          >
            <AvailableDepartures />
          </ProtectedRoute>

          <ProtectedRoute path="/booking" isAuthenticated={isAuthenticated}>
            <BookingForm />
          </ProtectedRoute>

          <ProtectedRoute path="/myTickets" isAuthenticated={isAuthenticated}>
            <MyTickets />
          </ProtectedRoute>

          <ProtectedRoute path="/" exact isAuthenticated={isAuthenticated}>
            <Redirect to="/booking" />
          </ProtectedRoute>
        </Switch>
      </div>
    </BrowserRouter>
  );
};

export default App;

const ProtectedRoute = ({ isAuthenticated, children, ...props }) => {
  if (isAuthenticated) {
    return <Route {...props}>{children}</Route>;
  }

  return <Redirect to="/login" />;
};

const RedirectIfLoggedIn = ({ isAuthenticated, children, ...props }) => {
  if (!isAuthenticated) {
    return <Route {...props}>{children}</Route>;
  }

  return <Redirect to="/" />;
};
