import axios from 'axios';

const BASE_URL = 'http://localhost:5001/rest/api';

export const fetchCustomerType = () => axios.get(`${BASE_URL}/customer-type`);
export const fetchAccountIndustry = () => axios.get(`${BASE_URL}/account-industry`);
export const fetchTeam = () => axios.get(`${BASE_URL}/team`);
export const fetchACVRange = () => axios.get(`${BASE_URL}/acv-range`);
