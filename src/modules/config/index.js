/**
 * Módulo de Config - Exportaciones centralizadas
 * Este es el ÚNICO index.js (en modules/, NO en features/)
 * 
 * @author VILLA REYES RONNY XAVIER (N°4)
 */

// Screens
export { default as IDCardConfigScreen } from './screens/IDCardConfigScreen';
export { default as NotificationsConfigScreen } from './screens/NotificationsConfigScreen';

// Services
export { default as configService } from './services/configService';
export { configService as ConfigService } from './services/configService';

// Hooks (cuando se creen)
// export { useIDCardConfig } from './hooks/useIDCardConfig';
// export { useNotificationsConfig } from './hooks/useNotificationsConfig';

// Components (cuando se creen)
// export { IDCardFieldToggle } from './components/IDCardFieldToggle';
// export { NotificationChannelToggle } from './components/NotificationChannelToggle';
// export { TemplateEditor } from './components/TemplateEditor';