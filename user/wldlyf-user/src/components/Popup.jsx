import React, { useEffect } from "react";
import './blast.css'; // Use the correct path for your CSS

export default function Modal({ isOpen, toggleModal, showOfferImage, offer }) {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isOpen]);

  if (!isOpen || !showOfferImage || !offer || !offer.image) return null;

  const closeModal = () => {
    toggleModal();
  };

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-transparent rounded-lg w-full max-w-md mx-4">
          <div className="px-6 py-4">
            <div className="relative flex justify-center">
              <img
                src={offer.image}
                alt={offer.title}
                onClick={closeModal}
                className="w-full h-auto cursor-pointer animate-gentle-flip"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
