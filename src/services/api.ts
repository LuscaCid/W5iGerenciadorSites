import axios from "axios";

const routes = {
    dev : "http://localhost:4000/api",
    prod : "https://gerenciador.w5i.com.br/api",
}
export const api = axios.create({
    baseURL : import.meta.env["VITE_IS_DEV"] == "true" ?  routes.dev : routes.prod,
});