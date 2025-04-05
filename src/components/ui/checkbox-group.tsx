import React from 'react';
import { Checkbox } from './checkbox';
import { Label } from './label';

interface CheckboxItem {
  id: string;
  label: string;
}

interface CheckboxGroupProps {
  items: CheckboxItem[];
  values: string[];
  onChange: (values: string[]) => void;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  items,
  values,
  onChange,
  className = '',
  orientation = 'vertical'
}) => {
  const handleCheckboxChange = (id: string, checked: boolean) => {
    if (checked) {
      onChange([...values, id]);
    } else {
      onChange(values.filter(value => value !== id));
    }
  };

  return (
    <div className={`${orientation === 'horizontal' ? 'flex flex-wrap gap-4' : 'space-y-2'} ${className}`}>
      {items.map((item) => (
        <div key={item.id} className="flex items-center space-x-2">
          <Checkbox
            id={`checkbox-${item.id}`}
            checked={values.includes(item.id)}
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