import React from 'react';
import { Link } from 'react-router-dom';
import backIcon from '@images/back-icon.svg';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm py-2">
      <div className="px-4 sm:px-6 lg:px-8 flex justify-between items-center w-full">
        <h1 className="ml-5 text-lg font-bold text-[#23AEB1]" style={{ fontFamily: 'Fredoka One' }}>
          Get Sport!
        </h1>
        <Link to="/" className="flex items-center text-gray-600 hover:text-gray-800">
          <img src={backIcon} alt="Back" className="w-5 h-5 mr-2" />
          Quay lại
        </Link>
      </div>
    </header>
  );
};

export default Header;
