import { useEffect } from "react";

export const InfoTooltip = ({ children, isOpen, onClose }) => {
  const handleEscClose = (e) => e.key === "Escape" && onClose(e);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscClose);
    }
    return () => document.removeEventListener("keydown", handleEscClose);
  }, [isOpen]);

  return (
    <div className={isOpen ? "popup popup_opened" : "popup "} onClick={onClose}>
      <div className="popup__container popup__container_info">
        {children}
        <button
          className="popup__button-close"
          type="button"
          onClick={onClose}
        ></button>
      </div>
    </div>
  );
};
