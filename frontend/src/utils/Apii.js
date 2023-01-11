class Apii {
  constructor(options) {
    this._baseUrl = options.baseUrl;
  }

  _resHandler = (res) =>
    res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);

  // Имя, аватар
  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "GET",
      headers: {
        authorization: "f94fe150-fc6f-49bf-839d-cc1279afa58f",
        "Content-Type": "application/json",
        Accept: "application/json: charset=utf-8",
      },
    }).then((res) => this._resHandler(res));
  }

  loadAllCards() {
    return fetch(`${this._baseUrl}/cards`, {
      method: "GET",
      headers: {
        authorization: "f94fe150-fc6f-49bf-839d-cc1279afa58f",
        "Content-Type": "application/json",
        Accept: "application/json: charset=utf-8",
      },
    }).then((res) => this._resHandler(res));
  }

  //   работа с картами
  toggleLike(cardId, hasMyLike) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: `${hasMyLike ? "DELETE" : "PUT"}`,
      headers: {
        authorization: "f94fe150-fc6f-49bf-839d-cc1279afa58f",
        "Content-Type": "application/json",
        Accept: "application/json: charset=utf-8",
      },
    }).then((res) => this._resHandler(res));
  }

  deleteCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: {
        authorization: "f94fe150-fc6f-49bf-839d-cc1279afa58f",
        "Content-Type": "application/json",
        Accept: "application/json: charset=utf-8",
      },
    }).then((res) => this._resHandler(res));
  }

  // работа с попапами
  setUserInfo(user) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: {
        authorization: "f94fe150-fc6f-49bf-839d-cc1279afa58f",
        "Content-Type": "application/json",
        Accept: "application/json: charset=utf-8",
      },
      body: JSON.stringify(user),
    }).then((res) => this._resHandler(res));
  }

  setAvatar(avatarLink) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: {
        authorization: "f94fe150-fc6f-49bf-839d-cc1279afa58f",
        "Content-Type": "application/json",
        Accept: "application/json: charset=utf-8",
      },
      body: JSON.stringify({ avatar: avatarLink }),
    }).then((res) => this._resHandler(res));
  }

  postCard(card) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: {
        authorization: "f94fe150-fc6f-49bf-839d-cc1279afa58f",
        "Content-Type": "application/json",
        Accept: "application/json: charset=utf-8",
      },
      body: JSON.stringify({
        name: card.name,
        link: card.link,
        image: card.name,
      }),
    }).then((res) => this._resHandler(res));
  }
}

export const apii = new Apii({
  baseUrl: "https://nomoreparties.co/v1/cohort-42",
});
