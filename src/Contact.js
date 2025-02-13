/**
 * Contact.js
 *
 * This is a simple **Contact Page Component** for the React application.
 * - Displays a heading and an email address for inquiries.
 * - Serves as a static information page for users to contact the creator.
 */

import React from "react";

function Contact() {
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Contact</h1>
      <p>
        Feel free to reach out at: <strong>bengertes@gmail.com</strong>
      </p>
    </div>
  );
}

export default Contact;
