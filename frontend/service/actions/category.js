import fetch from 'isomorphic-fetch';
import {API} from "../../config";
import {handleResponse} from "./auth";

export const createCategory = (category,token) =>{
    return fetch(`${API}/category`,{
        method:"POST",
        headers:{
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization:`Bearer ${token}`
        },
        body:JSON.stringify(category)
    })
        .then(response=>{
            handleResponse(response)
            return response.json()
        })
        .catch(error=>console.error(error))
};
export const getCategory = ()=>{
    return fetch(`${API}/category`,{
        method:"GET"
    })
        .then(response=>{
            return response.json()
        })
        .catch(error=>console.error(error))
};
export const getCategoryBySlug = (slug) =>{
    return fetch(`${API}/category/${slug}`,{
        method:"GET"
    })
        .then(response=>{
            return response.json()
        })
        .catch(error=>console.error(error))
};
export const deleteCategoryBySlug = (slug,token)=>{
    return fetch(`${API}/category/${slug}`,{
        method:"DELETE",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization:`Bearer ${token}`
        }
    })
        .then(response=>{
            handleResponse(response)
            return response.json()
        })
        .catch(error=>console.error(error))
};
