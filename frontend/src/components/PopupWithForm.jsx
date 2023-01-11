import { useEffect } from "react";

export function PopupWithForm({
  title,
  name,
  children,
  isOpen,
  onClose,
  buttonLabel,
  onSubmit,
}) {
  const handleEscClose = (e) => e.key === "Escape" && onClose(e);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscClose);
    }
    return () => document.removeEventListener("keydown", handleEscClose);
  }, [isOpen]);

  return (
    <div
      className={isOpen ? `popup popup_opened ${name}` : `popup ${name}`}
      onClick={onClose}
    >
      <div className="popup__container">
        <button
          className="popup__button-close"
          type="button"
          onClick={onClose}
        ></button>
        <h2 className="popup__label">{title}</h2>
        <form className="popup__form" name={name} onSubmit={onSubmit}>
          {children}
          <button className="popup__button-save" type="submit">
            {buttonLabel}
          </button>
        </form>
      </div>
    </div>
  );
}
