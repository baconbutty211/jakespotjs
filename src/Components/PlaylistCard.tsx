import React from 'react';
import Button from './Button';
import Card, { CardProps } from './Card';

interface PlaylistCardProps extends CardProps {
    onClick: () => void;
}

export default function PlaylistCard({onClick, ...rest}: PlaylistCardProps) {
  return (
    <button onClick={onClick}>
        <Card {...rest} />
    </button>
  );
};