import React from "react";
import { useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { Card } from "./Card";

export function Main({
  onEditProfile,
  onAddPlace,
  onEditAvatar,
  onCardClick,
  cards,
  onCardLike,
  onCardDelete,
}) {
  const currentUser = useContext(CurrentUserContext);
  const section = () => {
    if (cards.length > 0) {
      return cards.map((card) => (
        <Card
          card={card}
          onCardClick={onCardClick}
          onCardLike={onCardLike}
          onDeleteClick={onCardDelete}
          key={`${card._id}`}
        />
      ));
    }
  };

  return (
    <main className="content">
      <section className="profile">
        <div className="profile__image-wraper">
          <img
            className="profile__image"
            src={currentUser?.avatar}
            alt="Изображение профиля"
          />
          <button
            className="profile__black-box"
            type="button"
            onClick={onEditAvatar}
          ></button>
        </div>
        <div className="profile__info">
          <h1 className="profile__name">{currentUser?.name}</h1>
          <button
            className="profile__edit"
            type="button"
            onClick={onEditProfile}
          ></button>
          <p className="profile__job">{currentUser?.about}</p>
        </div>
        <button
          className="profile__add"
          type="button"
          onClick={onAddPlace}
        ></button>
      </section>

      <section className="elements">{section()}</section>
    </main>
  );
}
export default Main;
