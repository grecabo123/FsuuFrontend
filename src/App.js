import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Login from './components/Login'
import axios from 'axios'

// Private Routes
import PrivateAdmin from "./Private/PrivateAdmin";
import PrivateStudent from "./Private/PrivateStudent";
import PrivateDean from "./Private/PrivateDean";
import PrivateChairman from "./Private/PrivateChairman";
import { QueryClient, QueryClientProvider } from 'react-query';



axios.defaults.baseURL = "http://127.0.0.1:8000";
axios.defaults.headers.post['Content-Type'] = "application/json";
axios.defaults.headers.post['Accept'] = "application/json";

axios.defaults.withCredentials = true;

axios.interceptors.request.use(function (config) {
    const token = localStorage.getItem('auth_token');
    config.headers.Authorization = token ? `Bearer ${token}` : '';
    return config;
})

function App() {

    const client = new QueryClient();

    return (
        <QueryClientProvider client={client}>
            <Router>
                <Switch>
                    <Route exact path={'/'} component={Login}></Route>

                    {/* Admin */}
                    <PrivateAdmin path='/admin' name='admin' />
                    
                    {/* Student */}
                    <PrivateStudent path={'/student'} name="Student" />

                    {/* Dean */}
                    <PrivateDean path="/faculty" name="Faculty" />

                </Switch>
            </Router>
        </QueryClientProvider>
    )
}

export default App