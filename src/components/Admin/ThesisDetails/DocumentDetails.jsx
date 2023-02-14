import axios from 'axios';
import { Panel } from 'primereact/panel';
import React, { useEffect, useRef, useState } from 'react'
import { MagnifyingGlass } from 'react-loader-spinner'
import moment from 'moment/moment';
import ReactReadMoreReadLess from "react-read-more-read-less";
import { Menubar } from 'primereact/menubar';
import { Divider } from 'primereact/divider';
import { Badge } from 'primereact/badge';
import swal from 'sweetalert';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';

function DocumentDetails(props) {


    var key = [];
    const [activeIndex, setActiveIndex] = useState();
    const [loading, setloading] = useState(true);
    const [Data, setData] = useState([]);
    const [statusview, setstatusview] = useState([]);
    const [Course, setCourse] = useState([]);
    const [authors, setauthor] = useState([])
    const toast = useRef();

    useEffect(() => {
        const id = props.match.params.id;
        axios.get(`/api/document/${id}`).then(res => {
            if (res.data.status === 200) {
                setData(res.data.document)
                setCourse(res.data.course)
                setauthor(res.data.author)
            }
            setloading(false)
        })
    }, [props.match.params.id]);





    if (loading) {
        return (
            <div className="d-flex justify-content-center w-100 align-items-center vh-100">
                <MagnifyingGlass
                    visible={true}
                    height="80"
                    width="80"
                    ariaLabel="MagnifyingGlass-loading"
                    wrapperStyle={{}}
                    wrapperClass="MagnifyingGlass-wrapper"
                    glassColor='#c0efff'
                    color='#e15b64'
                />
            </div>
        )
    }
    const statusChange = [
        { label: 'User', value: 'User' },
        { label: 'Admin', value: 'Admin' },
    ];
    const items = [
        {
            label: 'Edit',
            icon: 'pi pi-fw pi-pencil',
            url: `/admin/collection/edit/refid=${Data.id}`
        },
        {
            label: 'Return Page',
            url: '/admin/collection',
        },
    ];
    const handleChangeSave = (e) => {
        const data = {
            view: e.target.value,
        };

        const tmpid = props.match.params.id;
        axios.put(`/api/UpdateStatus/${tmpid}`, data).then(res => {
            if (res.data.status === 200) {
                toast.current.show({ severity: "success", summary: "Status Updated", detail: "Change View as" + " " + e.target.value })
                setTimeout(() => {
                    window.location.href = `/admin/collection/refid=${props.match.params.id}`;
                }, 1500);
            }
        }).catch((error) => {
            if (error.response.status === 500) {
                swal("Warning", error.response.statusText, 'warning');
            }
        })
    }
    const header = <Menubar model={items} end={
        <Dropdown className='p-dropdown p-dropdown-open' value={statusview} options={statusChange} onChange={handleChangeSave} placeholder="View as" />
    } />



    const splitwords = Data.keywords.split(",");

    for (let index = 0; index < splitwords.length; index++) {
        const element = splitwords[index].replace(""," ");

        key.push(element)
    }


    return (

        <Panel headerTemplate={header}>
            <Toast ref={toast} />
            <Divider align='left'>
                <Badge value={"Research Title Details"} severity="info"></Badge>
            </Divider>
            <div className='mb-3'>
                <ul>
                    <li className='text-color-code mb-3'><span>BarCode:  <span className='text-details'>{Data.reference_code}</span></span></li>
                    <li className='text-color-code mb-3'><span>Thesis Title:  <span className="text-details">{Data.title}</span></span></li>
                    <li className='text-color-code mb-3'><span>Subject Terms:  <span className="text-details">{key}</span></span></li>
                    <li className='text-color-code mb-3'><span>Document Type: <a className='text-danger' rel="noreferrer" href={`http://127.0.0.1:8000/${Data.information.file}`} target="_blank">{Data.title + "." + "pdf"}</a></span></li>
                    <li className='text-color-code mb-3'><span>Completed File: <a className='text-danger' rel="noreferrer" href={`http://127.0.0.1:8000/${Data.information.complete}`} target="_blank">{Data.title+" "+"Complete"+"." + "pdf"}</a></span></li>
                    <li className='text-color-code mb-3'><span>Abstract:  <p className='text-details'><ReactReadMoreReadLess
                        charLimit={200} readMoreText={"Read more ▼"}
                        readLessText={"Read less ▲"}
                    >
                        {Data.description}
                    </ReactReadMoreReadLess></p></span></li>
                    <li className='text-color-code mb-3'><span>Cite:  <span className="text-details">{
                        authors.map((daauthor) =>{
                            return (
                                <span>{daauthor.last_name+`,`} {daauthor.first_name.substring(0,1)+`.`} {daauthor.middle_name.substring(0,1)+`.`}  </span>
                            )
                        })

                    }</span>({Data.Year_Published}). {Data.title}</span></li>
                </ul>
            </div>
            <Divider align='left'>
                <Badge value={"Other Info"} severity="info"></Badge>
            </Divider>
            <div className='mb-3'>
                <ul>
                    <li className='text-color-code mb-3'><span>Place of Publication:  <span className='text-details'>{Data.information.publication}</span></span></li>
                    <li className='text-color-code mb-3'><span>Location:  <span className='text-details'>{Data.information.location}</span></span></li>
                    <li className='text-color-code mb-3'><span>Department:  <span className="text-details">{Course.dept}</span></span></li>
                    <li className='text-color-code mb-3'><span>Course:  <span className="text-details">{Course.cours}</span></span></li>
                    <li className='text-color-code mb-3'><span>Researcher:  <span className="text-details">{Data.information.adviser}</span></span></li>
                    <li className='text-color-code mb-3'><span>View As:  <span className="text-details">{Data.is_active_docu === 1 ? <Badge value="User" severity='success' /> : <Badge value="Admin" severity='danger' />}</span></span></li>
                    <li className='text-color-code mb-3'><span>Date of Import:  <span className='text-danger'><b>{moment(Data.created_at).format('MMM D YYYY ')}</b></span></span></li>
                    <li className='text-color-code mb-3'><span>Date of Published:  <span className='text-danger'><b>{Data.date_published}</b></span></span></li>
                </ul>
            </div>
        </Panel>

    )
}

export default DocumentDetails