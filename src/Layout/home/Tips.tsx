import React from "react";
import { motion } from "framer-motion";
import { tips } from "../../utils/tips";

const Tips = () => {
  return (
    <div
      id="tips"
      className="container mx-auto px-4 md:px-0 py-24 w-full flex flex-col items-center"
    >
      <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-center text-slate-800">
        Tips for better health
      </h2>
      <p className="text-sm md:text-base text-slate-500 text-center mb-12 max-w-xl">
        Practical advice to help you take medications safely and effectively.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 w-full max-w-5xl">
        {tips.map((tip, index) => {
          const Icon = tip.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="group relative flex flex-col items-start gap-3 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
              style={{ backgroundColor: tip.bgColor, color: tip.textColor }}
              viewport={{ once: true }}
            >
              {/* Icon Circle */}
              {Icon && (
                <div className="bg-white/20 rounded-full p-3 mb-2 group-hover:scale-105 transition-transform duration-300">
                  <Icon size={24} />
                </div>
              )}

              {/* Title */}
              <h3 className="font-bold text-lg md:text-[18px] leading-snug">
                {tip.title}
              </h3>

              {/* Description */}
              <p className="text-sm md:text-[13px] text-slate-800/80">
                {tip.desc}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Tips;
