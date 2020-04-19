import React,{useState,useEffect} from 'react';
import Router from "next/router";
import {getCookie,isAuth,updateUserInLocalStorage} from "../../service/actions/auth";
import {getUserProfile,editUserProfile} from "../../service/actions/user";
import {Row,Col,Form,FormGroup,Input,Label,Button} from "reactstrap";
import Spinner from "../Spinner";
import {API} from "../../config";

const ProfileUpdateComponent = () => {
    const [values,setValues] = useState({
        username:'',
        username_for_photo: '',
        name:'',
        email:'',
        password:'',
        error:false,
        success:false,
        loading:false,
        photo:'',
        userData:process.browser && new FormData(),
        about:''
    });
    const token = getCookie('token');
    const {username,username_for_photo,name,email,password,error,success,loading,photo,userData,about} = values;
    useEffect(()=>{
        initUser()
        setValues({ ...values, userData: new FormData() });
    },[]);
    const initUser = () => {
        getUserProfile(token)
            .then(data=>{
                if (data.error){
                    setValues({...values,error: data.error})
                }else{
                    setValues({
                        ...values,
                        username: data.username,
                        username_for_photo: data.username,
                        name: data.name,
                        email: data.email,
                        about: data.about})
                }
            })
    };

    const handleChange = name => e => {
        const value = name === 'photo' ? e.target.files[0] : e.target.value;
        userData.set(name,value);
        setValues({...values,[name]:value,userData,error:false,success:false})
    };
    const handleSubmit = e => {
        e.preventDefault();
        setValues({...values,loading: true})
        editUserProfile(token,userData)
            .then(data=>{
                if(data.error){
                    setValues({...values,error: data.error,loading: false,success: false})
                }else {
                    updateUserInLocalStorage(data,()=>{
                        setValues({
                            ...values,
                            username: data.username,
                            name: data.name,
                            email: data.email,
                            about: data.about,
                            password: '',
                            success: true,
                            loading: false})
                        Router.push(`/profile/${username}`)
                    })
                }
            })
    }
    const profileUpdateForm = () => {
        return (
            <Form onSubmit={e=>handleSubmit(e)}>
                <FormGroup>
                    <Label className="btn btn-outline-primary">Profile Photo
                    <Input hidden type="file" accept="image/*" onChange={handleChange('photo')}/>
                    </Label>
                </FormGroup>
                <FormGroup>
                    <Label>User Name</Label>
                    <Input type="text" placeholder="User Name" value={username} onChange={handleChange('username')}/>
                </FormGroup>
                <FormGroup>
                    <Label>Full Name</Label>
                    <Input type="text" placeholder="Full Name" value={name} onChange={handleChange('name')}/>
                </FormGroup>
                {/*<FormGroup>*/}
                {/*    <Label>Email</Label>*/}
                {/*    <Input type="email" placeholder="Email" value={email} onChange={handleChange('email')}/>*/}
                {/*</FormGroup>*/}
                <FormGroup>
                    <Label>About</Label>
                    <Input type="textarea" placeholder="About" value={about} onChange={handleChange('about')}/>
                </FormGroup>
                <FormGroup>
                    <Label>Password</Label>
                    <Input type="password" placeholder="Password" value={password} onChange={handleChange('password')}/>
                </FormGroup>
                {showError()}
                {showSuccess()}
                {showLoading()}
                <Button type="submit" color="outline-success">Update</Button>
            </Form>
        )
    }
    const showError = () => {
        return  (
            <div className="alert alert-danger" style={{display:error ? '': "none"}}>
                {error}
            </div>
        )
    }
    const showSuccess = () => {
        return  (
            <div className="alert alert-success" style={{display:success ? '': "none"}}>
                {error}
            </div>
        )
    }
    const showLoading = () => {
        return loading ?(<Spinner/>):null;
    };
    return (
        <div className="container">
            <Row>
                <Col md={4}>
                    <img src={`${API}/user/photo/${username}`}
                         alt={name}
                         style={{maxHeight:'auto',maxWidth:'100%'}}
                         className="img img-fluid img-thumbnail mb-3"
                    />
                </Col>
                <Col md={8} className="mb-5">
                    {profileUpdateForm()}
                </Col>
            </Row>
        </div>
    );
};

export default ProfileUpdateComponent;
