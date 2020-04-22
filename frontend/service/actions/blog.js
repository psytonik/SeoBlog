import fetch from 'isomorphic-fetch';
import {API} from "../../config";
import queryString from 'query-string';
import {isAuth} from './auth';

/// Write new blog story
export const createBlog = (blog, token) => {

    let createBlogEndpoint;
    if (isAuth() && isAuth().role === 1) {
        createBlogEndpoint = `${API}/blog`;
    } else {
        createBlogEndpoint = `${API}/user/blog`
    }

    return fetch(`${createBlogEndpoint}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        },
        body: blog
    })
        .then(response => {
            return response.json()
        })
        .catch(error => console.error(error))
};

/// Get all blog's to main page of site with categories and tags
export const getBlogWithCatsAndTags = (skip,limit) => {
    const data = {
        limit,skip
    };
    return fetch(`${API}/blog-cat-tag`,{
        method:"POST",
        headers:{
            Accept: "application/json",
            'Content-Type':'application/json'
        },
        body:JSON.stringify(data)
    })
        .then(response=>{
            return response.json()
        })
        .catch(error=>console.error(error))
};

/// get single blog
export const getSingleBlog = (slug) => {
  return fetch(`${API}/blog/${slug}`,{method:'GET'})
      .then(response=>{
          return response.json();
      })
      .catch(error=>console.error(error))
};

/// Get related blog
export const relatedBlog = blog => {
  return fetch(`${API}/blog/related`,{
      method:"POST",
      headers:{
          Accept: "application/json",
          'Content-Type':'application/json'
      },
      body:JSON.stringify(blog)
  })
      .then(response => {
          return response.json()
      })
      .catch(error=>console.error(error))
};

/// List of all blog's for admin page
export const listOfBlog = (username) => {
    let listBlogEndpoint;
    if (username) {
        listBlogEndpoint = `${API}/${username}/blog`;
    } else {
        listBlogEndpoint = `${API}/blog`
    }
    return fetch(`${listBlogEndpoint}`, {method: "GET"})
        .then(response => {
            return response.json()
        })
        .catch(error => console.error(error))
};

/// Remove exiting blog
export const removeBlog = (slug,token) => {
    let removeBlogEndpoint;
    if (isAuth() && isAuth().role === 1) {
        removeBlogEndpoint = `${API}/blog/${slug}`;
    } else {
        removeBlogEndpoint = `${API}/user/blog/${slug}`
    }

    return fetch(`${removeBlogEndpoint}`, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {
            return response.json()
        })
        .catch(error=>console.error(error))
};

/// Update blog
export const updateBlogBySlug = (slug,blog,token) => {
    let updateBlogEndpoint;
    if (isAuth() && isAuth().role === 1) {
        updateBlogEndpoint = `${API}/blog/${slug}`;
    } else if (isAuth() && isAuth().role === 0) {
        updateBlogEndpoint = `${API}/user/blog/${slug}`
    }
    return fetch(`${updateBlogEndpoint}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        },
        body: blog
    })
        .then(response => {
            return response.json()
        })
        .catch(error=>console.error(error))
};

/// Search in blog
export const listOfBlogSearch = params => {
    let query = queryString.stringify(params);
    return fetch(`${API}/blogs/search?${query}`, {
        method: 'GET'
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};
