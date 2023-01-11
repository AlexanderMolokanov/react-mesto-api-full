export function ImagePopup({ onClose, card }) {
  return (
    <div
      className={card ? `popup popup_image popup_opened` : `popup popup_image`}
      onClick={onClose}
    >
      <figure className="popup__image-frame">
        <img className="popup__image" src={card?.link} alt={card?.name} />
        <figcaption className="popup__image-caption">{card?.name}</figcaption>
        <button
          className="popup__button-close"
          type="button"
          onClick={onClose}
        ></button>
      </figure>
    </div>
  );
}
