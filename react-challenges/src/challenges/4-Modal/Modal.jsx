import React, { useEffect, useRef } from "react";
import Portal from "./Portal";

export default function Modal({ children, onClose }) {
  const modalRef = useRef(null);

  useEffect(() => {
    // Trap focus and handle Escape key
    const handleKeyDown = (e) => {
      const focusableModalElements = modalRef.current
        ? modalRef.current.querySelectorAll(
            'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
          )
        : [];
      const firstElement = focusableModalElements[0];
      const lastElement = focusableModalElements[focusableModalElements.length - 1];

      // Trap Tab key inside modal
      if (e.key === "Tab" && focusableModalElements.length) {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }

      // Close modal on Escape key
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    // Focus the first focusable element when modal opens
    const focusableModalElements = modalRef.current
      ? modalRef.current.querySelectorAll(
          'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
        )
      : [];
    if (focusableModalElements.length) {
      focusableModalElements[0].focus();
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  return (
    <Portal>
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        style={{
          position: "fixed",
          top: "30%",
          left: "30%",
          background: "black",
          padding: "2rem",
          border: "1px solid white",
          zIndex: 1000,
          color: "white",
        }}
      >
        {children}
      </div>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.5)",
          zIndex: 999,
        }}
      />
    </Portal>
  );
}