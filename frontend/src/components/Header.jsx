import React from "react";
import { useContext, useState, componentDidUpdate, NameClassComponent, useForceUpdate  } from "react";
import { useLocation, Link } from "react-router-dom";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import logo from "../images/header_logo.svg";

function Header({ onLogoutClick }) {
  const currentUser = useContext(CurrentUserContext);
  const [menuIsOpen, setMenuIsOpen] = useState(true);

  const location = useLocation();

  const toggleMenu = () => setMenuIsOpen(!menuIsOpen);

  const logoutMobile = () => {
    onLogoutClick();
    setMenuIsOpen(true);
  };
  

  const Icons = () => (
    <button
      className={menuIsOpen ? "header__close-button" : "header__menu-button"}
      type="button"
      onClick={toggleMenu}
    />
  );

  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="Логотип проекта" />
      {location.pathname === "/sign-in" && (
        <Link className="header__link" to="/sign-up">
          Регистрация
        </Link>
      )}

      {location.pathname === "/sign-up" && (
        <Link className="header__link" to="/sign-in">
          Войти
        </Link>
      )}
      {currentUser.isLoggedIn && location.pathname === "/" && (
        <>
          <div
            className={
              menuIsOpen
                ? "header__burger-menu header__burger-menu_open"
                : "header__burger-menu"
            }
          >
            <span className="header__info header__info_mobile">
              {currentUser?.email}
            </span>

            <Link
              className="header__link header__link_mobile"
              onClick={logoutMobile}
              to="#"
            >
              Выйти
            </Link>
          </div>

          <div className="header__info-wrapper">
            <div className="header__info">
              <span className="header__info header__info_mobile">
                {currentUser?.email}
              </span>

              <Link
                className="header__link header__link_logout"
                onClick={onLogoutClick}
                to="#"
              >
                Выйти
              </Link>
            </div>
          </div>
          <Icons />
        </>
      )}
    </header>
  );
}
export default Header;
