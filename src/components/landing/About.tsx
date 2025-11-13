'use client'

import { motion } from 'framer-motion'

export function About() {
  return (
    <section className="py-32 px-4 bg-black">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto"
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif font-light text-white mb-6">
              Your ideas
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-purple-400">
                evolve
              </span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              The Journal observes. Each thought, each prediction becomes a data point in your personal archive of understanding.
            </p>
          </div>

          <div className="space-y-6">
            <p className="text-gray-300 text-lg leading-relaxed">
              Entries, bets, and insights form your personal world model. Track how your beliefs shift. Measure your calibration. Watch your reasoning patterns emerge over time.
            </p>
            <div className="h-px bg-gradient-to-r from-teal-500/20 to-purple-500/20" />
          </div>
        </div>
      </motion.div>
    </section>
  )
}

