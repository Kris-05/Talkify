import { HOST } from "@/utils/apiRoutes";
import axios from "axios";

export const apiClient = axios.create({
  baseURL: HOST,
});
