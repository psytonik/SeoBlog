import React,{ useState, useEffect,Fragment } from 'react';

import { getCookie } from '../../service/actions/auth';
import { createCategory, getCategory, deleteCategoryBySlug } from '../../service/actions/category';

const Category = () => {
    const [values, setValues] = useState({
        name: '',
        error: false,
        success: false,
        categories: [],
        removed: false,
        reload: false
    });

    const { name, error, success, categories, removed, reload } = values;
    const token = getCookie('token');

    useEffect(() => {
        loadCategories();
    }, [reload]);

    const loadCategories = () => {
        getCategory().then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                setValues({ ...values, categories: data});
            }
        })
    };

    const showCategories = () => {
        return categories.map((c, i) => {
            return (
                <button
                    onDoubleClick={() => deleteConfirm(c.slug)}
                    title="Double click to delete"
                    key={i}
                    className="btn btn-outline-primary mr-1 ml-1 mt-3"
                >
                    {c.name}
                </button>
            );
        });
    };

    const deleteConfirm = slug => {
        let answer = window.confirm(`Are you sure you want to delete this category ?`);
        if (answer) {
            deleteCategory(slug)
        }
    };

    const deleteCategory = slug => {
            deleteCategoryBySlug(slug, token).then(responseData => {
                if (responseData.error) {
                    console.log(responseData.error);
                } else {
                    setValues({ ...values, error: false, success: false, name: '', removed: !removed, reload: !reload });
                }
            })
    };

    const clickSubmit = e => {
        e.preventDefault();
        createCategory({ name }, token).then(responseData => {
            if (responseData.error) {
                setValues({ ...values, error: responseData.error, success: false });
            } else {
                setValues({ ...values, error: false, success: true, name: '', removed: false, reload: !reload });
            }
        });
    };

    const handleChange = e => {
        setValues({ ...values, name: e.target.value, error: false, success: false, removed: '' });
    };

    const showSuccess = () => {
        if (success) {
            return <p className="text-success">Category is created</p>;
        }
    };

    const showError = () => {
        if (error) {
            return <p className="text-warning">Category already exist</p>;
        }
    };

    const showRemoved = () => {
        if (removed) {
            return <p className="text-danger">Category is removed</p>;
        }
    };

    const mouseMoveHandler = e => {
        setValues({ ...values, error: false, success: false, removed: '' });
    };

    const newCategoryForm = () => (
        <form onSubmit={clickSubmit}>
            <div className="form-group">
                <label className="text-muted">Category Name</label>
                <input type="text" className="form-control" onChange={handleChange} value={name} required/>
            </div>
            <div className="form-group">
                <button type="submit" className="btn btn-primary form-control">
                    Create
                </button>
            </div>
        </form>
    );

    return (
        <Fragment>
            {showSuccess()}
            {showError()}
            {showRemoved()}
            <div onMouseMove={mouseMoveHandler}>
                {newCategoryForm()}
                {showCategories()}
                <p className="text-center"><small>For remove category click twice on category name</small></p>
            </div>
        </Fragment>
    );
};

export default Category;
