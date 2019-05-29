import React from 'react';
import Modal from './component/modal'
import InputButton from './component/button'
import 'react-daypicker/lib/DayPicker.css';
import DayPicker from 'react-daypicker';

import './App.css';

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedEmployee: null,
            error: null,
            isLoaded: false,
            items: [],
			searchResult:[],
            modalShow: false,
            showData: false,
            day: ''
        };
        this.first_name = React.createRef();
        this.last_name = React.createRef();
        this.email = React.createRef();
        this.mobileNumber = React.createRef();
        this.searchKeyword = React.createRef();

    }
    componentDidMount() {
        var _savedEmployeeData = localStorage.getItem('myData');
        if (_savedEmployeeData) {
            this.setState({
                isLoaded: true,
                items: JSON.parse(_savedEmployeeData)
            });
        } else {
            fetch("https://api.myjson.com/bins/pkisp")
                .then(res => res.json())
                .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        items: result.users
                    });
                    localStorage.setItem('myData', JSON.stringify(this.state.items));
                },

                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
                )
        }
    }
    formatDate = (date) => {
        let originaldate = new Date(date);
        let formatdate = originaldate.getDate();
        let formatMonth = originaldate.getMonth() + 1;
        let formatYear = originaldate.getFullYear();
        return formatdate + "/" + formatMonth + "/" + formatYear
    }
    formatAge = (date) => {
        return (new Date()).getFullYear() - new Date(date).getFullYear();
    }
    toggleStatus = (status) => {
        var _newItems = JSON.parse(JSON.stringify(this.state.items));

        _newItems.map((item) => {
            if (status.email == item.email) {
                item.active = !status.active;
                this.setState({
                    ...this.state,
                    items: _newItems
                });
            }
        });
    }
    navigate = (item, index) => {
        localStorage.setItem('selectedIndex', index);
        this.props.history.push({
            pathname: '/detailsPage'
        })
    }
    filterResults=()=>{        
        var searchParam = this.searchKeyword.current.value;
        var _userDetails = JSON.parse(localStorage.getItem('myData'));
		var searchResult = _userDetails.filter((item) => {
            return item.email.toLowerCase().indexOf(searchParam.toLowerCase()) > -1 || item.first_name.toLowerCase().indexOf(searchParam.toLowerCase()) > -1;
        })
		this.setState({
                    ...this.state,
                    items: searchResult
                });
    }
    addNewUser = () => {
        let _selectedDate = this.state.day.toString();
        let _formatDate = _selectedDate.substr(_selectedDate.indexOf(' ') + 1);
        let _newDate = new Date(_formatDate);
        var _newUser = {
            "first_name": this.first_name.current.value,
            "last_name": this.last_name.current.value,
            "email": this.email.current.value,
            "phone": this.mobileNumber.current.value,
            "dob": _newDate,
            "active": true
        };
        var _items = JSON.parse(JSON.stringify(this.state.items));
        _items.push(_newUser);
        this.setState({
            ...this.state,
            items: _items,
        })
        this.hideModal();
        localStorage.setItem('myData', JSON.stringify(_items));
    }
    editUser = () => {
        var selectedData = this.state.selectedEmployee;
        var _updatedUser = {
            "first_name": this.first_name.current.value ? this.first_name.current.value : selectedData.first_name,
            "last_name": this.last_name.current.value ? this.last_name.current.value : selectedData.last_name,
            "email": selectedData.email,
            "phone": this.mobileNumber.current.value ? this.mobileNumber.current.value : selectedData.phone,
            "dob": selectedData.dob,
            "active": selectedData.active
        };
        var _updatedUserDetails = JSON.parse(JSON.stringify(this.state.items));

        _updatedUserDetails.forEach((item, index) => {
            if (selectedData.email == item.email) {
                _updatedUserDetails[index] = _updatedUser;
                this.setState({
                    ...this.state,
                    items: _updatedUserDetails
                }, function () {
                    localStorage.setItem('myData', JSON.stringify(_updatedUserDetails));
                });
            }
        });
        this.hideModal();
    }
    showModal = (item) => {
        if (item) {
            this.setState({
                ...this.state,
                showData: 'edit',
                selectedEmployee: item
            }, function () {
                this.first_name.current.value = this.state.selectedEmployee.first_name;
                this.last_name.current.value = this.state.selectedEmployee.last_name;
                this.email.current.value = this.state.selectedEmployee.email;
                this.mobileNumber.current.value = this.state.selectedEmployee.phone;
            });
        } else {
            this.setState({
                ...this.state,
                showData: 'add',
                selectedEmployee: null
            }, function () {
                this.first_name.current.value = '';
                this.last_name.current.value = '';
                this.email.current.value = '';
                this.mobileNumber.current.value = '';
            });
        }
        this.setState({ modalShow: true });
    }
    hideModal = () => {
        this.setState({ showData: null, modalShow: false });
    };
    render() {
        const { error, isLoaded, items, showData } = this.state;
        var self = this;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <React.Fragment>
                    <input type="text" placeholder="Search" className="searchBar" ref={this.searchKeyword} onBlur={this.filterResults}/>
                    <InputButton className="addButton" id="addUserButton" onClick={() => this.showModal()} value="Add New User" />
                    <table>
                        <tbody>
                            <tr>
                                <th>Name</th>
                                <th>Date Of Birth</th>
                                <th>Age</th>
                                <th>Email</th>
                                <th>Mobile</th>
                                <th>Active</th>
                                <th>Actions</th>
                            </tr>
                            {items.map((item, index) => (
                                <tr key={item.name}>
                                    <td className="pointer" onClick={function () { self.navigate(item, index) }}>{item.first_name} {item.last_name}</td>
                                    <td>{this.formatDate(item.dob)} </td>
                                    <td>{this.formatAge(item.dob)}</td>
                                    <td>{item.email}</td>
                                    <td>{item.phone}</td>
                                    <td>{item.active ? <p className="active">Active</p> : <p className="inactive">Inactive</p>}</td>
                                    <td>
                                        <span className="pointer" onClick={() => this.showModal(item)}>Edit/</span>
                                        <span className="pointer" onClick={function () { self.toggleStatus(item) }}>{item.active ? 'Deactivate' : 'Activate'}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Modal show={this.state.modalShow} handleClose={this.hideModal}>

                        <div className="container">
                            {showData === "edit" ?
                                <h1>Edit User</h1> : <h1>Add New User</h1>}
                            <hr />
                            <React.Fragment>
                                <label htmlFor="fname"><b>First Name</b></label>
                                <input type="text" placeholder="Enter First Name" name="firstName" ref={this.first_name} required />

                                <label htmlFor="lname"><b>Last Name</b></label>
                                <input type="text" placeholder="Enter Last Name" name="lastName" ref={this.last_name} required />
                                {showData === "edit" ?
                                    <React.Fragment>
                                        <label htmlFor="email"><b>Email</b></label>
                                        <input type="text" placeholder="Enter Email" name="email" ref={this.email} disabled /> </React.Fragment>
                                    :
                                    <React.Fragment>
                                        <label htmlFor="email"><b>Email</b></label>
                                        <input type="text" placeholder="Enter Email" name="email" ref={this.email} required />
                                    </React.Fragment>
                                }

                                <label htmlFor="mobno"><b>Mobile Number</b></label>
                                <input type="text" placeholder="Enter Mobile Number" ref={this.mobileNumber} name="mobNumber" required />
                                {showData === "edit" ? null :
                                    <React.Fragment>
                                        <label htmlFor="mobno"><b>Date Of Birth</b></label>
                                        <DayPicker
                                            onDayClick={(day) => this.setState({ day })} /></React.Fragment>}
                                <hr />

                                {showData === "edit" ?
                                    <InputButton className="registerbtn" onClick={this.editUser} value="Save" />
                                    :<InputButton className="registerbtn" onClick={this.addNewUser} value="Add" />}
                                <InputButton className="registerbtn" onClick={this.hideModal} value="Cancel" />

                            </React.Fragment>

                        </div>
                    </Modal>
                </React.Fragment>
            );
        }
    }
}

export default HomePage;
