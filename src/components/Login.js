export default function Login(props) {
  // console.log(props);
  return (
    <section className="authorization">
      <h2 className="authorization__title">Вход</h2>
      <form className="authorization__form" onSubmit={props.onSubmit}>
        <input className="authorization__input" type="email" placeholder="Email" required />
        <input className="authorization__input" type="password" placeholder="Пароль" required />
        <button className="authorization__submit" type="submit">Войти</button>
      </form>
    </section>
  )
}