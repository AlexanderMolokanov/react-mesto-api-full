import { useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

export function Card({ card, onCardClick, onCardLike, onDeleteClick }) {
  const currentUser = useContext(CurrentUserContext);
  const isOwner = card.owner._id === currentUser._id;
  const isLiked = card.likes.some((like) => like._id === currentUser._id);
  const handleClick = () => onCardClick(card);
  const handleLikeClick = () => onCardLike(card);
  const handleDeleteClick = () => onDeleteClick(card);
  // const cardLikeButtonClassName = `...`;

  return (
    <article className="element">
      <img
        className="element__image"
        alt={card.name}
        src={card.link}
        onClick={handleClick}
      />
      <div className="element__data">
        <h2 className="element__title"> {card.name} </h2>
        <div className="element__heart-datas">
          <button
            className={
              isLiked ? "element__heart element__heart_like" : "element__heart"
            }
            type="button"
            onClick={handleLikeClick}
          ></button>
          <div className="element__heart-number "> {card.likes.length} </div>
        </div>
      </div>
      {isOwner ? (
        <button
          className="element__delete"
          type="button"
          onClick={handleDeleteClick}
        ></button>
      ) : (
        <></>
      )}
    </article>
  );
}
