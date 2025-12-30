import React from 'react';

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

const Card = ({ children, className = '' }: CardProps) => {
  const classes = `flex flex-col rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow bg-white dark:bg-[#2a221a] border border-gray-100 dark:border-gray-800 h-full ${className}`;

  return <div className={classes}>{children}</div>;
};

export default Card;
