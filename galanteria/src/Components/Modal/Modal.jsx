// Create a new component for the modal
import React from 'react';
import './Modal.scss';

const Modal = ({ imageUrl, closeModal }) => {
  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal">
        <img src={imageUrl} alt="Full size" />
      </div>
    </div>
  );
};

export default Modal;
