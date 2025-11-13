'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-950 via-black to-slate-900">
      {/* Subtle constellation dots background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-1 h-1 bg-teal-300 rounded-full animate-pulse" />
        <div className="absolute top-40 right-40 w-1 h-1 bg-purple-300 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-60 left-1/4 w-1 h-1 bg-teal-400 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-40 right-1/3 w-1 h-1 bg-teal-300 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-8xl font-serif font-light text-white mb-6 tracking-tight"
        >
          World Model
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-purple-400">
            Journal
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-300 mb-12 font-light tracking-wide"
        >
          A daily mirror for your reasoning.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link href="/login">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-white px-8 py-6 text-lg font-medium rounded-full shadow-lg hover:shadow-teal-500/50 transition-all duration-300"
            >
              Start Journaling
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Bottom fade gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </section>
  )
}

