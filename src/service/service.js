import axios from 'axios';


export const getTemplateList = params => {
  return axios.get(``, { params: params }).then(response => {
    return response;
  })
}
