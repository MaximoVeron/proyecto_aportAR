import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap } from 'lucide-react';

const AuthPage = () => {
  const navigate = useNavigate();
  const { register, login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    career: ''
  });

  const handleLogin = (e) => {
    e.preventDefault();
    if (login(loginData.email, loginData.password)) {
      navigate('/dashboard');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (register(registerData)) {
      setIsLogin(true);
      setRegisterData({ name: '', email: '', password: '', role: '', career: '' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="glass-effect rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center justify-center gap-2 mb-8">
            <GraduationCap className="w-10 h-10 text-green-600 dark:text-green-400" />
            <span className="text-3xl font-bold gradient-text">aportAR Politécnico</span>
          </div>

          <Tabs value={isLogin ? "login" : "register"} onValueChange={(v) => setIsLogin(v === "login")}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="register">Registrarse</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="tu@email.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="login-password">Contraseña</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">Ingresar</Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input
                    id="name"
                    placeholder="Juan Pérez"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="role">Rol</Label>
                  <Select value={registerData.role} onValueChange={(v) => setRegisterData({ ...registerData, role: v, career: '' })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="estudiante">Estudiante</SelectItem>
                      <SelectItem value="profesor">Profesor</SelectItem>
                      <SelectItem value="administrativo">Administrativo</SelectItem>
                      <SelectItem value="trabajador">Trabajador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {registerData.role === 'estudiante' && (
                  <div>
                    <Label htmlFor="career">Carrera</Label>
                    <Select value={registerData.career} onValueChange={(v) => setRegisterData({ ...registerData, career: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu carrera" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Software">Desarrollo de Software</SelectItem>
                        <SelectItem value="Telecomunicaciones">Telecomunicaciones</SelectItem>
                        <SelectItem value="Química Industrial">Química Industrial</SelectItem>
                        <SelectItem value="Mecatrónica">Mecatrónica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <Button type="submit" className="w-full">Registrarse</Button>
              </form>
            </TabsContent>
          </Tabs>

          <Button variant="ghost" onClick={() => navigate('/')} className="w-full mt-4">
            Volver al inicio
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;