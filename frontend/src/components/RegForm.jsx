import { useState } from "react";

export const RegForm = ({ onSubmit, title, buttonLabel, hint, onClick }) => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const handleChange = (e) => {
    if (e.target.name === "email") {
      setEmail(e.target.value);
    }
    if (e.target.name === "password") {
      setPassword(e.target.value);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    onSubmit({
      email,
      password,
    });
    setEmail(null);
    setPassword(null);
  };

  // const clickHandler = (e) => {
  //   e.preventDefault();
  //   onClick();
  // };

  return (
    <main className="content">
      <form className="regform" onSubmit={submitHandler}>
        <h1 className="regform__title">{title}</h1>
        <input
          onChange={handleChange}
          type="email"
          className="regform__input"
          name="email"
          placeholder="Email"
          required
          minLength="2"
          maxLength="40"
          value={email || ""}
        />
        <input
          onChange={handleChange}
          type="password"
          className="regform__input"
          name="password"
          placeholder="Пароль"
          required
          minLength="6"
          maxLength="40"
          value={password || ""}
        />
        <button className="regform__submit-button" type="submit" 
        // onClick={clickHandler}
        >
          {buttonLabel}
        </button>
        {hint ? hint : <></>}
      </form>
    </main>
  );
};
