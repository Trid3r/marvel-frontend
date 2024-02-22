import axios from "axios";
import header from "./header";

const API_URL = "http://localhost:8080/logs";

const getAllLogs = (data) => {
  return axios.get(API_URL + "/findAll", { headers: header() });
};

const homeService = {
  getAllLogs
};

export default homeService;
