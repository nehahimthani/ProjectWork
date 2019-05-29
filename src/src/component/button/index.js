import React from 'react'

const Button = (props) => {
    const { className, value, id, onClick } = props;
    return (
        <React.Fragment>
            <button className={className} id={id} onClick={onClick}> {value} </button>
        </React.Fragment>
    )
}

export default Button;