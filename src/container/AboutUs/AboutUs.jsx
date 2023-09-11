import React from 'react';

import { images } from '../../constants';
import './AboutUs.css';
import Image from 'next/image';

const AboutUs = () => (
  <div className="app__aboutus app__bg flex__center section__padding" id="about">
    <div className="app__aboutus-overlay flex__center">
    </div>

    <div className="app__aboutus-content flex__center">
      <div className="app__aboutus-content_about">
        <h1 className="headtext__cormorant">About Us</h1>
        <Image loading = 'lazy' src={images.spoon} alt="about_spoon" className="spoon__img" />
        <p className="p__opensans" style={{ color: 'silver', fontWeight: '600', fontFamily: 'Open Sans', fontSize: '16px' }}>Discover the heart behind RecipeRealm: a collective of food enthusiasts committed to sharing the joy and artistry of cooking.</p>
      </div>

      <div className="app__aboutus-content_knife flex__center">
        <Image loading = 'lazy' src={images.knife} alt="about_knife" />
      </div>

      <div className="app__aboutus-content_history">
        <h1 className="headtext__cormorant">Our History</h1>
        <Image loading = 'lazy' src={images.spoon} alt="about_spoon" className="spoon__img" />
        <p className="p__opensans" style={{ color: 'silver', fontWeight: '600', fontFamily: 'Open Sans', fontSize: '16px' }}>Crafting our legacy since inception, RecipeRealm has evolved into a dynamic space, celebrating culinary creativity and connections.</p>
      </div>
    </div>
  </div>
);

export default AboutUs;
