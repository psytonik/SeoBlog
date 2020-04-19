import React, {useState, Fragment} from 'react';
import Link from 'next/link';
import {listOfBlogSearch} from '../../service/actions/blog';
import {FormGroup,Input,Button,Row,Col,Form} from "reactstrap";

const SearchComponent = () => {
    const [values,setValues] = useState({
        search:undefined,
        results:[],
        searched:false,
        message:''
    });
    const {search,searched,results,message} = values;

    const searchSubmit = e => {
        e.preventDefault();
        listOfBlogSearch({search})
            .then(data=>{
                setValues({...values,results: data, searched: true, message: `${data.length} blogs found`})

            })
    };
    const handleChange = e => {
        setValues({...values, search: e.target.value, searched: false, results: []})
    };
    const searchedBlog = (results = []) => {
        return (
            <div className="jumbotron bg-white">
                {message && <p className="pt-4 text-muted font-italic">
                    {message}
                </p>}
                {results.map((blog,i)=>{
                    return (
                        <div key={i}>
                            <Link href={`/blog/${blog.slug}`}>
                                <a className="text-primary">{blog.title}</a>
                            </Link>
                        </div>
                    )
                })}
            </div>
        )
    };

    const searchForm = () => (
        <Fragment>
            <Form onSubmit={searchSubmit}>
                <FormGroup>
                    <Row>
                        <Col md={8}>
                            <Input type="search" placeholder="Search" onChange={handleChange} />
                        </Col>
                        <Col md={4}>
                            <Button type="submit" outline block color="primary">Search</Button>
                        </Col>
                    </Row>
                </FormGroup>
            </Form>
        </Fragment>
    );

    return (
        <div className="container-fluid">
            <div className="pt-3 pb-5">
                {searchForm()}
                {searched && <div style={{marginTop:'-90px',marginBottom:'-80px'}}>
                    {searchedBlog(results)}
                </div>}
            </div>
        </div>
    );
};

export default SearchComponent;
