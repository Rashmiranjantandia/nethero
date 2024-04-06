export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit:    { opacity: 0, transition: { duration: 0.2 } },
};

export const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4,0,0.2,1] } },
};

export const cardHover = {
  rest:  { scale: 1, zIndex: 10, transition: { duration: 0.3 } },
  hover: { scale: 1.5, zIndex: 20, y: -50, transition: { duration: 0.3, delay: 0.3 } },
};

export const modalVariant = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit:    { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};
