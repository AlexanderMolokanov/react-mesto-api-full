import { useContext, useEffect, useState } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { PopupWithForm } from "./PopupWithForm";

export const EditProfilePopup = ({ isOpen, onClose, onUserUpdate }) => {
  // Хуки
  const currentUser = useContext(CurrentUserContext);

  // Стейты
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setDescription(currentUser.about);
    }
  }, [currentUser, isOpen]);

  const handleChange = (e) => {
    if (e.target.name === "nameInput") {
      setName(e.target.value);
    }
    if (e.target.name === "jobInput") {
      setDescription(e.target.value);
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
      isOpen={isOpen}
      onClose={onClose}
      title="Редактировать профиль"
      name="profile"
      onSubmit={submitHandler}
      buttonLabel="Сохранить"
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
        <span className="popup__error"></span>
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
        <span className="popup__error"></span>
      </div>
    </PopupWithForm>
  );
};
