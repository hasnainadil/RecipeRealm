"use client"
import React from "react";
import Lottie from "lottie-react";
import burger from '@/assets/loading.json';
import styles from '@/styles/AnimationComponent.module.css'; // Adjust the path as needed

const loading = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className={`w-48 h-48 ${styles.bigger}`}>
        <Lottie animationData={burger} />
      </div>
    </div>
  );
};

export default loading;
