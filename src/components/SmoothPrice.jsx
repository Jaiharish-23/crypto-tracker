import React, { useEffect, useRef, useState } from 'react';

const SmoothPrice = ({ value, prefix = '$', suffix = '', decimals = 2, className = '' }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [flashClass, setFlashClass] = useState('');
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (value !== prevValueRef.current) {
      // Determine if price went up or down
      if (value > prevValueRef.current) {
        setFlashClass('price-up');
      } else if (value < prevValueRef.current) {
        setFlashClass('price-down');
      }

      // Smooth transition to new value
      setDisplayValue(value);
      prevValueRef.current = value;

      // Remove flash class after animation
      const timer = setTimeout(() => setFlashClass(''), 500);
      return () => clearTimeout(timer);
    }
  }, [value]);

  const formattedValue = typeof displayValue === 'number' 
    ? displayValue.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      })
    : displayValue;

  return (
    <span className={`smooth-number ${flashClass} ${className}`}>
      {prefix}{formattedValue}{suffix}
    </span>
  );
};

export default SmoothPrice;
