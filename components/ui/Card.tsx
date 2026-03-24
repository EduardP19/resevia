'use client';

import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, HTMLMotionProps } from 'framer-motion';

export function Card({ children, className, whileHover, ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div 
      whileHover={whileHover || { y: -4, borderColor: "rgba(201,169,110,1)" }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={twMerge(clsx('bg-white rounded-xl border border-[rgba(201,169,110,0.3)] p-6 shadow-sm', className))}
      {...props}
    >
      {children}
    </motion.div>
  );
}
