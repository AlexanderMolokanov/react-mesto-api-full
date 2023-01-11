import { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

export const ProtectedRoute = ({ component: Component, ...props }) => {
  const currentUser = useContext(CurrentUserContext);
  return (
    <Route>
      {() =>
        currentUser?.isLoggedIn ? (
          <Component {...props} />
        ) : (
          <Redirect to="/sign-in" />
        )
      }
    </Route>
  );
};
