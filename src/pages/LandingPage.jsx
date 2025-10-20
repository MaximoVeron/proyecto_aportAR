import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, Users, Lightbulb, AlertCircle, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <nav className="glass-effect fixed top-0 w-full z-50 py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-green-600 dark:text-green-400" />
            <span className="text-2xl font-bold gradient-text">aportAR Politécnico</span>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3 items-center">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
            <Button variant="outline" onClick={() => navigate('/auth')}>
              Iniciar Sesión
            </Button>
            <Button onClick={() => navigate('/auth')}>
              Registrarse
            </Button>
          </motion.div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-16">
            <h1 className="text-6xl font-bold mb-6 gradient-text">
              Conecta, Colabora, Crece
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              La plataforma oficial del Instituto Politécnico de Formosa para compartir proyectos, 
              proponer mejoras y resolver desafíos institucionales juntos.
            </p>
            <Button size="lg" onClick={() => navigate('/auth')} className="text-lg px-8 py-6">
              Únete Ahora
            </Button>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative rounded-3xl overflow-hidden shadow-2xl">
            <img className="w-full h-[500px] object-cover" alt="Estudiantes del Politécnico colaborando" src="https://horizons-cdn.hostinger.com/8dd8155e-64e6-4fdb-9cd7-f35577bd5a5c/banneraportar-XjyNu.png" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white/50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-4xl font-bold text-center mb-16 gradient-text">¿Qué puedes hacer en aportAR?</motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[{
            icon: Users,
            title: "Proyectos",
            description: "Comparte tus trabajos académicos y desarrollos con toda la comunidad",
            color: "from-blue-500 to-blue-600"
          }, {
            icon: Lightbulb,
            title: "Sugerencias",
            description: "Propón ideas y mejoras para fortalecer nuestra institución",
            color: "from-yellow-500 to-orange-500"
          }, {
            icon: AlertCircle,
            title: "Problemáticas",
            description: "Colabora en la resolución de desafíos institucionales",
            color: "from-red-500 to-pink-500"
          }].map((feature, index) => <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="glass-effect rounded-2xl p-8 hover:shadow-2xl transition-all duration-300">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </motion.div>)}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-effect rounded-3xl p-12 text-center">
            <h2 className="text-4xl font-bold mb-6 gradient-text">
              Exclusivo para el Politécnico
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Carreras participantes: Desarrollo de Software, Química Industrial, 
              Telecomunicaciones y Mecatrónica
            </p>
            <Button size="lg" onClick={() => navigate('/auth')} className="text-lg px-8 py-6">
              Comienza Tu Experiencia
            </Button>
          </motion.div>
        </div>
      </section>

      <footer className="bg-gradient-to-r from-green-600 to-green-800 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-lg">© 2025 aportAR Politécnico - Instituto Politécnico de Formosa</p>
          <p className="text-green-100 mt-2">Conectando estudiantes, construyendo futuro</p>
        </div>
      </footer>
    </div>;
};
export default LandingPage;