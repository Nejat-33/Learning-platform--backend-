import axios from "axios";

export const chapaAPI = axios.create({
  baseURL: "https://api.chapa.co/v1",
  headers: {
    Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`
  }
});