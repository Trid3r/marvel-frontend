import axios from "axios";
import header from "./header";

const API_URL = "http://localhost:8080/characters";

const getAllCharacters = (data) => {
  return axios.get(API_URL + "/findAll?limit=" + data.limit + "&offset=" + data.offset, { headers: header() });
};

const getCharactersById = (id) => {
  return axios.get(API_URL + "/findById?id=" + id, { headers: header() });
};

const homeService = {
  getAllCharacters,
  getCharactersById
};

export default homeService;
