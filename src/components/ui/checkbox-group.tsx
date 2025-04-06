import React from 'react';
import { Checkbox } from './checkbox';
import { Label } from './label';

interface CheckboxItem {
  id: string;
  label: string;
}

export interface CheckboxGroupProps {
  items?: CheckboxItem[];
  values?: string[];
  onChange?: (values: string[]) => void;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  value?: string[];
  onValueChange?: (values: string[]) => void;
  children?: React.ReactNode;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  items,
  values = [],
  onChange,
  value = [],
  onValueChange,
  className = '',
  orientation = 'vertical',
  children
}) => {
  const handleCheckboxChange = (id: string, checked: boolean) => {
    // Support both API styles (onChange and onValueChange)
    const currentValues = value.length > 0 ? value : values;
    const handleChange = onValueChange || onChange;
    
    if (!handleChange) return;
    
    if (checked) {
      handleChange([...currentValues, id]);
    } else {
      handleChange(currentValues.filter(v => v !== id));
    }
  };

  // If children are provided, render them directly
  if (children) {
    return <div className={className}>{children}</div>;
  }

  // Otherwise render the standard checkbox list
  return (
    <div className={`${orientation === 'horizontal' ? 'flex flex-wrap gap-4' : 'space-y-2'} ${className}`}>
      {items?.map((item) => (
        <div key={item.id} className="flex items-center space-x-2">
          <Checkbox
            id={`checkbox-${item.id}`}
            checked={value.includes(item.id) || values.includes(item.id)}
            onCheckedChange={(checked) => handleCheckboxChange(item.id, checked === true)}
          />
          <Label
            htmlFor={`checkbox-${item.id}`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {item.label}
          </Label>
        </div>
      ))}
    </div>
  );
};

export default CheckboxGroup; 