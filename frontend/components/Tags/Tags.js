import React,{Fragment,useEffect,useState} from 'react';

import {getCookie} from "../../service/actions/auth";
import {createTag,getTags,deleteTagBySlug} from "../../service/actions/tag";

const Tags = () => {
    const [values,setValues] = useState({
        name: '',
        error: false,
        success: false,
        tags: [],
        removed: false,
        reload: false
    });

    const { name, error, success, tags, removed, reload } = values;
    const token = getCookie('token');

    useEffect(() => {
        loadTags();
    }, [reload]);
    const loadTags = () => {
        getTags().then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                setValues({ ...values, tags: data});
            }
        })
    };
    const showTags = () => {
        return tags.map((t, i) => {
            return (
                <button
                    onDoubleClick={() => deleteConfirm(t.slug)}
                    title="Double click to delete"
                    key={i}
                    className="btn btn-outline-primary mr-1 ml-1 mt-3"
                >
                    {t.name}
                </button>
            );
        });
    };
    const deleteConfirm = slug => {
        let answer = window.confirm(`Are you sure you want to delete this category ?`);
        if (answer) {
            deleteTag(slug)
        }
    };
    const deleteTag = slug => {
        deleteTagBySlug(slug, token).then(responseData => {
            if (responseData.error) {
                console.log(responseData.error);
            } else {
                setValues({ ...values, error: false, success: false, name: '', removed: !removed, reload: !reload });
            }
        })
    };
    const clickSubmit = e => {
        e.preventDefault();
        createTag({ name }, token).then(responseData => {
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
            return <p className="text-success">Tag is created</p>;
        }
    };
    const showError = () => {
        if (error) {
            return <p className="text-warning">Tag already exist</p>;
        }
    };

    const showRemoved = () => {
        if (removed) {
            return <p className="text-danger">Tag is removed</p>;
        }
    };

    const mouseMoveHandler = e => {
        setValues({ ...values, error: false, success: false, removed: '' });
    };

    const newTagForm = () => (
        <form onSubmit={clickSubmit}>
            <div className="form-group">
                <label className="text-muted">Tag Name</label>
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
                {newTagForm()}
                {showTags()}
                <p className="text-center"><small>For remove tag click twice on tag name</small></p>
            </div>
        </Fragment>
    );
};

export default Tags;
