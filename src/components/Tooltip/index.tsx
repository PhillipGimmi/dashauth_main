import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { motion } from 'framer-motion';

const TooltipProvider = ({ children, ...props }: TooltipPrimitive.TooltipProviderProps) => (
  <TooltipPrimitive.Provider {...props}>
    <TooltipPrimitive.Root delayDuration={0}>{children}</TooltipPrimitive.Root>
  </TooltipPrimitive.Provider>
);

const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, ...props }, ref) => {
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const tooltipRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (tooltipRef.current) {
        const tooltip = tooltipRef.current;
        const tooltipRect = tooltip.getBoundingClientRect();

        // Get exact mouse position
        let x = e.clientX;
        let y = e.clientY;

        // Get viewport dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Ensure tooltip stays within viewport
        if (x + tooltipRect.width > viewportWidth) {
          x = viewportWidth - tooltipRect.width;
        }
        if (y + tooltipRect.height > viewportHeight) {
          y = viewportHeight - tooltipRect.height;
        }
        if (x < 0) x = 0;
        if (y < 0) y = 0;

        setPosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <TooltipPrimitive.Content
      ref={(node) => {
        // Handle the forwarded ref
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
        // Update internal ref
        tooltipRef.current = node;
      }}
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        pointerEvents: 'none',
        width: 'auto',
        maxWidth: '90vw',
        maxHeight: '90vh',
      }}
      className={`
        z-50 overflow-hidden rounded-lg 
        border border-zinc-800/50 
        bg-zinc-900/95 p-3
        shadow-xl backdrop-blur-sm dark:border-zinc-200/50
        dark:bg-zinc-100/95
        ${className}
      `}
      {...props}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.1 }}
        className="w-full"
      >
        {props.children}
      </motion.div>
    </TooltipPrimitive.Content>
  );
});

TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
