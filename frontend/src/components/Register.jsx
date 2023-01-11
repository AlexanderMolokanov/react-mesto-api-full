import { useContext } from "react";
import { Redirect, Link } from "react-router-dom";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { RegForm } from "./RegForm";

export const Register = ({ onSubmit }) => {
  const currentUser = useContext(CurrentUserContext);

  return currentUser?.isLoggedIn ? (
    <Redirect to="/" />
  ) : (
    <RegForm
      title="Регистрация"
      buttonLabel="Зарегистрироваться"
      onSubmit={onSubmit}
      hint={
        <p className="regform__hint">
          {`Уже зарегистрированы? `}
          <Link className="regform__hint-link" to="/sign-in">
            Войти
          </Link>
        </p>
      }
    />
  );
};
