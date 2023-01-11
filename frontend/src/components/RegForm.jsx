import { useState } from "react";

export const RegForm = ({ onSubmit, title, buttonLabel, hint }) => {
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

  // function FriendStatusWithCounter(props) {
  //   const [count, setCount] = useState(0);
  //   useEffect(() => {
  //     document.title = `Вы нажали ${count} раз`;
  //   });
  
  //   const [isOnline, setIsOnline] = useState(null);
  //   useEffect(() => {
  //     function handleStatusChange(status) {
  //       setIsOnline(status.isOnline);
  //     }
  
  //     ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
  //     return () => {
  //       ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
  //     };
  //   });
  //   // ...
  // }







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
        <button className="regform__submit-button" type="submit">
          {buttonLabel}
        </button>
        {hint ? hint : <></>}
      </form>
    </main>
  );
};
