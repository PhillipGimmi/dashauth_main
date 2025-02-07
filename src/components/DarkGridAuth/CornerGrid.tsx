'use client';

import React from 'react';

export const CornerGrid = () => {
  return (
    <>
      {/* Top Right Grid */}
      <div
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke-width='2' stroke='rgb(75 85 99 / 0.25)'%3e%3cpath d='M0 0L32 32M0 32L32 0'/%3e%3c/svg%3e")`,
          backgroundSize: '32px 32px',
          backgroundPosition: 'top right',
          backgroundRepeat: 'repeat',
        }}
        className="absolute right-0 top-0 h-[50vh] w-full overflow-hidden md:w-[50vw]"
      >
        <div className="absolute inset-0 h-full [background-image:radial-gradient(50%_100%_at_75%_0%,rgba(9,9,11,0),rgba(9,9,11,1))] md:[background-image:radial-gradient(50%_100%_at_50%_0%,rgba(9,9,11,0),rgba(9,9,11,1))]" />
      </div>

      {/* Bottom Left Grid */}
      <div
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke-width='2' stroke='rgb(75 85 99 / 0.25)'%3e%3cpath d='M0 0L32 32M0 32L32 0'/%3e%3c/svg%3e")`,
          backgroundSize: '32px 32px',
          backgroundPosition: 'bottom left',
          backgroundRepeat: 'repeat',
        }}
        className="absolute bottom-0 left-0 h-[50vh] w-full overflow-hidden md:w-[50vw]"
      >
        <div className="absolute inset-0 h-full [background-image:radial-gradient(50%_100%_at_25%_100%,rgba(9,9,11,0),rgba(9,9,11,1))] md:[background-image:radial-gradient(50%_100%_at_50%_100%,rgba(9,9,11,0),rgba(9,9,11,1))]" />
      </div>
    </>
  );
};

export default CornerGrid;
