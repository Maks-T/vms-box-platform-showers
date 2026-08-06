import React, { forwardRef, useState, useEffect, ChangeEvent } from 'react';
import { Input, InputProps } from './Input';
import { Phone } from 'lucide-react';

export function formatBYPhone(value: string): string {
  const digits = value.replace(/\D/g, '');

  let numberDigits = digits;
  if (numberDigits.startsWith('375')) {
    numberDigits = numberDigits.slice(3);
  } else if (numberDigits.startsWith('80')) {
    numberDigits = numberDigits.slice(2);
  } else if (numberDigits.startsWith('8')) {
    numberDigits = numberDigits.slice(1);
  }

  numberDigits = numberDigits.slice(0, 9);

  let formatted = '+375';
  if (numberDigits.length > 0) {
    formatted += ` (${numberDigits.slice(0, 2)}`;
  }
  if (numberDigits.length >= 2) {
    formatted += `) ${numberDigits.slice(2, 5)}`;
  }
  if (numberDigits.length >= 5) {
    formatted += `-${numberDigits.slice(5, 7)}`;
  }
  if (numberDigits.length >= 7) {
    formatted += `-${numberDigits.slice(7, 9)}`;
  }

  return formatted;
}

export interface PhoneInputProps extends Omit<InputProps, 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value = '', onChange, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState(formatBYPhone(value));

    useEffect(() => {
      setDisplayValue(formatBYPhone(value));
    }, [value]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const formatted = formatBYPhone(e.target.value);
      setDisplayValue(formatted);
      if (onChange) {
        onChange(formatted);
      }
    };

    return (
      <Input
        ref={ref}
        type="tel"
        placeholder="+375 (00) 000-00-00"
        value={displayValue}
        onChange={handleChange}
        icon={<Phone className="w-4 h-4" />}
        {...props}
      />
    );
  }
);

PhoneInput.displayName = "PhoneInput";
