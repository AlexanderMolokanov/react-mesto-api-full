import { useRef, useEffect } from "react";
import { PopupWithForm } from "./PopupWithForm";

export const EditAvatarPopup = ({ isOpen, onClose, onAvatarUpdate }) => {
  const avatarRef = useRef();

  useEffect(() => {
    if (isOpen) {
      avatarRef.current.value = "";
    }
  }, [isOpen]);

  const submitHandler = (e) => {
    e.preventDefault();
    onAvatarUpdate({
      avatar: avatarRef.current.value,
    });
  };

  return (
    <PopupWithForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={submitHandler}
      title="Обновить аватар"
      name="avatar"
      buttonLabel="Сохранить"
    >
      <div className="popup__field-wrapper">
        <input
          className="popup__input"
          name="avatarLink"
          placeholder="Ссылка на картинку"
          type="url"
          required
          ref={avatarRef}
        />
        <p className="popup__error avatar-link-error"></p>
      </div>
    </PopupWithForm>
  );
};
