import { ArrowLeft, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Support() {
  const [, setLocation] = useLocation();

  const handleBack = () => {
    setLocation("/main");
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <button onClick={handleBack} className="text-neutral-600 hover:text-neutral-800">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-neutral-800">Preguntas Frecuentes (FAQ)</h2>
            <p className="text-xs text-neutral-500">Última modificación: 26/06 – 08:55</p>
          </div>
          <div className="w-6"></div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="h-5 w-5 text-primary" />
          <p className="text-sm text-neutral-600">
            Encuentra respuestas a las preguntas más comunes sobre SafeMoney
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {/* General y Acceso */}
          <AccordionItem value="general" className="border border-neutral-200 rounded-lg">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <span className="font-medium text-neutral-800">General y Acceso</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    ¿Cómo inicio sesión en la aplicación?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    Ingresa tu <strong>Correo electrónico</strong> y <strong>Contraseña</strong> en la pantalla de inicio y toca "Iniciar Sesión".
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    ¿Qué hago si olvido mi contraseña?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    Actualmente no hay recuperación automática. Por favor, contacta a soporte técnico.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Evaluación de Productos */}
          <AccordionItem value="evaluacion" className="border border-neutral-200 rounded-lg">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <span className="font-medium text-neutral-800">Evaluación de Productos</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    ¿Cómo puedo empezar a evaluar productos?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    En la pantalla principal, toca "Evaluar Productos" para iniciar el cuestionario.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    ¿Cuál es el límite diario de evaluaciones?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    Hasta <strong>25 evaluaciones</strong> por día; tu progreso se muestra en la pantalla principal.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    ¿Cuánto puedo ganar por evaluación?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    Entre <strong>R$ 1,00</strong> y <strong>R$ 4,00</strong>, según el producto y complejidad; el rango aparece en cada tarjeta de producto.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    ¿Dónde veo mis ganancias recientes?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    En la sección "Ganancias Recientes" de la pantalla principal, con producto, fecha y monto.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Mi Billetera y Ganancias */}
          <AccordionItem value="billetera" className="border border-neutral-200 rounded-lg">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <span className="font-medium text-neutral-800">Mi Billetera y Ganancias</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    ¿Cómo veo mi saldo total?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    Tu saldo aparece en grande en "Mi Billetera" encima de la lista de transacciones.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    ¿Qué significan "Ganho Hoje" y "Avaliações Hoje"?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    "Ganho Hoje" es lo que ganaste hoy; "Avaliações Hoje" es cuántas completaste hoy.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    ¿Cómo retiro mis fondos?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    En "Mi Billetera", toca "Retirar Fondos" y sigue las instrucciones.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    ¿Por qué mis retiros están bloqueados?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    Por seguridad, los nuevos usuarios esperan un periodo antes de retirar.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    ¿Cuánto tiempo debo esperar para el primer retiro?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    La app muestra cuántos días faltan antes de habilitar el retiro.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    ¿Dónde veo mi historial de ganancias?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    En "Historial de Ganancias" dentro de "Mi Billetera", con detalles de cada evaluación.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Gestión de Perfil */}
          <AccordionItem value="perfil" className="border border-neutral-200 rounded-lg">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <span className="font-medium text-neutral-800">Gestión de Perfil</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    ¿Cómo edito mi perfil?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    En "Perfil", toca "Editar Perfil" para actualizar tu nombre o contraseña.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    ¿Dónde veo mis estadísticas de evaluación y ganancias?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    En "Perfil", verás totales de evaluaciones, ganancias y estadísticas diarias.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    ¿Puedo ajustar configuraciones en mi perfil?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    Hay una opción "Configuración", pero solo muestra información básica. Contacta soporte para cambios avanzados.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    ¿Cómo cierro sesión?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    En "Perfil", toca "Salir" para terminar tu sesión.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}