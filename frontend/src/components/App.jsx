import React, { useState, useEffect } from "react";
import {
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Main from "./Main";
import { EditProfilePopup } from "./EditProfilePopup";
import { EditAvatarPopup } from "./EditAvatarPopup";
import { AddPlacePopup } from "./AddPlacePopup";
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

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({ isLoggedIn: false });
  const [cards, setCards] = useState([]);
  const [isSuccessPopupOpen, setSuccessPopupOpen] = useState(false);
  const [isErrorPopupOpen, setErrorPopupOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  function onSignOut() {
    apiiReg.logOut();
    setIsLoggedIn(false);
    setCurrentUser({ isLoggedIn: false });
    history.push("/sign-in");
  }

  // регистрация
  const handleRegistration = (signupPayload) => {
    console.log(`регистрация: ${signupPayload}`)
    apiiReg
      .signup(signupPayload)
      .then((res) => {
        console.log(res);
        if (res) {
          // .status === 201)
          setSuccessPopupOpen(true);
          history.push("/");
        }
        // return res.json();
      })
      .catch(handleError);
  };

  // авторизация
  const onLogin = (loginDatas) => {
    console.log(`авторизация: ${loginDatas}`)
    // if (!loginDatas.email || !loginDatas.password) {
    //   return;
    // }
    apiiReg
      .signin(loginDatas)
      .then((res) => {
        // console.log(res.token)
        // res.token && localStorage.setItem("jwt", res.token);
        if (res) {
          setCurrentUser((prev) => {
            return { ...prev, isLoggedIn: true, email: loginDatas.email };
          });
          setCards(cards);
          history.push("/");
        }
        history.push("/");
      })
      .catch(handleError).
      catch(() => {
        // setIsLoggedIn(false);
        setCurrentUser((prev) => {
          return { ...prev, isLoggedIn: false};
        });
      });
  };

  // аутентификация

  // useEffect(() => {
  //   // isLoggedIn &&
  //     apiiReg
  //       .isJwtValid()
  //       .then((res) => {
  //         setCurrentUser((prev) => {
  //           return {
  //             ...prev,
  //             ...res.data,
  //             isLoggedIn: true,
  //           };
  //         });
  //       })
  //       .catch((error) => console.log(error));
  // }, []);

  // useEffect(() => {
  //   apii.getUserInfo().then(([user, cards]) => {
  //     setCurrentUser((prev) => {
  //       return { ...prev, ...user };
  //     });
  //     // setCards(cards);
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
  //   // history.push("/");
  // }, []);




  //  Делаем запрос на получение данных пользователя и карточек
  useEffect(() => {
    // if (loggedIn) {
      apii
      .getUserInfo()
      .then((res) => {
        // setCurrentUser(res);
        setCurrentUser((prev) => {
                    return {
                      ...prev,
                      ...res.data,
                      isLoggedIn: true,
                    };
                  });
        setIsLoggedIn(true);
        history.push('/');
        // setProfileEmail(res.email);
      })
      .catch(() => {
        setIsLoggedIn(false);
        setCurrentUser((prev) => {
          return {
            ...prev,
            // ...res.data,
            isLoggedIn: false,
          };
        });
        history.push('/sign-in')
      });

      // setIsLoad(true);
      // api
      //   .getInitialCards()
      //   .then((values) => {
      //     setCards(values);
      //   })
      //   .catch(() => {
      //     console.log(`Вы не авторизованы`);
      //   })
      //   .finally(() => {
      //     setIsLoad(false);
      //   });
    // }
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
          history.push('/');
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

  const handleError = () => setErrorPopupOpen(true);

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
          <Header onSignOut={onSignOut} />
          <Switch>
            <Route path="/sign-in">
              <Login onSubmit={onLogin} />
            </Route>
            <Route path="/sign-up">
              <Register onSubmit={handleRegistration} />
            </Route>
            <ProtectedRoute
              path="/"
              loggedIn={isLoggedIn}
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
            onAddCard={handleAddPlaceSubmit}
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
