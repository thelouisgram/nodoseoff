import React from 'react';
import { motion, MotionProps } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Define the props for the animated component
interface AnimatedComponentProps extends MotionProps {
  animationType: "fadeIn" | "slideIn" | "scaleUp" | "slideUp";
  children: React.ReactNode;
  delay?: number; // Optional delay prop
}

// Define animations, including the new revealDiv animation
const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
  slideIn: {
    initial: { opacity: 0, y: 40,  },
    animate: { y: 0, opacity: 1 },
  },
  scaleUp: {
    initial: { scale: 0 },
    animate: { scale: 1 },
  },
  slideUp: {
    initial: { opacity: 0, y: '300%', x: 0},
    animate: { opacity: 1, y: 0, x: 0 },
  },
};

// Reusable animated component
const AnimatedComponent: React.FC<AnimatedComponentProps> = ({
  animationType,
  children,
  delay = 0, // Default delay value is 0
  ...props
}) => {
  // Get the appropriate animation based on the type
  const animation = animations[animationType];

  // If the animationType is 'revealDiv', set up the intersection observer
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  // Determine the initial and animate states based on the animation type and inView status
  const initial = animation?.initial ?? {};
  const animate =
    animationType === "slideUp"
      ? inView
        ? animation?.animate
        : animation?.initial
      : animation?.animate;

  return (
    <motion.div
      ref={animationType === "slideUp" ? ref : undefined} // Set ref only for revealDiv
      initial={initial}
      animate={animate}
      transition={{
        duration: 0.6,
        delay, // Apply delay
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedComponent;