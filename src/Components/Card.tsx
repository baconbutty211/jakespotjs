import React from 'react';
import Button from './Button';

export interface CardProps {
    img: {src: string, alt: string},
    title: string,
    text: string,
}

export default function Card({img: {src, alt}, title, text} : CardProps) {
  return (
    <div className="card">
      <img
        src={src}
        className="card-img-top"
        alt={alt}
      />
      <div className="card-body">
        <h5 className="card-title"> {title} </h5>
        <p className="card-text"> {text} </p>
      </div>
    </div>
  );
};