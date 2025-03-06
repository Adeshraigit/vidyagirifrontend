
'use client'
import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, BookOpen, Brain, Lightbulb, Headphones, Eye, HandMetal, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"

const BackgroundGradient = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-green-500 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
      <div className="relative">{children}</div>
    </div>
  )
}

const TextReveal = ({ text }: { text: string }) => {
  return (
    <div className="relative overflow-hidden">
      <motion.h1
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-4xl md:text-6xl font-bold text-emerald-900"
      >
        {text}
      </motion.h1>
    </div>
  )
}

const AnimatedCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => {
  return (
    <motion.div whileHover={{ y: -5, transition: { duration: 0.2 } }} className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-green-500 rounded-lg opacity-0 group-hover:opacity-100 transition duration-300"></div>
      <Card className="relative bg-white dark:bg-gray-950 border-0 shadow-lg h-full">
        <CardContent className="p-6">
          <div className="mb-4 text-emerald-600">{icon}</div>
          <h3 className="text-xl font-bold mb-2 text-emerald-800 dark:text-emerald-400">{title}</h3>
          <p className="text-gray-600 dark:text-gray-400">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

const SparklesBackground = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative w-full">
      <div className="absolute inset-0 h-full w-full bg-white dark:bg-gray-950 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="relative">{children}</div>
    </div>
  )
}

const HeroParallax = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect()
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
      }
    }

    const heroElement = heroRef.current
    if (heroElement) {
      heroElement.addEventListener("mousemove", handleMouseMove)
    }

    return () => {
      if (heroElement) {
        heroElement.removeEventListener("mousemove", handleMouseMove)
      }
    }
  }, [])

  return (
    <div
      ref={heroRef}
      className="relative overflow-hidden bg-gradient-to-b from-emerald-50 to-white dark:from-gray-900 dark:to-gray-950 h-[600px] flex items-center"
    >
      <div
        className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] bg-repeat opacity-5"
        style={{
          transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
        }}
      ></div>
      <div className="container mx-auto px-4 z-10">
        <div className="max-w-3xl mx-auto text-center">
          <TextReveal text="Discover Your Learning Style" />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-6 text-xl text-emerald-700 dark:text-emerald-300"
          >
            Take the VARK questionnaire and unlock your unique learning preferences to enhance your educational journey.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-10"
          >
            <BackgroundGradient>
              <a href="/questionnaire">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg">
                  Start Questionnaire <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
            </BackgroundGradient>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// const FloatingIcons = () => {
//   return (
//     <div className="absolute inset-0 overflow-hidden">
//       {[Eye, BookOpen, Brain, Headphones, HandMetal].map((Icon, index) => (
//         <motion.div
//           key={index}
//           className="absolute text-emerald-500/20 dark:text-emerald-500/10"
//           style={{
//             top: `${Math.random() * 100}%`,
//             left: `${Math.random() * 100}%`,
//           }}
//           animate={{
//             y: [0, -10, 0],
//             opacity: [0.2, 0.5, 0.2],
//           }}
//           transition={{
//             duration: 5 + Math.random() * 5,
//             repeat: Number.POSITIVE_INFINITY,
//             delay: Math.random() * 5,
//           }}
//         >
//           <Icon size={30 + Math.random() * 40} />
//         </motion.div>
//       ))}
//     </div>
//   )
// }
const FloatingIcons = () => {
  const icons = [Eye, BookOpen, Brain, Headphones, HandMetal];
  const [iconStyles, setIconStyles] = useState<
    { top: string; left: string; size: number; delay: number; duration: number }[]
  >([]);

  useEffect(() => {
    setIconStyles(
      icons.map(() => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: 30 + Math.random() * 40,
        delay: Math.random() * 5,
        duration: 5 + Math.random() * 5,
      }))
    );
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {icons.map((Icon, index) => (
        <motion.div
          key={index}
          className="absolute text-emerald-500/20 dark:text-emerald-500/10"
          style={{
            top: iconStyles[index]?.top,
            left: iconStyles[index]?.left,
          }}
          animate={{
            y: [0, -10, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: iconStyles[index]?.duration,
            repeat: Number.POSITIVE_INFINITY,
            delay: iconStyles[index]?.delay,
          }}
        >
          <Icon size={iconStyles[index]?.size} />
        </motion.div>
      ))}
    </div>
  );
};


const TestimonialCard = ({ quote, author, role }: { quote: string; author: string; role: string }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border border-emerald-100 dark:border-emerald-900"
    >
      <div className="mb-4 text-emerald-500">
        <svg width="45" height="36" className="fill-current">
          <path d="M13.415.43c-2.523 0-4.75 1.173-6.682 3.52C4.8 6.298 3.756 9.38 3.756 12.89c0 6.498 3.442 11.46 10.325 14.884-1.841 5.106-3.173 7.827-4.024 8.163-.85.337-1.943.553-3.08.65.338 1.922 1.354 3.54 3.047 4.858 1.693 1.318 3.5 1.977 5.42 1.977 3.048 0 5.254-1.153 6.551-3.46 1.297-2.305 1.945-5.434 1.945-9.384 0-2.305-.254-4.69-.763-7.156a46.402 46.402 0 0 0-1.776-6.994 36.464 36.464 0 0 0-2.4-5.747C17.946 8.09 16.598 6.295 15.166 5.2 13.734 4.105 12.217 3.46 10.62 3.46c-.932 0-1.65.12-2.142.362-.492.241-.738.663-.738 1.266 0 .422.158.776.476 1.06.317.285.687.427 1.108.427.21 0 .484-.021.814-.064.331-.042.51-.064.54-.064 1.354 0 2.558.738 3.61 2.213 1.051 1.475 1.83 3.483 2.335 6.023-2.629-1.335-4.469-2.85-5.523-4.545C10.046 8.243 9.52 6.122 9.52 3.577c0-1.138.42-2.213 1.261-3.226C11.622.338 12.409.064 13.136.064c.042 0 .148.021.316.064.17.042.296.064.38.064.083 0 .148-.021.19-.064.042-.042.063-.127.063-.255V-.19c0-.126-.021-.211-.063-.255-.042-.042-.148-.064-.317-.064H13.415zm21.951 0c-2.523 0-4.75 1.173-6.681 3.52-1.934 2.347-2.9 5.43-2.9 9.257 0 6.498 3.442 11.46 10.325 14.884-1.841 5.106-3.173 7.827-4.024 8.163-.85.337-1.943.553-3.08.65.338 1.922 1.354 3.54 3.047 4.858 1.692 1.318 3.5 1.977 5.42 1.977 3.048 0 5.254-1.153 6.551-3.46 1.297-2.305 1.945-5.434 1.945-9.384 0-2.305-.254-4.69-.763-7.156a46.402 46.402 0 0 0-1.776-6.994 36.464 36.464 0 0 0-2.4-5.747c-1.054-1.793-2.4-3.588-4.024-5.364C34.31 3.26 32.793 2.615 31.196 2.615c-.932 0-1.65.12-2.142.362-.493.241-.738.663-.738 1.266 0 .422.158.776.476 1.06.317.285.686.427 1.108.427.21 0 .484-.021.814-.064.33-.042.51-.064.54-.064 1.354 0 2.558.738 3.61 2.213 1.051 1.475 1.83 3.483 2.335 6.023-2.629-1.335-4.47-2.85-5.523-4.545-1.053-1.695-1.58-3.816-1.58-6.361 0-1.138.42-2.213 1.262-3.226.84-1.013 1.628-1.287 2.355-1.287.042 0 .148.021.317.064.168.042.295.064.38.064.083 0 .148-.021.19-.064.042-.042.063-.127.063-.255V-.19c0-.126-.021-.211-.063-.255-.042-.042-.148-.064-.317-.064h-.19z"></path>
        </svg>
      </div>
      <p className="text-gray-700 dark:text-gray-300 mb-4">{quote}</p>
      <div>
        <p className="font-semibold text-emerald-700 dark:text-emerald-400">{author}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{role}</p>
      </div>
    </motion.div>
  )
}

const FeatureList = ({ features }: { features: { title: string; description: string }[] }) => {
  return (
    <ul className="space-y-4">
      {features.map((feature, index) => (
        <motion.li
          key={index}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          viewport={{ once: true }}
          className="flex items-start"
        >
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center mt-1">
            <ChevronRight className="h-4 w-4 text-white" />
          </div>
          <div className="ml-3">
            <h4 className="text-lg font-medium text-emerald-700 dark:text-emerald-400">{feature.title}</h4>
            <p className="mt-1 text-gray-600 dark:text-gray-400">{feature.description}</p>
          </div>
        </motion.li>
      ))}
    </ul>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <div className="relative">
        <FloatingIcons />
        <HeroParallax />
      </div>

      {/* What is VARK Section */}
      <section className="py-20 bg-emerald-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-emerald-800 dark:text-emerald-400 mb-4"
            >
              What is VARK?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg text-gray-600 dark:text-gray-300"
            >
              VARK stands for Visual, Aural, Read/Write, and Kinesthetic. It's a model that helps identify how you
              prefer to learn and process information.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatedCard
              icon={<Eye className="h-10 w-10" />}
              title="Visual"
              description="You prefer using images, pictures, colors, and maps to organize information and communicate with others."
            />
            <AnimatedCard
              icon={<Headphones className="h-10 w-10" />}
              title="Aural"
              description="You prefer using sound and music. You learn best through lectures, discussions, and listening."
            />
            <AnimatedCard
              icon={<BookOpen className="h-10 w-10" />}
              title="Read/Write"
              description="You prefer information displayed as words. You learn best from reading and writing."
            />
            <AnimatedCard
              icon={<HandMetal className="h-10 w-10" />}
              title="Kinesthetic"
              description="You prefer using your body, hands and sense of touch. You learn best through physical experiences."
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-emerald-600 to-green-500 opacity-30 blur-xl"></div>
                <div className="relative bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-xl">
                  <div className="grid grid-cols-2 gap-0.5 bg-emerald-100 dark:bg-emerald-900/20">
                    <div className="aspect-square bg-emerald-50 dark:bg-gray-800 flex items-center justify-center p-6">
                      <Eye className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="aspect-square bg-emerald-50 dark:bg-gray-800 flex items-center justify-center p-6">
                      <Headphones className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="aspect-square bg-emerald-50 dark:bg-gray-800 flex items-center justify-center p-6">
                      <BookOpen className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="aspect-square bg-emerald-50 dark:bg-gray-800 flex items-center justify-center p-6">
                      <HandMetal className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="h-2 w-24 bg-emerald-500 rounded-full mb-6"></div>
                    <h3 className="text-2xl font-bold text-emerald-800 dark:text-emerald-400 mb-4">
                      Personalized Learning
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Discover your unique learning preferences and optimize your educational experience.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
            <div className="lg:w-1/2">
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 dark:text-emerald-400 mb-6">
                  Benefits of Knowing Your Learning Style
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                  Understanding your VARK learning preferences can transform your educational journey and help you:
                </p>

                <FeatureList
                  features={[
                    {
                      title: "Study More Effectively",
                      description: "Tailor your study methods to match your learning preferences for better retention.",
                    },
                    {
                      title: "Improve Academic Performance",
                      description: "Leverage your natural learning strengths to enhance your grades and comprehension.",
                    },
                    {
                      title: "Reduce Learning Frustration",
                      description: "Stop struggling with ineffective learning methods that don't work for you.",
                    },
                    {
                      title: "Develop Personalized Strategies",
                      description: "Create custom learning approaches that maximize your information processing.",
                    },
                  ]}
                />

                <div className="mt-10">
                  <a href="/questionnaire">
                    <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                      Take the Questionnaire <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-emerald-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-emerald-800 dark:text-emerald-400 mb-4"
            >
              What People Are Saying
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg text-gray-600 dark:text-gray-300"
            >
              Discover how understanding VARK learning styles has helped others improve their learning journey.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard
              quote="Discovering I was a visual learner completely changed how I approach studying. I now use mind maps and diagrams, and my grades have improved significantly."
              author="Sarah Johnson"
              role="University Student"
            />
            <TestimonialCard
              quote="As an aural learner, I started recording lectures and discussing concepts with study groups. It's made a world of difference in my comprehension."
              author="Michael Chen"
              role="Graduate Student"
            />
            <TestimonialCard
              quote="Finding out I'm a kinesthetic learner explained why traditional classroom settings were always challenging for me. Now I incorporate movement into my learning process."
              author="Jessica Rodriguez"
              role="High School Teacher"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <SparklesBackground>
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-r from-emerald-600 to-green-500 rounded-2xl p-10 shadow-xl"
              >
                <div className="mb-6">
                  <Lightbulb className="h-16 w-16 text-white mx-auto" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Ready to Discover Your Learning Style?
                </h2>
                <p className="text-xl text-emerald-50 mb-8">
                  Take the VARK questionnaire today and unlock your full learning potential.
                </p>
                <BackgroundGradient>
                  <a href="/questionnaire">
                    <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50 px-8 py-6 text-lg">
                      Start the Questionnaire <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </a>
                </BackgroundGradient>
              </motion.div>
            </div>
          </div>
        </section>
      </SparklesBackground>
    </div>
  );
}
