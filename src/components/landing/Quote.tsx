'use client'

import { motion } from 'framer-motion'

export function Quote() {
  return (
    <section className="py-32 px-4 bg-black">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto text-center"
      >
        <div className="relative">
          <div className="absolute -top-8 -left-4 text-6xl text-teal-500/20 font-serif">"</div>
          <blockquote className="text-2xl md:text-3xl font-serif font-light italic text-gray-300 leading-relaxed">
            Understanding begins when we measure our own minds.
          </blockquote>
          <div className="absolute -bottom-8 -right-4 text-6xl text-purple-500/20 font-serif">"</div>
        </div>
        <div className="mt-12 h-px w-24 mx-auto bg-gradient-to-r from-teal-500/50 to-purple-500/50" />
      </motion.div>
    </section>
  )
}

