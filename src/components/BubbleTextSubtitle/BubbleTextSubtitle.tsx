import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const BubbleTextSubtitle = ({ text }: { text: string }) => {
  useEffect(() => {
    const spans = document.querySelectorAll('.hover-text span');

    spans.forEach((span) => {
      if (span instanceof HTMLSpanElement) {
        span.addEventListener('mouseenter', () => {
          span.classList.add('text-white'); // No font-weight adjustments
          const leftNeighbor = span.previousElementSibling;
          const rightNeighbor = span.nextElementSibling;

          if (leftNeighbor instanceof HTMLSpanElement) {
            leftNeighbor.classList.add('text-gray-300');
          }
          if (rightNeighbor instanceof HTMLSpanElement) {
            rightNeighbor.classList.add('text-gray-300');
          }
        });

        span.addEventListener('mouseleave', () => {
          span.classList.remove('text-white');
          const leftNeighbor = span.previousElementSibling;
          const rightNeighbor = span.nextElementSibling;

          if (leftNeighbor instanceof HTMLSpanElement) {
            leftNeighbor.classList.remove('text-gray-300');
          }
          if (rightNeighbor instanceof HTMLSpanElement) {
            rightNeighbor.classList.remove('text-gray-300');
          }
        });
      }
    });
  }, []);

  return (
    <motion.span
      variants={{
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
      }}
      initial="initial"
      animate="animate"
      className="hover-text text-2xl font-light text-gray-400 sm:text-3xl lg:text-4xl 2xl:text-5xl"
    >
      <BubbleText>{text}</BubbleText>
    </motion.span>
  );
};

const BubbleText = ({ children }: { children: string }) => {
  return (
    <>
      {children.split('').map((char, idx) => (
        <span
          style={{
            transition: '0.35s color',
          }}
          key={`${children}-${char}-${idx}`}
        >
          {char}
        </span>
      ))}
    </>
  );
};

export default BubbleTextSubtitle;
