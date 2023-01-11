import { useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { Redirect } from "react-router-dom";
import { RegForm } from "./RegForm";

export const Login = ({ onSubmit }) => {
  const currentUser = useContext(CurrentUserContext);

  return currentUser?.isLoggedIn ? (
    <Redirect to="/" />
  ) : (
    <RegForm onSubmit={onSubmit} title="Вход" buttonLabel="Войти" />
  );
};
