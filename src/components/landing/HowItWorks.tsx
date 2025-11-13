'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'

const steps = [
  {
    title: 'Write',
    description: 'Capture beliefs and notes. Document your thinking as it unfolds.',
    icon: '✎',
  },
  {
    title: 'Predict',
    description: 'Quantify uncertainty with probability. Turn hunches into measurable forecasts.',
    icon: '◈',
  },
  {
    title: 'Reflect',
    description: 'See your cognitive patterns emerge. Learn from your calibration over time.',
    icon: '◉',
  },
]

export function HowItWorks() {
  return (
    <section className="py-32 px-4 bg-gradient-to-b from-black via-slate-950 to-black">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-serif font-light text-center text-white mb-16"
        >
          How It Works
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm p-8 h-full hover:border-teal-500/30 transition-all duration-300">
                <div className="text-5xl mb-6 text-center text-teal-400">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-serif font-light text-white mb-4 text-center">
                  {step.title}
                </h3>
                <p className="text-gray-400 text-center leading-relaxed">
                  {step.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

