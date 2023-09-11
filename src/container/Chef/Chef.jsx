import React from 'react';

import { SubHeading } from '../../components';
import { images } from '../../constants';
import './Chef.css';
import Image from 'next/image';

const Chef = () => (
  <div className="app__bg app__wrapper section__padding">
    <div className="app__wrapper_img app__wrapper_img-reverse">
      <Image loading = 'lazy' src={images.tias} alt="chef_image" />
    </div>
    <div className="app__wrapper_info">
      <SubHeading title="Founder's word" />
      <h1 className="headtext__cormorant">What we believe in</h1>

      <div className="app__chef-content">
        <div className="app__chef-content_quote">
          <Image loading = 'lazy' src={images.quote} alt="quote_image" />
          <p className="p__opensans">A recipe has no soul, you as the cook must bring soul to the recipe.</p>
        </div>
        <p className="p__opensans"> For us, RecipeRealm is a realization of my culinary dreams – a place where ingredients become stories and cooking transforms into a universal language. Join our family of food enthusiasts in this delectable adventure! </p>
      </div>

      <div className="app__chef-sign">
        <p>Tasriad Tias & Hasnain Adil</p>
        <p className="p__opensans">Founders</p>
        <Image loading = 'lazy' src={images.sign} alt="sign_image" />
      </div>
    </div>
  </div>
);

export default Chef;
