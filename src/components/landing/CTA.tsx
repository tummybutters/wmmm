'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function CTA() {
  return (
    <section className="py-32 px-4 bg-gradient-to-b from-black to-indigo-950">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl mx-auto text-center"
      >
        <h2 className="text-3xl md:text-4xl font-serif font-light text-white mb-8">
          Begin your observation
        </h2>
        
        <Link href="/login">
          <Button 
            size="lg"
            className="relative bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-white px-10 py-6 text-lg font-medium rounded-full shadow-2xl hover:shadow-teal-500/50 transition-all duration-300 group"
          >
            <span className="relative z-10">Sign In to Begin</span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-400 to-purple-400 blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
          </Button>
        </Link>
      </motion.div>
    </section>
  )
}

