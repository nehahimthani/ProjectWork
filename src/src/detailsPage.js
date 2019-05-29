import React from 'react';

export default class DetailsPage extends React.Component {
    constructor(props) {
        super(props);
        this.showData = {}
    }
    goBack = () => {
        window.history.back()
    }
    render() {
        var selectedIndex = localStorage.getItem('selectedIndex');
        var _savedEmployeeData = JSON.parse(localStorage.getItem('myData'));
        this.showData = _savedEmployeeData[selectedIndex];
        return (
            <React.Fragment>
                <i class="fa fa-arrow-left fa-3x" aria-hidden="true" onClick={this.goBack}></i>
                <h1>USER DETAILS PAGE</h1>
                <table>
                    <tbody>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Mobile</th>
                        </tr>
                        <tr>
                            <td>{this.showData.first_name} {this.showData.last_name}</td>
                            <td>{this.showData.phone}</td>
                            <td>{this.showData.email}</td>

                        </tr>

                    </tbody>
                </table>
            </React.Fragment>
        );
    }
}