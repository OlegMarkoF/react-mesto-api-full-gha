// const BASE_URL = "https://auth.nomoreparties.co";
const BASE_URL = "https://api.markov.project.nomoredomains.work";

const sendRequest = (res) => {
  return res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`)
};

export const register = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password })
  })
    .then(sendRequest);
};

export const authorize = (email, password) => {
  return fetch(`${BASE_URL}/signin`, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then(sendRequest);
};

export const checkToken = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    credentials: "include",
    method: "GET",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    }
  })
  .then(sendRequest);
};
