import fetch from 'isomorphic-fetch';
import {API} from "../../config";
import {handleResponse} from "./auth";

export const getPublicUserProfile = username => {
    return fetch(`${API}/user/${username}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json'
        }
    })
        .then(response => {
            return response.json()
        })
        .catch(error => console.error(error))
}

export const getUserProfile = token => {
    return fetch(`${API}/user/profile`,{
        method:'GET',
        headers:{
            Accept:'application/json',
            Authorization:`Bearer ${token}`
        }
    })
        .then(response=>{
            return response.json()
        })
        .catch(error=>console.error(error))
};

export const editUserProfile = (token,user) => {
    return fetch(`${API}/user/edit`,{
        method:'PUT',
        headers:{
            Accept:'application/json',
            Authorization:`Bearer ${token}`
        },
        body:user
    })
        .then(response=>{
            handleResponse(response)
            return response.json()
        })
        .catch(error=>console.error(error))
};
