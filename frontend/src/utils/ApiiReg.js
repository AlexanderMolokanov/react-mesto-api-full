class ApiiReg {
  constructor(options) {
    this._baseUrl = options.baseUrl;
  }

  _resHandler = (res) =>
    res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);

  // регистрация
  signup(singupPayload) {
    return fetch(`${this._baseUrl}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(singupPayload),
    }).then((res) => this._resHandler(res));
  }

  // проверить валидность токена и email для вставки в шапку
  isJwtValid() {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${localStorage.getItem("jwt")}`,
        "Content-Type": "application/json",
        Accept: "application/json: charset=utf-8",
      },
    }).then((res) => this._resHandler(res));
  }

  //  авторизация
  signin(signinPayload) {
    return fetch(`${this._baseUrl}/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify(signinPayload),
    }).then((res) => this._resHandler(res));
  }
}

export const apiiReg = new ApiiReg({
  baseUrl: "https://auth.nomoreparties.co",
});
