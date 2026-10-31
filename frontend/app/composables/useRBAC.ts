import { useAuthStore } from "~/stores/auth";

export function useRBAC() {
  const auth = useAuthStore();

  const can = (action: string): boolean => {
    const role = auth.user?.role;
    const perms: Record<string, string[]> = {
      "users:manage":          ["ADMIN"],
      "patients:delete":       ["ADMIN", "DOCTOR"],
      // El capturista registra solo datos básicos del paciente (sin observaciones)
      "patients:observations": ["ADMIN", "DOCTOR"],
      "studies:create":        ["ADMIN", "DOCTOR", "CAPTURISTA"],
      "studies:edit":          ["ADMIN", "DOCTOR", "CAPTURISTA"],
      "studies:delete":        ["ADMIN", "DOCTOR"],
      // Tipo de lesión y comentarios clínicos del estudio
      "studies:clinical":      ["ADMIN", "DOCTOR"],
      // Ejecutar la IA ("Analizar"); el capturista solo consulta resultados
      "analysis:run":          ["ADMIN", "DOCTOR"],
      // Ver y descargar reportes (nadie los elimina desde la app)
      "reports:export":        ["ADMIN", "DOCTOR", "CAPTURISTA"],
    };
    return !!role && (perms[action]?.includes(role) ?? false);
  };

  return { can };
}
