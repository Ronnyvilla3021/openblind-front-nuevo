/**
 * Configuración de Rutas
 * @description Define todas las rutas de la aplicación
 */

import { routePaths } from '../core/config/routes.config';

// Lazy loading de componentes para mejorar rendimiento
import { lazy } from 'react';

const DashboardScreen = lazy(() => import('../modules/dashboard/screens/DashboardScreen'));
const ConfigNavegacionScreen = lazy(() => import('../modules/configuracion/screens/ConfigNavegacionScreen'));
const ConfigPrivacidadScreen = lazy(() => import('../modules/configuracion/screens/ConfigPrivacidadScreen'));
const ConfigAccesibilidadScreen = lazy(() => import('../modules/configuracion/screens/ConfigAccesibilidadScreen'));
const IncidenciasScreen = lazy(() => import('../modules/incidencias/screens/IncidenciasScreen'));
const SoporteScreen = lazy(() => import('../modules/soporte/screens/SoporteScreen'));
const IDgScreen = lazy(() => import('../modules/config/screens/IDCardConfigScreen'));
const notificationScreen = lazy(() => import('../modules/config/screens/NotificationsConfigScreen'));

export const routes = [
  {
    path: routePaths.DASHBOARD,
    component: DashboardScreen,
    exact: true,
    private: true,
    title: 'Dashboard',
  },
  {
    path: routePaths.CONFIG_NAVEGACION,
    component: ConfigNavegacionScreen,
    private: true,
    title: 'Configuración de Navegación',
  },
  {
    path: routePaths.CONFIG_PRIVACIDAD,
    component: ConfigPrivacidadScreen,
    private: true,
    title: 'Configuración de Privacidad',
  },
  {
    path: routePaths.CONFIG_ACCESIBILIDAD,
    component: ConfigAccesibilidadScreen,
    private: true,
    title: 'Configuración de Accesibilidad',
  },
  {
    path: routePaths.INCIDENCIAS,
    component: IncidenciasScreen,
    private: true,
    title: 'Incidencias',
  },
  {
    path: routePaths.SOPORTE,
    component: SoporteScreen,
    private: true,
    title: 'Soporte',
  },
  {
    path: routePaths.CONFIG_ID,
    component: IDgScreen,
    private: true,
    title: 'TarjetaID',
  },
  {
    path: routePaths.CONFIG_NOTIFICATIONS,
    component: notificationScreen,
    private: true,
    title: 'Notificaciones',
  },
];

export default routes;
