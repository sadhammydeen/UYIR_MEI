import React from 'react';

interface PaymentMethodLogosProps {
  className?: string;
  title?: string;
  logoSize?: 'sm' | 'md' | 'lg';
  showBorder?: boolean;
}

const PaymentMethodLogos: React.FC<PaymentMethodLogosProps> = ({
  className = '',
  title = 'We accept all major payment methods',
  logoSize = 'md',
  showBorder = true
}) => {
  const sizeMap = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10',
  };

  const heightClass = sizeMap[logoSize];

  return (
    <div className={`${showBorder ? 'border-t border-gray-200 pt-6' : ''} ${className}`}>
      {title && <p className="text-center text-gray-600 mb-6">{title}</p>}
      <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
        <img 
          src="/images/payment-methods/visa.png" 
          alt="Visa" 
          className={`${heightClass} w-auto opacity-80 hover:opacity-100 transition-opacity`} 
        />
        <img 
          src="/images/payment-methods/mastercard.png" 
          alt="Mastercard" 
          className={`${heightClass} w-auto opacity-80 hover:opacity-100 transition-opacity`} 
        />
        <img 
          src="/images/payment-methods/upi.png" 
          alt="UPI" 
          className={`${heightClass} w-auto opacity-80 hover:opacity-100 transition-opacity`} 
        />
        <img 
          src="/images/payment-methods/gpay.png" 
          alt="Google Pay" 
          className={`${heightClass} w-auto opacity-80 hover:opacity-100 transition-opacity`} 
        />
      </div>
    </div>
  );
};

export default PaymentMethodLogos; 