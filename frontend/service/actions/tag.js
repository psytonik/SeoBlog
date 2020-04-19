import fetch from 'isomorphic-fetch';
import {API} from "../../config";

export const createTag = (tag,token)=>{
    return fetch(`${API}/tags`,{
        method:"POST",
        headers:{
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization:`Bearer ${token}`
        },
        body:JSON.stringify(tag)
    })
        .then(response=>{
            return response.json()
        })
        .catch(error=>console.error(error))
};
export const getTags = () =>{
    return fetch(`${API}/tags`,{
        method:"GET"
    })
        .then(response=>{
            return response.json()
        })
        .catch(error=>console.error(error))
};

export const getTagBySlug = (slug) =>{
    return fetch(`${API}/tags/${slug}`,{
        method:"GET"
    })
        .then(response=>{
            return response.json()
        })
        .catch(error=>console.error(error))
};

export const deleteTagBySlug = (slug,token) =>{
    return fetch(`${API}/tags/${slug}`,{
        method:"DELETE",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization:`Bearer ${token}`
        }
    })
        .then(response=>{
            return response.json()
        })
        .catch(error=>console.error(error))
};
