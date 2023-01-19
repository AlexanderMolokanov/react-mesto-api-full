import { useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { Redirect } from "react-router-dom";
import { RegForm } from "./RegForm";

export const Login = ({ onSubmit, onClick}) => {
  const currentUser = useContext(CurrentUserContext);

  return currentUser?.isLoggedIn ? (
    <Redirect to="/" /> 
  ) : (
    <RegForm onSubmit={onSubmit}  onClick={onClick} title="Вход" buttonLabel="Войти" />
  );
};
