'use client';

import React from 'react';
import Link from 'next/link';
import styles from './ShimmerButton.module.css';

interface ShimmerButtonProps {
  text?: string;
  href: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const ShimmerButton = ({ text = 'Get Started', href, onClick }: ShimmerButtonProps) => {
  return (
    <div style={{ pointerEvents: 'none' }} className="relative w-full">
      <Link href={href}>
        <button
          onClick={onClick}
          className={`${styles.shimmer_btn} relative mb-4 w-full px-8 py-3.5`}
          style={{ pointerEvents: 'auto' }}
        >
          <span className={styles.text}>{text}</span>
          <span className={styles.shimmer}></span>
        </button>
      </Link>
    </div>
  );
};

export default ShimmerButton;
