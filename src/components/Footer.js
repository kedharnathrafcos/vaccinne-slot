import React from "react";

const Footer = () => {
  return (
    <div>
      <footer className="footer-distributed">
        <div className="footer-right">
          <a href="#">
            <i className="fa fa-facebook"></i>
          </a>
          <a href="#">
            <i className="fa fa-twitter"></i>
          </a>
          <a href="#">
            <i className="fa fa-linkedin"></i>
          </a>
          <a href="#">
            <i className="fa fa-github"></i>
          </a>
        </div>

        <div className="footer-left">
          <p className="footer-links">Simple footer</p>

          <p>Company Name &copy; 2015</p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
