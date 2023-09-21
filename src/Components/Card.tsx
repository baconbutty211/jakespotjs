import React from 'react';
import Button from './Button';

export interface CardProps {
    img: {src: string, alt: string, height: number, width: number},
    title: string,
    text?: string,
    footer?: string,
}

export default function Card({img: {src, alt, height, width}, title, text, footer} : CardProps) {
  return (
    <div className="card" style={{display: 'inline-flex', width: width}}>
      <img
        src={src}
        className="card-img-top"
        alt={alt}
        height={height}
        width={width}
      />  
      <div className="card-body">
        <h5 className="card-title"> {title} </h5>
        <p className="card-text"> {text} </p>
      </div>
      {
        (footer == undefined) ? <></> : 
        <div className='card-footer'>
          <small className='text-muted'> {footer} </small>
        </div>
      }
    </div>
  );
};