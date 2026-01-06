import React from "react";
import { Navbar } from "../../components/navbar/navbar";
import { motion } from "framer-motion";
import {
  IconCode,
  IconDeviceDesktop,
  IconDatabase,
  IconRocket,
  IconBrandGithub,
  IconBrandLinkedin,
  IconMail,
} from "@tabler/icons-react";

export function AboutUs() {
  const skills = [
    {
      icon: <IconCode className="h-8 w-8" />,
      title: "Full Stack Development",
      description: "Building end-to-end solutions with modern technologies",
    },
    {
      icon: <IconDeviceDesktop className="h-8 w-8" />,
      title: "Frontend Development",
      description: "Creating beautiful and responsive user interfaces",
    },
    {
      icon: <IconDatabase className="h-8 w-8" />,
      title: "Backend Development",
      description: "Designing robust APIs and serverless architectures",
    },
    {
      icon: <IconRocket className="h-8 w-8" />,
      title: "Deployment & DevOps",
      description: "Deploying applications to production with best practices",
    },
  ];

  const socialLinks = [
    {
      icon: <IconBrandGithub className="h-6 w-6" />,
      name: "GitHub",
      link: "https://github.com",
    },
    {
      icon: <IconBrandLinkedin className="h-6 w-6" />,
      name: "LinkedIn",
      link: "https://linkedin.com",
    },
    {
      icon: <IconMail className="h-6 w-6" />,
      name: "Email",
      link: "mailto:ali@example.com",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navbar />
      <div className="pt-24 pb-16 px-4 md:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <div className="flex justify-center mb-6">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="relative"
            >
              <img
                src={require("../../assets/HeroImages/12.png")}
                alt="Ali Abdullah"
                className="rounded-full h-32 w-32 md:h-40 md:w-40 object-cover ring-4 ring-sky-500/20 dark:ring-sky-400/20"
              />
            </motion.div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-neutral-800 dark:text-neutral-200 mb-4">
            About Me
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-sky-600 dark:text-sky-400 mb-4">
            Ali Abdullah
          </h2>
          <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Full Stack Developer & Creator of Simplifly
          </p>
        </motion.div>

        {/* About Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 md:p-12 shadow-input border border-neutral-200 dark:border-white/[0.1]">
            <h2 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200 mb-6">
              Hello, I'm Ali Abdullah
            </h2>
            <div className="space-y-4 text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <p>
                I'm a passionate full-stack developer and the sole creator of
                Simplifly, a comprehensive flight booking and management
                platform. This project represents my dedication to building
                modern, user-friendly web applications that solve real-world
                problems.
              </p>
              <p>
                Simplifly was built from the ground up, combining a React-based
                frontend with a Node.js/Express backend, deployed on Vercel. The
                platform features real-time flight search, seat selection,
                booking management, and a complete admin panel - all designed
                and developed by me.
              </p>
              <p>
                My goal with Simplifly is to make flight booking simple,
                intuitive, and accessible to everyone. I believe in writing
                clean, maintainable code and creating delightful user
                experiences.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Skills Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-bold text-center text-neutral-800 dark:text-neutral-200 mb-8">
            Skills & Expertise
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skills.map((skill, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-input border border-neutral-200 dark:border-white/[0.1]"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-shrink-0 p-3 rounded-lg bg-sky-100 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400">
                    {skill.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">
                    {skill.title}
                  </h3>
                </div>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                  {skill.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Connect Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 md:p-12 shadow-input border border-neutral-200 dark:border-white/[0.1] text-center">
            <h2 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200 mb-6">
              Let's Connect
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8">
              I'm always open to discussing new projects, creative ideas, or
              opportunities to be part of your vision.
            </p>
            <div className="flex justify-center gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-4 rounded-lg bg-neutral-100 dark:bg-zinc-800 text-neutral-600 dark:text-neutral-400 hover:bg-sky-100 dark:hover:bg-sky-900/20 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
