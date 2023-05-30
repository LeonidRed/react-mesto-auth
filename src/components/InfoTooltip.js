export default function InfoTooltip(props) {
  // console.log(props);
  return (
    // <div className={`popup popup-${props.name} ${props.isOpen ? "popup_opened" : ""}`}>
    <div className={`popup ${props.isOpen ? "popup_opened" : ""}`}>
      <div className="popup__container">
        {/* <img className="popup__icon" src={props.image} alt={props.title} /> */}
        <img className="popup__icon" src='./images/goodAuth.png' alt='авторизация прошла успешно' />
        {/* <h2 className="popup__title">{props.title}</h2> */}
        <h2 className="popup__title">Вы успешно зарегистрировались</h2>
      </div>
      <button
        className={`popup__button-exit popup__button-${props.name}`}
        type="button"
        aria-label="Кнопка закрыть окно редактирования"
        onClick={props.onClose}>
      </button>
    </div >
  )
}