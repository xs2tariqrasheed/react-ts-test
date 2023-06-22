import axios from "axios";

const apiLocation = process.env.REACT_APP_BASE_URL;
const apiKey = process.env.REACT_APP_API_KEY;

if (!apiLocation) {
  throw new Error("REACT_APP_BASE_URL is not found");
}
console.log(`API LOCATION IS ${apiLocation}`);

const initAxiosGlobalConfigs = () => {
  axios.defaults.baseURL = apiLocation;
  axios.defaults.headers.common["X-API-KEY"] = apiKey;
  axios.defaults.headers.post["Content-Type"] = "application/json";
};

export default initAxiosGlobalConfigs;
