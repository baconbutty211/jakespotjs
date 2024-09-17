import React from 'react';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

interface DropdownProps {
    id: string,
    title: string;
    items: string[];
    onSelect: (selectedItem: string | null) => void;
}

export default function CustomDropdown({ id, title, items, onSelect }: DropdownProps) {
  return (
    <DropdownButton
      id={id}
      title={title}
      variant="success" // Spotify green color
    >
      {items.map((item, index) => (
        <Dropdown.Item
          key={index}
          onClick={() => onSelect(item)}
          style={{ color: '#000' }} // Black color for items text
        >
          {item}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
};