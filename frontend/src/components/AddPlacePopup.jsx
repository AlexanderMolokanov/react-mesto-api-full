import { useState,  useEffect} from "react";
import { PopupWithForm } from "./PopupWithForm";

export const AddPlacePopup = ({ isOpen, onClose, onAddCard }) => {
  const [name, setName] = useState(null);
  const [link, setLink] = useState(null);

  const handleChange = (e) => {
    if (e.target.name === "placeName") {
      setName(e.target.value);
    }
    if (e.target.name === "placeLink") {
      setLink(e.target.value);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    onAddCard({
      name,
      link,
    });
  };

  useEffect(() => {
    if (isOpen) {
      setName(null);
      setLink(null);
    }
  }, [isOpen]);

  return (
    <PopupWithForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={submitHandler}
      title="Новое место"
      name="place"
      buttonLabel="Сохранить"
    >
      <div className="popup__input-wrapper">
        <input
          required
          minLength="2"
          maxLength="200"
          className="popup__input"
          name="placeName"
          type="text"
          placeholder="Название"
          onChange={handleChange}
          value={name || ""}
        />
        <span className="popup__error"></span>
      </div>

      <div className="popup__input-wrapper">
        <input
          type="url"
          required
          className="popup__input"
          name="placeLink"
          placeholder="Ссылка на картинку"
          onChange={handleChange}
          value={link || ""}
        />
        <span className="popup__error"></span>
      </div>
    </PopupWithForm>
  );
};
