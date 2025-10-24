import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, Users, Lightbulb, AlertCircle, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <nav className="glass-effect fixed top-0 w-full z-50 py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <img
              src="/logo_institucional.png"
              alt="Logo Instituto Politécnico de Formosa"
              className="w-8 h-8 object-contain"
            />
            <span className="text-2xl font-bold gradient-text">aportAR</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-3 items-center"
          >
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
            <Button variant="outline" onClick={() => navigate('/auth')}>
              Iniciar Sesión
            </Button>
            <Button onClick={() => navigate('/auth')}>Registrarse</Button>
          </motion.div>
        </div>
      </nav>

      <section className="pt-24 pb-10">
        <div className="w-full">
          {/* Banner image - full width */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full h-[400px] overflow-hidden"
          >
            <img
              className="w-full h-full object-cover"
              alt="Estudiantes del Politécnico colaborando"
              src="https://horizons-cdn.hostinger.com/8dd8155e-64e6-4fdb-9cd7-f35577bd5a5c/banneraportar-XjyNu.png"
            />
          </motion.div>

          {/* Content below image */}
          <div className="max-w-7xl mx-auto px-6 pt-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center"
            >
              <h1 className="text-6xl font-bold mb-6 gradient-text">Conecta, Colabora, Crece</h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                La plataforma oficial del Instituto Politécnico de Formosa para compartir proyectos,
                proponer mejoras y resolver desafíos institucionales juntos.
              </p>
              <Button size="lg" onClick={() => navigate('/auth')} className="text-lg px-8 py-6">
                Únete Ahora
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-10 px-6 bg-white/50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-12 gradient-text"
          >
            ¿Qué puedes hacer en aportAR?
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: 'Proyectos',
                description: 'Comparte tus trabajos académicos y desarrollos con toda la comunidad',
                color: 'from-blue-500 to-blue-600',
              },
              {
                icon: Lightbulb,
                title: 'Sugerencias',
                description: 'Propón ideas y mejoras para fortalecer nuestra institución',
                color: 'from-yellow-500 to-orange-500',
              },
              {
                icon: AlertCircle,
                title: 'Problemáticas',
                description: 'Colabora en la resolución de desafíos institucionales',
                color: 'from-red-500 to-pink-500',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-effect rounded-2xl p-8 hover:shadow-2xl transition-all duration-300"
              >
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-effect rounded-3xl p-12 text-center"
          >
            <h2 className="text-4xl font-bold mb-6 gradient-text">Exclusivo para el Politécnico</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Carreras participantes: Desarrollo de Software, Química Industrial, Telecomunicaciones
              y Mecatrónica
            </p>
            <Button size="lg" onClick={() => navigate('/auth')} className="text-lg px-8 py-6">
              Comienza Tu Experiencia
            </Button>
          </motion.div>
        </div>
      </section>

      <footer className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16 px-6 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-white rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white rounded-full blur-2xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Main footer content */}
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand section */}
            <div className="md:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 mb-4"
              >
                <GraduationCap className="w-10 h-10 text-green-200" />
                <span className="text-2xl font-bold text-white">aportAR Politécnico</span>
              </motion.div>
              <p className="text-green-100 text-lg mb-6 max-w-md">
                La plataforma oficial del Instituto Politécnico de Formosa para conectar
                estudiantes, compartir proyectos y construir el futuro juntos.
              </p>
            </div>

            {/* Quick links */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-white">Enlaces Rápidos</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    target="_blank"
                    href=" https://www.facebook.com/IPFormosa"
                    className="text-green-100 hover:text-white transition-colors duration-200"
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    target="_blank"
                    href="https://www.instagram.com/ipformosa/"
                    className="text-green-100 hover:text-white transition-colors duration-200"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    target="_blank"
                    href=" https://www.ipf.edu.ar/"
                    className="text-green-100 hover:text-white transition-colors duration-200"
                  >
                    Web oficial del IPF
                  </a>
                </li>
              </ul>
            </div>

            {/* Carreras */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-white">Carreras</h3>
              <ul className="space-y-3 text-sm">
                <li className="text-green-100">Desarrollo de Software</li>
                <li className="text-green-100">Química Industrial</li>
                <li className="text-green-100">Telecomunicaciones</li>
                <li className="text-green-100">Mecatrónica</li>
              </ul>
            </div>
          </div>

          {/* Contact and social section */}
          <div className="border-t border-green-400/30 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left">
                <p className="text-lg font-medium text-white mb-1">© 2025 aportAR Politécnico</p>
                <p className="text-green-100">Instituto Politécnico de Formosa</p>
                <p className="text-green-200 mt-2 font-medium">
                  Conectando estudiantes, construyendo futuro
                </p>
              </div>

              {/* Logo */}
              <div className="flex justify-center">
                <img
                  src="/logo.png"
                  alt="Logo Instituto Politécnico de Formosa"
                  className="h-16 w-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default LandingPage;
