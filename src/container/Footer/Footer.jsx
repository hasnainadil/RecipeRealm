import React from 'react';
import { FiFacebook, FiTwitter, FiInstagram } from 'react-icons/fi';

import { FooterOverlay, Newsletter } from '../../components';
import { images } from '../../constants';
import './Footer.css';
import Image from 'next/image';

const Footer = () => (
  <div className="app__footer section__padding" id="login">
    <FooterOverlay />
    <Newsletter />

    <div className="app__footer-links">
      <div className="app__footer-links_contact">
        <h1 className="app__footer-headtext">Contact Us</h1>
        <p className="p__opensans">Suhrawardy Hall & M A Rashid Hall, Buet.</p>
        <p className="p__opensans">+8801842686804</p>
        <p className="p__opensans">+8801716834699</p>
      </div>

      <div className="app__footer-links_logo">
        <Image loading = 'lazy' src={images.RR} alt="footer_logo" />
        <p className="p__opensans">&quot;The best way to find yourself is to lose yourself in the service of others.&quot;</p>
        <Image loading = 'lazy' src={images.spoon} className="spoon__img" />
        <div className="app__footer-links_icons">
          <FiFacebook />
          <FiTwitter />
          <FiInstagram />
        </div>
      </div>

      <div className="app__footer-links_work">
        <h1 className="app__footer-headtext">Active Hours</h1>
        <p className="p__opensans">Monday-Friday:</p>
        <p className="p__opensans">24/7</p>
        <p className="p__opensans">Saturday-Sunday:</p>
        <p className="p__opensans">24/7</p>
      </div>
    </div>

    <div className="footer__copyright">
      <p className="p__opensans">2023 RecipeRealm. All Rights reserved.</p>
    </div>

  </div>
);

export default Footer;
