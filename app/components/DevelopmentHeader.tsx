"use client"
import React from 'react';

const DevelopmentHeader = () => {
  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md shadow-lg animate-pulse-shadow">
      <h1 className="text-lg font-bold text-center">
        This project is under active development. This is a testing version.
      </h1>
    </div>
  );
};

export default DevelopmentHeader;
