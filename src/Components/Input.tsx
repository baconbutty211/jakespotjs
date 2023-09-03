import React, { InputHTMLAttributes } from 'react';
import styled from 'styled-components';

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`;

const InputLabel = styled.label`
  color: #1db954; /* Spotify green color */
  font-size: 14px;
  margin-bottom: 5px;
`;

const InputField = styled.input`
  padding: 10px;
  border: 1px solid #1db954;
  border-radius: 5px;
  background-color: #000; /* Black background colour */
  color: #fff; /* White text colour */
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s ease-in-out;

  &:focus {
    border-color: #fff; /* White border color on focus */
  }
`;

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
  }


  export default function Input({ label, ...rest }: InputProps) {
  return (
    <InputWrapper>
      {label && <InputLabel>{label}</InputLabel>}
      <InputField {...rest} />
    </InputWrapper>
  );
};