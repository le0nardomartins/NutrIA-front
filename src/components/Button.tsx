import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

const StyledButton = styled(motion.button)<{
  variant: string;
  size: string;
  fullWidth: boolean;
  disabled: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  border-radius: 9999px;
  transition: all 0.2s ease;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${props => (props.disabled ? 0.7 : 1)};
  width: ${props => (props.fullWidth ? '100%' : 'auto')};
  
  /* Size variants */
  padding: ${props => {
    switch (props.size) {
      case 'sm': return '0.5rem 1rem';
      case 'lg': return '0.75rem 2rem';
      default: return '0.625rem 1.5rem';
    }
  }};
  
  font-size: ${props => {
    switch (props.size) {
      case 'sm': return '0.875rem';
      case 'lg': return '1.125rem';
      default: return '1rem';
    }
  }};
  
  /* Color variants */
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background-color: #4CAF50;
          color: white;
          border: none;
          &:hover:not(:disabled) {
            background-color: #43A047;
          }
        `;
      case 'secondary':
        return `
          background-color: #8BC34A;
          color: white;
          border: none;
          &:hover:not(:disabled) {
            background-color: #7CB342;
          }
        `;
      case 'accent':
        return `
          background-color: #FF9800;
          color: white;
          border: none;
          &:hover:not(:disabled) {
            background-color: #FB8C00;
          }
        `;
      case 'outline':
        return `
          background-color: transparent;
          color: #4CAF50;
          border: 2px solid #4CAF50;
          &:hover:not(:disabled) {
            background-color: rgba(76, 175, 80, 0.1);
          }
        `;
      default:
        return '';
    }
  }}
`;

const LoadingSpinner = styled.div`
  width: 1em;
  height: 1em;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
  margin-right: 0.5rem;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  isLoading = false,
  disabled = false,
  onClick,
  type = 'button'
}: ButtonProps) => {
  return (
    <StyledButton
      type={type}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || isLoading}
      onClick={onClick}
      whileHover={!disabled && !isLoading ? { scale: 1.03 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
    >
      {isLoading && <LoadingSpinner />}
      {!isLoading && icon && <span className="mr-2">{icon}</span>}
      {children}
    </StyledButton>
  );
};

export default Button; 