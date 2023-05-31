import React from "react"
import Header from "./Header"
import Main from "./Main"
import Footer from "./Footer"
import PopupWithForm from "./PopupWithForm"
import ImagePopup from "./ImagePopup"
import { api } from "../utils/Api"
import { CurrentUserContext } from "../contexts/CurrentUserContext"
import EditProfilePopup from "./EditProfilePopup"
import EditAvatarPopup from "./EditAvatarPopup"
import AddPlacePopup from "./AddPlacePopup"
import Register from "./Register"
import Login from "./Login"
import ProtectedRoute from "./ProtectedRoute"
import InfoTooltip from "./InfoTooltip"
import { Route, Routes, useNavigate } from 'react-router-dom'
import * as Auth from '../utils/Auth.js'


function App() {
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = React.useState(false)
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = React.useState(false)
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = React.useState(false)
  const [isDeleteCardPopupOpen, setDeleteCardPopupOpen] = React.useState(false)
  const [selectedCard, setSelectedCard] = React.useState({ name: '', link: '' })
  const [currentUser, setCurrentUser] = React.useState({})
  const [cards, setCards] = React.useState([])
  const [isLogged, setIsLogged] = React.useState(false)
  const [isInfoTooltipPopupOpen, setInfoTooltipPopupOpen] = React.useState(false)
  const navigate = useNavigate()
  const [userEmail, setUserEmail] = React.useState('')
  const [userStatus, setUserStatus] = React.useState('')


  console.log(isLogged);

  React.useEffect(() => {
    Promise.all([api.getUserInfo(), api.getInitialCards()])
      .then(([user, cards]) => {
        setCurrentUser(user)
        setCards(cards)
      })
      .catch(err => console.log(err))
  }, [])

  // проверка токена
  React.useEffect(() => {
    tokenCheck();
  }, [])

  function handleEditProfileClick() {
    setEditProfilePopupOpen(true)
  }

  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true)
  }

  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(true)
  }

  // function handleDeleteCardClick() {
  //   setDeleteCardPopupOpen(true)
  // }

  function handleCardClick(card) {
    setSelectedCard({ name: `${card.name}`, link: `${card.link}` })
  }

  function handleAuthorizationClick() {
    setInfoTooltipPopupOpen(true)
  }

  function handleLikeClick(card) {
    // проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(i => i._id === currentUser._id)

    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c))
      })
      .catch(err => console.log(err))
  }

  function handleCardDelete(card) {
    api.deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id))
      })
      .catch(err => console.log(err))
  }

  function handleUpdateUser(data) {
    api.editProfile(data)
      .then((res) => {
        setCurrentUser(res)
        closeAllPopups()
      })
      .catch((err) => console.log(err))
  }

  function handleUpdateAvatar(data) {
    api.changeAvatar(data)
      .then((res) => {
        setCurrentUser(res)
        closeAllPopups()
      })
      .catch((err) => console.log(err))
  }

  function handleAddPlaceSubmit(data) {
    api.addCard(data)
      .then((newCard) => {
        setCards([newCard, ...cards])
        closeAllPopups()
      })
      .catch((err) => console.log(err))
  }

  function handleRegisterUser(email, password) {
    Auth.register(email, password)
      .then(() => {
        console.log('ok');
        navigate('/sign-in', { replace: true });
      })
      .catch((err) => console.log(err))
  }

  function handleLoginUser(email, password) {
    Auth.authorize(email, password)
      .then((token) => {
        if (token) {
          console.log('login ok')
          console.log(token)
          setIsLogged(true)
          navigate('/', { replace: true })
        }
      })
      .catch(err => console.log(err))
  }

  const tokenCheck = () => {
    // если у пользователя есть токен в localStorage, 
    // эта функция проверит, действующий он или нет
    if (localStorage.getItem('token')) {
      const jwt = JSON.parse(localStorage.getItem('token'))
      if (jwt) {
        // проверим токен
        Auth.checkToken(jwt.token).then((res) => {
          if (res) {
            console.log(res)
            const userData = {
              email: res.data.email
            }
            // авторизуем пользователя
            setIsLogged(true)
            setUserEmail(userData.email)
            setUserStatus('Выйти')
            navigate("/", { replace: true })
          }
        });
      }
    }
  }

  function closeAllPopups() {
    setEditProfilePopupOpen(false)
    setAddPlacePopupOpen(false)
    setEditAvatarPopupOpen(false)
    setDeleteCardPopupOpen(false)
    setSelectedCard({ name: '', link: '' })
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      < div className="page">
        <Header userEmail={userEmail} userStatus={userStatus} />
        <Routes>
          <Route path="/" element={<ProtectedRoute
            element={Main}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            // onDeleteButton={handleDeleteCardClick}
            onCardClick={handleCardClick}
            cards={cards}
            onCardLike={handleLikeClick}
            onCardDelete={handleCardDelete}
            isLogged={isLogged}
          />} />
          {/* <Route path="/" element={isLogged ? <Navigate to="/" replace /> : <Navigate to="/sign-in" replace />} /> */}
          <Route path="/sign-up" element={<Register onRegister={handleRegisterUser} />} />
          <Route path="/sign-in" element={<Login onLogin={handleLoginUser} />} />
        </Routes>

        {isLogged && <Footer />}

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />

        <PopupWithForm
          name="delete"
          title="Вы уверены?"
          buttonText="Да"
          isOpen={isDeleteCardPopupOpen}
          onClose={closeAllPopups}
        />

        <ImagePopup
          card={selectedCard}
          onClose={closeAllPopups}
        />

        <InfoTooltip
          isOpen={isInfoTooltipPopupOpen}
          // isOpen={true}
          onClose={closeAllPopups}
        />

      </div>
    </CurrentUserContext.Provider>
  )
}

export default App
