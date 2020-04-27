import fetch from 'isomorphic-fetch';
import {API} from "../../config";
import cookie from 'js-cookie';
import Router from 'next/router';

/**
 *
 * @param response
 */
export const handleResponse = response => {
    if (response.status === 401) {
        signOut(() => {
            Router.push({
                pathname: '/signin',
                query: {message: 'Your session is expired, please Sign In'}
            })
        })
    }
};
/**
 * REGISTER USER AND SAVE IN DB
 * @param user
 * @returns {Promise<T>}
 */
export const signUp = user => {
    return fetch(`${API}/auth/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify(user)
    })
        .then(response => {
            return response.json()
        })
        .catch(error=>{
            console.log(error)
        })
};
/**
 * GET REGISTERED USER FROM DB
 * @param user
 * @returns {Promise<T>}
 */
export const signIn = user=> {
    return fetch(`${API}/auth/signin`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify(user)
    })
        .then(response=>{
            return response.json()
        })
        .catch(error=>{
            console.log(error)
        })
};
/**
 * SIGN OUT USER
 * @param next = callback to redirect user
 */
export const signOut = next => {
    removeCookie('token');
    removeLocalStorage('user');
    next();
    return fetch(`${API}/auth/signout`,{
        method:'GET'
    })
        .then(response=>{
            console.log('sign out success')
        })
        .catch(error=>{
            console.error(error)
        })
};
/**
 * SET COOKIE
 * @param key
 * @param value
 */
export const setCookie = (key,value) => {
    if(process.browser){
        cookie.set(key,value,{
            expires:1
        })
    }
};
/**
 * REMOVE COOKIE
 * @param key
 */
export const removeCookie = key => {
    if(process.browser){
        cookie.remove(key,{
            expire:''
        })
    }
};
/**
 * GET COOKIE
 * @param key
 */
export const getCookie = key => {
    if(process.browser){
        return cookie.get(key)
    }
};
/**
 * SET COOKIE TO LOCALSTORAGE
 * @param key
 * @param value
 */
export const setLocalStorage = (key,value) => {
    if(process.browser){
        localStorage.setItem(key,JSON.stringify(value))
    }
};
/**
 * REMOVE COOKIE FROM LOCALSTORAGE
 * @param key
 */
export const removeLocalStorage = key => {
    if(process.browser){
        localStorage.removeItem(key)
    }
};
/**
 * AUTHENTICATE USER BY PASS DATA TO COOKIE AND LOCALSTORAGE
 * @param data = user token
 * @param next = callback
 */
export const authenticateUser = (data,next)=>{
    setCookie('token',data.token);
    setLocalStorage('user',data.user);
    next();
};
/**
 * CHECK IF USER AUTHENTICATED
 * @returns boolean from local storage or return false
 */
export const isAuth = () => {
    if(process.browser){
        const cookieChecked = getCookie('token');
        if(cookieChecked){
            if(localStorage.getItem('user')){
                return JSON.parse(localStorage.getItem('user'))
            } else {
                return false
            }
        }
    }
};

export const updateUserInLocalStorage = (user,next) => {
    /// checking if this is client side
    if (process.browser) {
        if (localStorage.getItem('user')) {
            let auth = JSON.parse(localStorage.getItem('user'));
            auth = user;
            localStorage.setItem('user', JSON.stringify(auth))
            next()
        }
    }
};
export const forgotPassword = email => {
    return fetch(`${API}/auth/forgot-password`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({email})
    })
        .then(response => {
            return response.json()
        })
        .catch(error => {
            console.error(error)
        })
}

export const resetPassword = resetInfo => {
    return fetch(`${API}/auth/reset-password`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify(resetInfo)
    })
        .then(response => {
            return response.json()
        })
        .catch(error => {
            console.error(error)
        })
}
