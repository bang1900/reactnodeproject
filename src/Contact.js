/**
 * Contact.js
 *
 * A simple page that shows contact details.
 */
import React from "react";
import "./css/Contact.css";

function Contact() {
  // Renders a container with a heading and an email address
  return (
    <div className="contact-container">
      <h1 className="contact-title">Contact</h1>
      <p className="contact-text">
        Feel free to reach out at: <strong>bengertes@gmail.com</strong>
      </p>
    </div>
  );
}

export default Contact;
