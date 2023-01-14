import React, { useState, useEffect } from "react";
import {
  // Routes,
  Route,
  Switch,
  useHistory,
  // useNavigate
} from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Main from "./Main";
import { EditProfilePopup } from "./EditProfilePopup";
import { EditAvatarPopup } from "./EditAvatarPopup";
import {AddPlacePopup} from "./AddPlacePopup";
import { ImagePopup } from "./ImagePopup";
import { apiiReg } from "../utils/ApiiReg";
import { apii } from "../utils/Apii";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { ProtectedRoute } from "./ProtectedRoute";
import { Login } from "./Login";
import { Register } from "./Register";
import { InfoTooltip } from "./InfoTooltip";

function App() {
  // хуки
  let history = useHistory();

  // Состояния
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({ isLoggedIn: false });
  const [cards, setCards] = useState([]);
  const [isSuccessPopupOpen, setSuccessPopupOpen] = useState(false);
  const [isErrorPopupOpen, setErrorPopupOpen] = useState(false);

  // юзэффекты

  // регистрация
  const handleRegistration = (signupPayload) => {
    apiiReg
      .signup(signupPayload)
      .then(() => {
        handleSuccess();
      })
      .catch(handleError);
  };

  // авторизация
  const onLogin = (loginDatas) => {
    if (!loginDatas.email || !loginDatas.password) {
      return;
    }
    apiiReg
      .signin(loginDatas)
      .then((res) => {
        res.token && localStorage.setItem("jwt", res.token);

        // this.setState(this.setState({username: '', password: ''}),() => {

        //   this.props.handleLogin();
        //   history.push('/');

        setCurrentUser((prev) => {
          return { ...prev, isLoggedIn: true, email: loginDatas.email };
        });
        setCards(cards);
      })
      .catch(handleError);
  };

  // аутентификация

  useEffect(() => {
    const jwte = localStorage.getItem("jwt");
    jwte &&
      apiiReg
        .isJwtValid()
        .then((res) => {
          setCurrentUser((prev) => {
            return {
              ...prev,
              ...res.data,
              isLoggedIn: true,
            };
          });
        })
        .catch((error) => console.log(error));
  }, []);

  // загрузка данных пользователя
  useEffect(() => {
    currentUser.isLoggedIn &&
      Promise.all([apii.getUserInfo(), apii.loadAllCards()])
        .then(([user, cards]) => {
          setCurrentUser((prev) => {
            return { ...prev, ...user };
          });
          setCards(cards);
        })
        .catch((error) => {
          console.log(error);
        });
  }, [currentUser.isLoggedIn]);

  const handleEditAvatarClick = () => setIsEditAvatarPopupOpen(true);
  const handleEditProfileClick = () => setIsEditProfilePopupOpen(true);
  const handleAddPlaceClick = () => setIsAddPlacePopupOpen(true);
  const handleCardClick = (card) => setSelectedCard(card);

  const handleCardLike = (card) => {
    const isLiked = card.likes.some((like) => like._id === currentUser._id);
    apii
      .toggleLike(card._id, isLiked)
      .then((newCard) =>
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        )
      )
      .catch((err) => console.log(err));
  };

  const onSignOut = () => {
    localStorage.removeItem("jwt");
    setCurrentUser({ isLoggedIn: false });
    history.push("/sign-in");
  };

  const handleError = () => setErrorPopupOpen(true);
  const handleSuccess = () => {
    setSuccessPopupOpen(true);
  };

  const handleCardDelete = (card) =>
    apii
      .deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
      })
      .catch((err) => console.log(err));

  const closeAllPopups = () => {
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setSelectedCard(null);
    setErrorPopupOpen(false);
    setSuccessPopupOpen(false);
  };

  const handlePopupClose = (e) => {
    if (
      e.type === "keydown" ||
      e.target.classList.contains("popup_opened") ||
      e.target.classList.contains("popup__button-close")
    ) {
      closeAllPopups();
    }
  };

  const isOpen =
    isEditAvatarPopupOpen ||
    isEditProfilePopupOpen ||
    isAddPlacePopupOpen ||
    selectedCard;

  useEffect(() => {
    function closeByEscape(evt) {
      if (evt.key === "Escape") {
        closeAllPopups();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", closeByEscape);
    } else {
      document.removeEventListener("keydown", closeByEscape);
    }
  }, [isOpen]);

  const handleUserUpdate = (user) =>
    apii
      .setUserInfo(user)
      .then((res) => {
        setCurrentUser((state) => {
          return { ...state, ...res };
        });
        setIsEditProfilePopupOpen(false);
      })
      .catch((err) => console.log(err));

  const handleAvatarUpdate = ({ avatar }) =>
    apii
      .setAvatar(avatar)
      .then((user) => {
        setCurrentUser((state) => {
          return { ...state, ...user };
        });
        setIsEditAvatarPopupOpen(false);
      })
      .catch((err) => console.log(err));

  const handleAddPlaceSubmit = (cardPayload) =>
    apii
      .postCard(cardPayload)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        setIsAddPlacePopupOpen(false);
      })
      .catch((err) => console.log(err));

  const handleSuccessPopupClose = (e) => {
    closeAllPopups(e);
    history.push("/sign-in");
  };

  return (
    <div className="whole-page">
      <div className="page">
        <CurrentUserContext.Provider value={currentUser}>
          <Header onLogoutClick={onSignOut} />
          <Switch>
            <Route path="/sign-in">
              <Login onSubmit={onLogin} />
            </Route>
            <Route path="/sign-up">
              <Register onSubmit={handleRegistration} />
            </Route>
            <ProtectedRoute
              path="/"
              component={Main}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              onCardClick={handleCardClick}
              cards={cards}
              onCardDelete={handleCardDelete}
              onCardLike={handleCardLike}
            ></ProtectedRoute>
          </Switch>
          <Footer />

          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={handlePopupClose}
            onUserUpdate={handleUserUpdate}
          />
          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={handlePopupClose}
            onAddPlace={handleAddPlaceSubmit}
          />
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={handlePopupClose}
            onAvatarUpdate={handleAvatarUpdate}
          />
          <ImagePopup onClose={handlePopupClose} card={selectedCard} />

          <InfoTooltip
            onClose={handleSuccessPopupClose}
            isOpen={isSuccessPopupOpen}
          >
            <div className="popup__info-box popup__info-box_success"></div>
            <h2 className="popup__info-title">
              Вы успешно зарегистрировались!
            </h2>
          </InfoTooltip>

          <InfoTooltip onClose={handlePopupClose} isOpen={isErrorPopupOpen}>
            <div className="popup__info-box popup__info-box_error"></div>
            <h2 className="popup__info-title">
              Что-то пошло не так! Попробуйте ещё раз.
            </h2>
          </InfoTooltip>
        </CurrentUserContext.Provider>
      </div>
    </div>
  );
}

export default App;
