import { Link } from "react-router-dom"

export default function Register(props) {
  // console.log(props);
  return (
    <section className="authorization">
      <h2 className="authorization__title">Регистрация</h2>
      <form className="authorization__form" onSubmit={props.onSubmit}>
        <input className="authorization__input" type="email" placeholder="Email" required />
        <input className="authorization__input" type="password" placeholder="Пароль" required />
        <button className="authorization__submit" type="submit">Зарегистрироваться</button>
      </form>
      <p className="authorization__text">Уже зарегистрированы? <Link to="/sign-in" className="authorization__link">Войти</Link> </p>
    </section>
  )
}