import { useContext, useEffect, useState } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { PopupWithForm } from "./PopupWithForm";

export const EditProfilePopup = ({ isOpen, onClose, onUserUpdate }) => {
  // Хуки
  const currentUser = useContext(CurrentUserContext);

  // Стейты
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [isValidName, setIsValidName] = useState(true);
  const [isValidJob, setIsValidJob] = useState(true);
  const [isValidButton, setIsValidButton] = useState(false);

  const [errorsName, setErrorsName] = useState([]);
  const [errorsJob, setErrorsJob] = useState([]);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setDescription(currentUser.about);
    }
  }, [currentUser, isOpen]);

  const handleChange = (e) => {
    if (e.target.name === "nameInput") {
      setName(e.target.value);
      setIsValidName(e.target.checkValidity());
      setErrorsName(e.target.validationMessage);
      setIsValidButton(true
        // isValidName && isValidJob
        )
    }
    if (e.target.name === "jobInput") {
      setDescription(e.target.value);
      setIsValidJob(e.target.checkValidity());
      setErrorsJob(e.target.validationMessage);
      setIsValidButton(true
        // isValidName && isValidJob
        )
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    onUserUpdate({
      name,
      about: description,
    });
  };

  return (
    <PopupWithForm
      title="Редактировать профиль"
      name="profile"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={submitHandler}
      buttonLabel="Сохранить"
      isValid={isValidButton}
    >
      <div className="popup__input-wrapper">
        <input
          type="text"
          required
          minLength="2"
          maxLength="40"
          className="popup__input"
          name="nameInput"
          placeholder="Имя"
          onChange={handleChange}
          value={name || ""}
        />
        <span className={`popup__error ${isValidName ? '' : 'popup__error_state_visible'}`}>{errorsName}</span>
      </div>

      <div className="popup__input-wrapper">
        <input
          type="text"
          required
          minLength="2"
          maxLength="200"
          className="popup__input"
          name="jobInput"
          placeholder="Род деятельности"
          onChange={handleChange}
          value={description || ""}
        />
        <span className={`popup__error ${isValidJob ? '' : 'popup__error_state_visible'}`}>{errorsJob}</span>
      </div>
    </PopupWithForm>
  );
};
