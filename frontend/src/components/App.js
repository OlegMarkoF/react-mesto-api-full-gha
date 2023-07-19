import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import "../index.css";
import Footer from "./Footer";
import Header from "./Header";
import Main from "./Main";
import Login from "./Login";
import Register from "./Register";
import InfoTooltip from "./InfoTooltip";
import DeletePopup from "./DeletePopup";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ImagePopup from "./ImagePopup";
import ProtectedRoute from "./ProtectedRoute";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { api } from "../utils/Api";
import successfully from "../images/popup/успешно.svg";
import unSuccessfully from "../images/popup/ошибка.svg";
import * as Auth from "../utils/Auth";

function App() {
  
  const navigate = useNavigate();

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [cardDelete, setCardDelete] = useState({});
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [cards, setCards] = useState([]);
  const [message, setMessage] = useState({text: '', img: ''});

  useEffect(() => {
    tokenCheck();
  }, []);

  useEffect(() => {
    if (loggedIn) {
      api.getUserInfo()
        .then((res) => {
          console.log(res);
          setCurrentUser(res);
        })
        .catch((err) => {
          console.log(err)
        });
      api.getInitialCards()
        .then((res) => {
          setCards(res);
        })
        .catch((err) => {
          console.log(err)
        });
    }
   }, [loggedIn]);
  
  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleCardDelete(card) {
    setIsDeletePopupOpen(true);
    setCardDelete(card);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsInfoTooltipPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsDeletePopupOpen(false);
    setSelectedCard(null);
  }

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(i => i === currentUser._id);
    // Отправляем запрос в API и получаем обновлённые данные карточки
    if (!isLiked) {
      api
        .likeCard(card._id)
        .then((newCard) => {
          setCards((state) =>
            state.map((c) => c._id === card._id ? newCard : c))
        })
        .catch((err) => console.log(err));
    } else {
      api
        .disLikeCard(card._id)
        .then((newCard) => {
          setCards((state) =>
            state.map((c) => c._id === card._id ? newCard : c))
        })
        .catch((err) => console.log(err));
    }
  }

  function handleDelete() { 
    api 
      .deleteCard(cardDelete._id) 
      .then(() => { 
        setCards(cards.filter((item) => item !== cardDelete)); 
        closeAllPopups(); 
      }) 
      .catch((err) => console.log(`Ошибка:${err}`)); 
  }

  function handleUpdateUser(name, about) {
    api
      .newUserInfo(name, about)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleUpdateAvatar(avatar) {
    api
      .editAvatar(avatar)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleAddPlaceSubmit(name, link) {
    api
      .addCard(name, link)
      .then((res) => {
        setCards([res, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
    navigate("/signin")
  }
  
  const handleLogin = (email, password) => {
    Auth.authorize(email, password)
      .then((res) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          setLoggedIn(true);
          setEmail(email);
          navigate("/");
        }
      })
      .catch(() => {
        setIsInfoTooltipPopupOpen(true);
        setMessage({text: 'Что-то пошло не так! Попробуйте ещё раз.', img: unSuccessfully})
      })
  }

  const handleRegister = (email, password) => {
    Auth.register(email, password)
      .then((res) => {
        console.log(res);
        if (res) {
          setLoggedIn(true);
          setIsInfoTooltipPopupOpen(true);
          setMessage({text: 'Вы успешно зарегистрировались!', img: successfully});
          setEmail(email);
          navigate("/signin")
        }
      })
      .catch(() => {
        setIsInfoTooltipPopupOpen(true);
        setMessage({text: 'Что-то пошло не так! Попробуйте ещё раз.', img: unSuccessfully})
      })
  }

  const tokenCheck = () => {
    let token = localStorage.getItem('token');
    if (token) {
      Auth.checkToken(token)
      .then((res) => {
        setLoggedIn(true);
        setEmail(res.email);
      })
      .catch((err) => {
        console.log(err)
      })
    }
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header email={email} handleLogout={handleLogout}/>
        <Routes>
          <Route
            path="/signin"
            element={<Login loggedIn={loggedIn} handleLogin={handleLogin} tokenCheck={tokenCheck} />}
          />
          <Route
            path="/signup"
            element={
              <Register loggedIn={loggedIn} handleRegister={handleRegister}/>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute path="/" loggedIn={loggedIn}>
                <Main
                  cards={cards}
                  onEditAvatar={handleEditAvatarClick}
                  onEditProfile={handleEditProfileClick}
                  onAddPlace={handleAddPlaceClick}
                  onCardClick={handleCardClick}
                  onCardDelete={handleCardDelete}
                  onCardLike={handleCardLike}
                  selectedCard={selectedCard}
                />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={loggedIn ? <Navigate to="/"/> : <Navigate to="/signin" replace/>}/>
        </Routes>
        <Footer />
        <ImagePopup onClose={closeAllPopups} card={selectedCard} />
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
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />
        <DeletePopup
          isOpen={isDeletePopupOpen}
          onClose={closeAllPopups}
          onCardDelete={handleDelete}
        />
        <InfoTooltip
          isOpen={isInfoTooltipPopupOpen}
          onClose={closeAllPopups}
          message={message}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
