import React from 'react';
import Button from './../button'
import './modal.css';
const Modal = (props) => {
  const { handleClose, show, customClassName, children } = props;
  const showHideClassName = show ? "modal display-block" : "modal display-none";
  const customClass = customClassName ? customClassName : null;
  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        <Button className="close-button" onClick={handleClose} value="X" />
        <div className={customClass}>{children}</div>
      </section>
    </div>
  );
};

export default Modal;