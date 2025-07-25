import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useAppState } from "@/hooks/use-app-state";
import api from "@/lib/api";

export default function Login() {
  const [, setLocation] = useLocation();
  const { fetchUser } = useAppState();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      // Chama a API de login do back-end
      const { data } = await api.post("/auth/login", formData);
      // Salva o access_token no localStorage
      localStorage.setItem("access_token", data.access_token);
      // Busca os dados do usuário autenticado e atualiza o estado global
      await fetchUser();
      setLocation("/main");
    } catch (err) {
      setError("Email ou senha incorretos.");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary p-6 flex flex-col justify-center">
      <div className="max-w-md mx-auto w-full">
        <div className="text-center mb-8">
          <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <img src="/onlylogo.png" alt="OnlyCash Logo" className="w-12 h-12 object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Entrar</h1>
          <p className="text-white/90 text-lg">Acesse sua conta</p>
        </div>
        <Card className="bg-white rounded-2xl shadow-xl">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">Email</Label>
                <Input id="email" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="seu@email.com" required />
              </div>
              <div>
                <Label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">Senha</Label>
                <Input id="password" type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} placeholder="Sua senha" required />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" disabled={isLoading} className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-primary/90 shadow-lg">
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
              <p className="text-sm text-neutral-500 text-center mt-2">
                Não tem uma conta?{' '}
                <span className="text-primary cursor-pointer underline" onClick={() => setLocation('/register')}>Cadastre-se</span>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 