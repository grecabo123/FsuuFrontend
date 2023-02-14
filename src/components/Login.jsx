import React, { useEffect } from 'react'
import GoogleLogin from 'react-google-login';
import { gapi } from "gapi-script";
import axios from 'axios';
import swal from 'sweetalert';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from 'primereact/button';

function Login() {

    const clientId = "412304294703-02o2nablkflhb4m1tql39br8ja2588ts.apps.googleusercontent.com";

    const history = useHistory();
    const [activeIndex, setActiveIndex] = useState(0)

    useEffect(() => {
        gapi.load("client:auth2", () => {
            gapi.auth2.init({ clientId: clientId });
        })
    }, []);

    const responseGoogle = (response) => {

        const data = {
            firstname: response.profileObj.givenName,
            lastname: response.profileObj.familyName,
            email: response.profileObj.email,
            ID: response.profileObj.googleId,
        }

        axios.get('/sanctum/csrf-cookie').then(response => {
            axios.post(`/api/login`, data).then(res => {
                if (res.data.status === 200) {
                    swal("Success", res.data.message, "success");
                    // Admin as library
                    if (res.data.role === 1) {
                        history.push("/admin");
                        localStorage.setItem("auth_token", res.data.token);
                        localStorage.setItem("auth_id", res.data.id);
                    }

                    // Students
                    else if (res.data.role === 2) {
                        localStorage.setItem("auth_token", res.data.token);
                        localStorage.setItem("auth_id", res.data.id);
                        history.push('/student');
                    }

                    // Dean
                    else if (res.data.role === 3 || res.data.role === 5) {
                        localStorage.setItem("auth_token", res.data.token);
                        localStorage.setItem("auth_id", res.data.id);
                        history.push('/faculty');
                    }
                }
                else if (res.data.status === 504) {
                    swal("Error", res.data.message, 'error');
                }
                else if (res.data.status === 404) {
                    swal("Warning", res.data.error, "warning");
                }
            }).catch((err) => {
                console.log(err)
                if (err.response.status === 500) {
                    swal("Error", "Internal Server", "error");
                }
            });
        }).catch((error) => {
            if (error.code === "ERR_NETWORK") {
                swal("Error", error.message, "error");
            }
        });
    }
    return (
        <React.Fragment>
            <section className="text-center d-flex flex-column min-vh-100">
                <div className="p-5 bg-image text-center">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="text-container">
                                    <h1 className='text-light title-head'>FATHER SATURNINO URIOS UNIVERSITY</h1>
                                    <br />
                                    <span className='text-light fs-4 font-weight-500'>THESIS COLLECTIONS</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container mt-3">
                    <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                        <TabPanel header="About">

                            <div className="row justify-content-flex-start">
                                <div className="text-container">
                                    <div className="float-start py-1 mt-2 text-parag">
                                        <h4 className='text-secondary fw-bold'>
                                            About
                                        </h4>
                                        <p className='text-parag text-secondary'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi possimus, quasi beatae eius ad, consequuntur cupiditate porro aperiam? Delectus perspiciatis provident, iusto inventore sunt corrupti. Perspiciatis cupiditate facilis earum quasi. Lorem ipsum dolor sit amet consectetur adipisicing, elit. Dolor nulla quam ipsam numquam error earum alias at sed natus veniam officiis quibusdam, aut iure consectetur voluptates eos excepturi dolores quo?</p>
                                    </div>
                                </div>
                            </div>

                        </TabPanel>
                        <TabPanel header="Contact">
                            <div className="text-container">
                                <div className="float-start py-1 mt-2 text-parag">
                                <h4 className='text-secondary fw-bold'>
                                        Contact
                                    </h4>
                                    <p className='text-parag text-secondary'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi possimus, quasi beatae eius ad, consequuntur cupiditate porro aperiam? Delectus perspiciatis provident, iusto inventore sunt corrupti. Perspiciatis cupiditate facilis earum quasi. Lorem ipsum dolor sit amet consectetur adipisicing, elit. Dolor nulla quam ipsam numquam error earum alias at sed natus veniam officiis quibusdam, aut iure consectetur voluptates eos excepturi dolores quo?</p>
                                </div>
                            </div>
                        </TabPanel>
                        <TabPanel header="Login">
                            
                            <div className="text-container">
                                <div className="mt-2 float-start">
                                    <GoogleLogin
                                        clientId={clientId}
                                        onSuccess={responseGoogle}
                                        onFailure={responseGoogle}
                                        theme="light"
                                        render={renderProps => (
                                            <Button className='p-button-danger p-button-sm me-3' label='Login' icon="pi pi-google" onClick={renderProps.onClick} disabled={renderProps.disabled}></Button>
                                        )}
                                        cookiePolicy={'single_host_origin'} />
                                </div>
                            </div>  
                            <div className="">
                                <p className='py-2 text-parag text-secondary'>You May Login By Using Urios Email.</p>
                            </div>
                        </TabPanel>
                    </TabView>
                </div>
            </section>
        </React.Fragment>
    )
}

export default Login