import React, { useState } from 'react';
import './moreButton.css'

export const MoreButton = ({ items, icon: Icon, label }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={{ position: 'relative' }} className='more-button'>
      <button onClick={handleClick}>
        <span>{label}</span>
        <Icon />
      </button>
      {isOpen && (
        <div style={{ position: 'absolute', backgroundColor: 'white', boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)' }}>
          {items.map((item) => (
            <div key={item.label} className="item" onClick={() => {
              item.onClick();
              handleClick();
            }}>
              <img src={process.env.PUBLIC_URL + '/' + item.icon} alt={item.label}/>
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
