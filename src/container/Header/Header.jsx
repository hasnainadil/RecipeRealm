import React from 'react';

import { SubHeading } from '../../components';
import { images } from '../../constants';
import './Header.css';
import Image from 'next/image';

const Header = () => (
  <div className="app__header app__wrapper section__padding" id="home">
    <div className="app__wrapper_info">
      <SubHeading title="Cook, Share, Inspire" />
      <h1 className="app__header-h1">A Realm of Flavorful Stories</h1>
      <p className="p__opensans" style={{ margin: '2rem 0' }}>From kitchens to conversations, RecipeRealm unites foodies worldwide. Elevate your dishes and your connections today </p>
    </div>

    <div className="app__wrapper_img">
      <Image src={images.welcome} alt="header_img" loading = 'lazy' />
    </div>
  </div>
);

export default Header;
