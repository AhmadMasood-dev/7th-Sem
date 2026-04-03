import React from 'react'
import "./Card.css";

const Card = () => {
  return (
    <div className='cardContainer'>
    <div className="card">
      <img src="/assets/asset8.jpeg"  className="card-image" />
      <div className="card-content">
        <h2 className="card-title">title we wrtot</h2>
        <p className="card-description">our research, which addresses some of the most pressing issues facing society today…. Read </p>
      </div>
    </div>
     <div className="card">
     <img src="/assets/asset9.jpeg"  className="card-image" />
     <div className="card-content">
       <h2 className="card-title">title we wrtot</h2>
       <p className="card-description">our research, which addresses some of the most pressing issues facing society today…. Read </p>
     </div>
   </div>
    <div className="card">
    <img src="/assets/asset7.jpeg"  className="card-image" />
    <div className="card-content">
      <h2 className="card-title">title we wrtot</h2>
      <p className="card-description">our research, which addresses some of the most pressing issues facing society today…. Read </p>
    </div>
  </div>
    </div>
  );
};

export default Card;
