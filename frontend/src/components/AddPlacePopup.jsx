import { useState,  useEffect} from "react";
import { PopupWithForm } from "./PopupWithForm";

export const AddPlacePopup = ({ isOpen, onClose, onAddCard }) => {
  const [name, setName] = useState(null);
  const [link, setLink] = useState(null);

  const [isValidName, setIsValidName] = useState(true);
  const [isValidLink, setIsValidLink] = useState(true);
  const [isValidButton, setIsValidButton] = useState(false);

  const [errorsName, setErrorsName] = useState([]);
  const [errorsLink, setErrorsLink] = useState([]);

  const handleChange = (e) => {
    if (e.target.name === "placeName") {
      setName(e.target.value);
      setIsValidName(e.target.checkValidity());
      setErrorsName(e.target.validationMessage);
      setIsValidButton(true
        // isValidName && isValidLink
        )
    }
    if (e.target.name === "placeLink") {
      setLink(e.target.value);
      setIsValidLink(e.target.checkValidity());
      setErrorsLink(e.target.validationMessage);
      setIsValidButton(true
        // isValidName && isValidLink
        )
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
      title="Новое место"
      name="place"
      buttonLabel="Сохранить"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={submitHandler}
      isValid={isValidButton}
      // isValid={isValidName && isValidLink} 
    >
      <div className="popup__input-wrapper">
        <input
          className="popup__input"
          value={name || ''}
          onChange={handleChange}
          placeholder="Название"
          name="placeName"
          minLength="2"
          maxLength="200"
          type="text"
          required
        />
        <span className={`popup__error ${isValidName ? '' : 'popup__error_state_visible'}`}>{errorsName}</span>

      </div>

      <div className="popup__input-wrapper">
        <input
          type="url"
          required
          className="popup__input"
          name="placeLink"
          placeholder="Ссылка на картинку"
          onChange={handleChange}
          value={link || ''}
        />
        <span className={`popup__error ${isValidLink ? '' : 'popup__error_state_visible'}`}>{errorsLink}</span>
      </div>
    </PopupWithForm>
  );
};