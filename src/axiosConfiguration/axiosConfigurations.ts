import axios from 'axios';

const axiosConfiguration = axios.create({
  baseURL: 'https://localhost:44332'
});

export default axiosConfiguration;