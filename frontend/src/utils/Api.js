class Api {
  constructor({ baseUrl }) {
    this.url = baseUrl;
  }

  _sendRequest(res) {
    if (res.ok) {
      return res.json()
    }
    return Promise.reject(`Ошибка: ${res.status}`)
  };

  getInitialCards() {
    return fetch(`${this.url}/cards`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(this._sendRequest)
  }

  getUserInfo() {
    return fetch(`${this.url}/users/me`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(this._sendRequest)
  }

  newUserInfo(data) {
    return fetch(`${this.url}/users/me`, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        name: data.name,
        about: data.about,
      })
    })
    .then(this._sendRequest)
  }
  
  addCard(data) {
    return fetch(`${this.url}/cards`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        name: data.name,
        link: data.link,
      }),
    })
    .then(this._sendRequest)
  }

  deleteCard(id) {
    return fetch(`${this.url}/cards/${id}`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('token')}`
      },
    })
    .then(this._sendRequest)
  }

  editAvatar({avatar}) {
    return fetch(`${this.url}/users/me/avatar`, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        avatar: avatar
      }),
    })
    .then(this._sendRequest)
  }

  likeCard(id) {
    return fetch(`${this.url}/cards/${id}/likes`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('token')}`
      },
    })
    .then(this._sendRequest)
  }

  disLikeCard(id) {
    return fetch(`${this.url}/cards/${id}/likes`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('token')}`
      },
    })
    .then(this._sendRequest)
  }
  
}

export const api = new Api({
  baseUrl: 'https://api.markov.project.nomoredomains.work',
});

// export const api = new Api({
//   baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-62',
//   headers: {
//     'Content-Type': 'application/json',
//     authorization: 'f19d5955-fde2-4669-b21e-ba1c6a5901ef'
//   }
// });