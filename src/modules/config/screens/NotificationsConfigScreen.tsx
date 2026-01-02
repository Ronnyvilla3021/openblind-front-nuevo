/**
 * Configuración de Notificaciones - Módulos
 * 
 * @author [Tu Nombre]
 */

import { useState, useEffect } from 'react';
import { Card, Button, Toast } from '../../../shared/components';
import { getConfiguracionGlobal, updateConfiguracionGlobal } from '../../../services/api';
import "./config.css";

export default function NotificationsConfigScreen() {
  const [config, setConfig] = useState({
    pushNotifications: { 
      enabled: true,
      route_start: true,
      route_end: true,
      safety_alert: true,
      support_message: true,
      emergency: true
    },
    emailNotifications: { 
      enabled: false,
      route_start: false,
      route_end: false,
      safety_alert: false,
      support_message: true,
      emergency: true
    },
    smsNotifications: { 
      enabled: false,
      route_start: false,
      route_end: false,
      safety_alert: false,
      support_message: false,
      emergency: true
    },
    
    templateRouteStart: {
      subject: 'Inicio de Ruta - OpenBlind',
      body: 'Hola {{userName}}, has iniciado tu ruta hacia {{destination}}.',
      enabled: true
    },
    templateRouteEnd: {
      subject: 'Ruta Finalizada - OpenBlind',
      body: 'Hola {{userName}}, has finalizado tu ruta exitosamente.',
      enabled: true
    },
    templateSafetyAlert: {
      subject: 'Alerta de Seguridad - OpenBlind',
      body: 'Alerta: Se ha detectado una situación de riesgo en {{location}}.',
      enabled: true
    },
    templateSupportMessage: {
      subject: 'Mensaje de Soporte - OpenBlind',
      body: 'Hola {{userName}}, hemos recibido tu mensaje. Te responderemos pronto.',
      enabled: true
    },
    templateEmergency: {
      subject: 'EMERGENCIA - OpenBlind',
      body: 'EMERGENCIA: {{userName}} ha activado una alerta de emergencia en {{location}}.',
      enabled: true
    },
    
    legalText: 'Este mensaje fue enviado por OpenBlind. Para dejar de recibir notificaciones, actualiza tus preferencias en la aplicación.'
  });

  const [toast, setToast] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response: any = await getConfiguracionGlobal();
      if (response.success && response.data && response.data.notificationsConfig) {
        setConfig({ ...config, ...response.data.notificationsConfig });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const dataToSend = { notificationsConfig: config };
      const response: any = await updateConfiguracionGlobal(dataToSend);
      
      if (response.success) {
        setToast({ 
          message: 'Configuración de Notificaciones guardada correctamente en MySQL', 
          type: 'success' 
        });
        await loadConfig();
      } else {
        setToast({ 
          message: 'Error: ' + (response.message || 'No se pudo guardar la configuración'), 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error al guardar configuración:', error);
      setToast({ 
        message: 'Error de conexión con el servidor', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Calcular estadísticas
  const canalesActivos = [
    config.pushNotifications.enabled,
    config.emailNotifications.enabled,
    config.smsNotifications.enabled
  ].filter(Boolean).length;

  const plantillasActivas = [
    config.templateRouteStart.enabled,
    config.templateRouteEnd.enabled,
    config.templateSafetyAlert.enabled,
    config.templateSupportMessage.enabled,
    config.templateEmergency.enabled
  ].filter(Boolean).length;

  const totalNotificacionesActivas = () => {
    let total = 0;
    if (config.pushNotifications.enabled) {
      total += Object.values(config.pushNotifications).filter(val => val === true).length - 1;
    }
    if (config.emailNotifications.enabled) {
      total += Object.values(config.emailNotifications).filter(val => val === true).length - 1;
    }
    if (config.smsNotifications.enabled) {
      total += Object.values(config.smsNotifications).filter(val => val === true).length - 1;
    }
    return total;
  };

  return (
    <div className="config-screen">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="page-header">
        <div>
          <h1>🔔 Configuración de Notificaciones</h1>
          <p>Gestiona los canales de comunicación y personaliza los mensajes (Módulos)</p>
        </div>
        <div className="header-stats">
          <div className="stat-box">
            <div className="stat-number">{canalesActivos}/3</div>
            <div className="stat-label">Canales Activos</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">{plantillasActivas}/5</div>
            <div className="stat-label">Plantillas Activas</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">{totalNotificacionesActivas()}</div>
            <div className="stat-label">Notificaciones</div>
          </div>
        </div>
      </div>

      <div className="config-content">
        {/* Contenido idéntico al archivo de features, con pequeñas diferencias en el UI */}
        <Card
          title="Canales de Notificación"
          subtitle="Activa y configura los canales de comunicación disponibles"
          variant="default"
          hoverable={true}
          className="config-card"
          onClick={() => {}}
          icon={null}
        >
          <div className="config-section">
            {/* Push Notifications */}
            <div className="config-item">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={config.pushNotifications.enabled}
                  onChange={(e) => setConfig({ 
                    ...config, 
                    pushNotifications: { 
                      ...config.pushNotifications, 
                      enabled: e.target.checked 
                    }
                  })} 
                />
                <span className="font-medium">📱 Push Notifications</span>
              </label>
              {config.pushNotifications.enabled && (
                <div className="ml-6 mt-2 space-y-2">
                  {Object.entries(config.pushNotifications)
                    .filter(([key]) => key !== 'enabled')
                    .map(([key, value]) => (
                      <label key={key} className="checkbox-label block">
                        <input 
                          type="checkbox" 
                          checked={value as boolean}
                          onChange={(e) => setConfig({ 
                            ...config, 
                            pushNotifications: { 
                              ...config.pushNotifications, 
                              [key]: e.target.checked 
                            }
                          })} 
                        />
                        <span className="text-sm ml-2">{getNotificationTypeLabel(key)}</span>
                      </label>
                    ))}
                </div>
              )}
            </div>

            {/* Email Notifications */}
            <div className="config-item mt-4">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={config.emailNotifications.enabled}
                  onChange={(e) => setConfig({ 
                    ...config, 
                    emailNotifications: { 
                      ...config.emailNotifications, 
                      enabled: e.target.checked 
                    }
                  })} 
                />
                <span className="font-medium">📧 Email</span>
              </label>
              {config.emailNotifications.enabled && (
                <div className="ml-6 mt-2 space-y-2">
                  {Object.entries(config.emailNotifications)
                    .filter(([key]) => key !== 'enabled')
                    .map(([key, value]) => (
                      <label key={key} className="checkbox-label block">
                        <input 
                          type="checkbox" 
                          checked={value as boolean}
                          onChange={(e) => setConfig({ 
                            ...config, 
                            emailNotifications: { 
                              ...config.emailNotifications, 
                              [key]: e.target.checked 
                            }
                          })} 
                        />
                        <span className="text-sm ml-2">{getNotificationTypeLabel(key)}</span>
                      </label>
                    ))}
                </div>
              )}
            </div>

            {/* SMS Notifications */}
            <div className="config-item mt-4">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={config.smsNotifications.enabled}
                  onChange={(e) => setConfig({ 
                    ...config, 
                    smsNotifications: { 
                      ...config.smsNotifications, 
                      enabled: e.target.checked 
                    }
                  })} 
                />
                <span className="font-medium">💬 SMS</span>
              </label>
              {config.smsNotifications.enabled && (
                <div className="ml-6 mt-2 space-y-2">
                  {Object.entries(config.smsNotifications)
                    .filter(([key]) => key !== 'enabled')
                    .map(([key, value]) => (
                      <label key={key} className="checkbox-label block">
                        <input 
                          type="checkbox" 
                          checked={value as boolean}
                          onChange={(e) => setConfig({ 
                            ...config, 
                            smsNotifications: { 
                              ...config.smsNotifications, 
                              [key]: e.target.checked 
                            }
                          })} 
                        />
                        <span className="text-sm ml-2">{getNotificationTypeLabel(key)}</span>
                      </label>
                    ))}
                </div>
              )}
            </div>
          </div>
        </Card>

        <Card
          title="Plantillas de Mensajes"
          subtitle="Personaliza el contenido de cada tipo de notificación"
          variant="default"
          hoverable={true}
          className="config-card"
          onClick={() => {}}
          icon={null}
        >
          <div className="config-section">
            {/* Contenido similar al archivo features pero con indicadores de módulo */}
            <div className="config-item">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={config.templateRouteStart.enabled}
                  onChange={(e) => setConfig({ 
                    ...config, 
                    templateRouteStart: { 
                      ...config.templateRouteStart, 
                      enabled: e.target.checked 
                    }
                  })} 
                />
                <span className="font-medium">🚶 Inicio de Ruta (Módulo)</span>
              </label>
              {config.templateRouteStart.enabled && (
                <div className="ml-6 mt-2 space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Asunto:</label>
                    <input 
                      type="text" 
                      value={config.templateRouteStart.subject}
                      onChange={(e) => setConfig({ 
                        ...config, 
                        templateRouteStart: { 
                          ...config.templateRouteStart, 
                          subject: e.target.value 
                        }
                      })} 
                      className="w-full p-2 border rounded"
                      placeholder="Ej: Inicio de Ruta - OpenBlind"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Cuerpo del mensaje:</label>
                    <textarea 
                      value={config.templateRouteStart.body}
                      onChange={(e) => setConfig({ 
                        ...config, 
                        templateRouteStart: { 
                          ...config.templateRouteStart, 
                          body: e.target.value 
                        }
                      })} 
                      className="w-full p-2 border rounded h-20"
                      placeholder="Ej: Hola {{userName}}, has iniciado tu ruta hacia {{destination}}."
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Texto Legal - Versión Módulo */}
            <div className="config-item mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">📜 Texto Legal y Aviso de Privacidad (Módulo)</label>
              <textarea 
                value={config.legalText}
                onChange={(e) => setConfig({ ...config, legalText: e.target.value })}
                className="w-full p-2 border rounded h-32"
                placeholder="Este texto aparecerá al final de todas las notificaciones por email..."
              />
            </div>
          </div>
        </Card>
      </div>

      <div className="action-buttons">
        <Button 
          variant="primary"
          size="lg"
          disabled={loading}
          loading={loading}
          fullWidth={false}
          leftIcon={null}
          rightIcon={null}
          className="save-button"
          onClick={handleSave}
        >
          {loading ? 'Guardando en MySQL...' : '💾 Guardar Configuración de Notificaciones'}
        </Button>
      </div>
    </div>
  );
}

// Función auxiliar para obtener etiquetas de tipos de notificación
function getNotificationTypeLabel(type: string): string {
  const labels: { [key: string]: string } = {
    'route_start': 'Inicio de Ruta',
    'route_end': 'Fin de Ruta',
    'safety_alert': 'Alerta de Seguridad',
    'support_message': 'Mensaje de Soporte',
    'emergency': 'Emergencia'
  };
  return labels[type] || type;
}