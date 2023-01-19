class ApiiReg {
  constructor(options) {
    this._baseUrl = options.baseUrl;
  }

  _resHandler = (res) =>
    res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);

      // Метод проверки ответа и преобразование в json
  _getResponseData = (res) => {
    if (!res.ok) {
      return Promise.reject(`Ошибка: ${res.status}`);
    }
    return res.json();
  }

  // регистрация
  signup(singupPayload) {
    // console.log(singupPayload)
    return fetch(`${this._baseUrl}/signup`, {
      method: "POST",
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        "Content-Type": "application/json",
      },
      body: JSON.stringify(singupPayload),
    }).then((res) => this._resHandler(res));
  }

  // проверить валидность токена и email для вставки в шапку
  isJwtValid() {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "GET",
      credentials: 'include',
      headers: {
        // authorization: `Bearer ${localStorage.getItem("jwt")}`,
        "Content-Type": "application/json",
        Accept: "application/json: charset=utf-8",
      },
    }).then((res) => this._resHandler(res));
  }

  //  авторизация
  signin(signinPayload) {
    return fetch(`${this._baseUrl}/signin`, {
      method: "POST",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
        'Accept': 'application/json',
        // authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify(signinPayload),
    }).then((res) => this._resHandler(res))
    .then((data) => {
      if (data.token){
        return data;
      } 
    });
  }


  logOut = () => {
    return fetch(`${this._baseUrl}/signout`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: "include",
    })
    .then(res => this._getResponseData(res))
  }
  

  
}

export const apiiReg = new ApiiReg({
  baseUrl: "http://localhost:3000", 
});
