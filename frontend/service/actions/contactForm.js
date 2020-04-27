import fetch from 'isomorphic-fetch';
import {API} from "../../config";

export const sendContactMessage = (data) => {
    let emailContactEndpoint;
    if (data.authorEmail) {
        emailContactEndpoint = `${API}/contact-blog-author`;
    } else {
        emailContactEndpoint = `${API}/contact`
    }
    return fetch(emailContactEndpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            return response.json()
        })
        .catch(error => console.error(error))
};
