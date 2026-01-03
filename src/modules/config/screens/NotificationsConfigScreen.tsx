/**
 * Configuración de Notificaciones - Módulos
 * src/modules/config/screens/NotificationsConfigScreen.tsx
 *
 * @author Ronny Villa (N°5)
 * @updated Diseño premium con iconos
 */

import { useState, useEffect } from "react";
import { Card, Button, Toast } from "../../../shared/components";
import {
  getConfiguracionGlobal,
  updateConfiguracionGlobal,
} from "../../../services/api";
import "./IDnotificationsconfig.css";

export default function NotificationsConfigScreen() {
  const [config, setConfig] = useState({
    pushNotifications: {
      enabled: true,
      route_start: true,
      route_end: true,
      safety_alert: true,
      support_message: true,
      emergency: true,
    },
    emailNotifications: {
      enabled: false,
      route_start: false,
      route_end: false,
      safety_alert: false,
      support_message: true,
      emergency: true,
    },
    smsNotifications: {
      enabled: false,
      route_start: false,
      route_end: false,
      safety_alert: false,
      support_message: false,
      emergency: true,
    },

    templateRouteStart: {
      subject: "Inicio de Ruta - OpenBlind",
      body: "Hola {{userName}}, has iniciado tu ruta hacia {{destination}}.",
      enabled: true,
    },
    templateRouteEnd: {
      subject: "Ruta Finalizada - OpenBlind",
      body: "Hola {{userName}}, has finalizado tu ruta exitosamente.",
      enabled: true,
    },
    templateSafetyAlert: {
      subject: "Alerta de Seguridad - OpenBlind",
      body: "Alerta: Se ha detectado una situación de riesgo en {{location}}.",
      enabled: true,
    },
    templateSupportMessage: {
      subject: "Mensaje de Soporte - OpenBlind",
      body: "Hola {{userName}}, hemos recibido tu mensaje. Te responderemos pronto.",
      enabled: true,
    },
    templateEmergency: {
      subject: "EMERGENCIA - OpenBlind",
      body: "EMERGENCIA: {{userName}} ha activado una alerta de emergencia en {{location}}.",
      enabled: true,
    },

    legalText:
      "Este mensaje fue enviado por OpenBlind. Para dejar de recibir notificaciones, actualiza tus preferencias en la aplicación.",
  });

  const [toast, setToast] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response: any = await getConfiguracionGlobal();
      if (
        response.success &&
        response.data &&
        response.data.notificationsConfig
      ) {
        setConfig({ ...config, ...response.data.notificationsConfig });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const dataToSend = { notificationsConfig: config };
      const response: any = await updateConfiguracionGlobal(dataToSend);

      if (response.success) {
        setToast({
          message:
            "Configuración de Notificaciones guardada correctamente en MySQL",
          type: "success",
        });
        await loadConfig();
      } else {
        setToast({
          message:
            "Error: " +
            (response.message || "No se pudo guardar la configuración"),
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error al guardar configuración:", error);
      setToast({
        message: "Error de conexión con el servidor",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const canalesActivos = [
    config.pushNotifications.enabled,
    config.emailNotifications.enabled,
    config.smsNotifications.enabled,
  ].filter(Boolean).length;

  const plantillasActivas = [
    config.templateRouteStart.enabled,
    config.templateRouteEnd.enabled,
    config.templateSafetyAlert.enabled,
    config.templateSupportMessage.enabled,
    config.templateEmergency.enabled,
  ].filter(Boolean).length;

  const totalNotificacionesActivas = () => {
    let total = 0;
    if (config.pushNotifications.enabled) {
      total +=
        Object.values(config.pushNotifications).filter((val) => val === true)
          .length - 1;
    }
    if (config.emailNotifications.enabled) {
      total +=
        Object.values(config.emailNotifications).filter((val) => val === true)
          .length - 1;
    }
    if (config.smsNotifications.enabled) {
      total +=
        Object.values(config.smsNotifications).filter((val) => val === true)
          .length - 1;
    }
    return total;
  };

  const getNotificationIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      route_start: "🚶",
      route_end: "🏁",
      safety_alert: "⚠️",
      support_message: "💬",
      emergency: "🚨",
    };
    return icons[type] || "📌";
  };

  const getNotificationDesc = (type: string) => {
    const desc: { [key: string]: string } = {
      route_start: "Se envía cuando el usuario inicia una ruta",
      route_end: "Se envía cuando el usuario finaliza una ruta",
      safety_alert: "Alerta sobre situaciones de riesgo detectadas",
      support_message: "Confirmación de recepción de mensajes de soporte",
      emergency: "Alerta de emergencia activada por el usuario",
    };
    return desc[type] || "Tipo de notificación";
  };

  return (
    <div className="mod-notif-config-screen">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="mod-notif-page-header">
        <div>
          <div className="mod-notif-header-icon">🔔</div>
          <div>
            <h1>Configuración de Notificaciones</h1>
            <p>
              Gestiona los canales de comunicación y personaliza los mensajes
              (Módulos)
            </p>
          </div>
        </div>
        <div className="mod-notif-header-stats">
          <div className="mod-notif-stat-box">
            <div className="mod-notif-stat-number">{canalesActivos}/3</div>
            <div className="mod-notif-stat-label">Canales Activos</div>
          </div>
          <div className="mod-notif-stat-box">
            <div className="mod-notif-stat-number">{plantillasActivas}/5</div>
            <div className="mod-notif-stat-label">Plantillas Activas</div>
          </div>
          <div className="mod-notif-stat-box">
            <div className="mod-notif-stat-number">
              {totalNotificacionesActivas()}
            </div>
            <div className="mod-notif-stat-label">Notificaciones</div>
          </div>
        </div>
      </div>

      <div className="mod-notif-config-content">
        {/* Tarjeta de Canales - Premium */}
        <Card
          title="Canales de Notificación"
          subtitle="Activa y configura los canales de comunicación disponibles"
          variant="default"
          hoverable={true}
          className="mod-notif-config-card"
          onClick={() => {}}
          icon={<div className="card-title-icon">📡</div>}
        >
          <div className="mod-notif-config-section">
            {/* Push Notifications */}
            <div className="mod-notif-channel-card" data-channel="push">
              <div className="mod-notif-channel-header">
                <div className="mod-notif-channel-icon-wrapper">
                  <span className="mod-notif-channel-icon">📱</span>
                </div>
                <div className="mod-notif-channel-info">
                  <div className="mod-notif-channel-title">
                    Push Notifications
                  </div>
                  <div className="mod-notif-channel-description">
                    Notificaciones en tiempo real en la aplicación móvil
                  </div>
                </div>
                <div className="mod-notif-switch-container">
                  <label className="mod-notif-switch">
                    <input
                      type="checkbox"
                      checked={config.pushNotifications.enabled}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          pushNotifications: {
                            ...config.pushNotifications,
                            enabled: e.target.checked,
                          },
                        })
                      }
                    />
                    <span className="mod-notif-switch-slider"></span>
                  </label>
                </div>
              </div>
              {config.pushNotifications.enabled && (
                <div className="mod-notif-subitems-grid">
                  {Object.entries(config.pushNotifications)
                    .filter(([key]) => key !== "enabled")
                    .map(([key, value]) => (
                      <div
                        key={key}
                        className="mod-notif-subitem-card"
                        data-type={key}
                      >
                        <div className="mod-notif-subitem-icon">
                          {getNotificationIcon(key)}
                        </div>
                        <div className="mod-notif-subitem-info">
                          <div className="mod-notif-subitem-title">
                            {getNotificationTypeLabel(key)}
                          </div>
                          <div className="mod-notif-subitem-desc">
                            {getNotificationDesc(key)}
                          </div>
                        </div>
                        <label className="mod-notif-switch">
                          <input
                            type="checkbox"
                            checked={value as boolean}
                            onChange={(e) =>
                              setConfig({
                                ...config,
                                pushNotifications: {
                                  ...config.pushNotifications,
                                  [key]: e.target.checked,
                                },
                              })
                            }
                          />
                          <span className="mod-notif-switch-slider"></span>
                        </label>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Email Notifications */}
            <div className="mod-notif-channel-card" data-channel="email">
              <div className="mod-notif-channel-header">
                <div className="mod-notif-channel-icon-wrapper">
                  <span className="mod-notif-channel-icon">📧</span>
                </div>
                <div className="mod-notif-channel-info">
                  <div className="mod-notif-channel-title">Email</div>
                  <div className="mod-notif-channel-description">
                    Notificaciones por correo electrónico con plantillas
                    personalizadas
                  </div>
                </div>
                <div className="mod-notif-switch-container">
                  <label className="mod-notif-switch">
                    <input
                      type="checkbox"
                      checked={config.emailNotifications.enabled}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          emailNotifications: {
                            ...config.emailNotifications,
                            enabled: e.target.checked,
                          },
                        })
                      }
                    />
                    <span className="mod-notif-switch-slider"></span>
                  </label>
                </div>
              </div>
              {config.emailNotifications.enabled && (
                <div className="mod-notif-subitems-grid">
                  {Object.entries(config.emailNotifications)
                    .filter(([key]) => key !== "enabled")
                    .map(([key, value]) => (
                      <div
                        key={key}
                        className="mod-notif-subitem-card"
                        data-type={key}
                      >
                        <div className="mod-notif-subitem-icon">
                          {getNotificationIcon(key)}
                        </div>
                        <div className="mod-notif-subitem-info">
                          <div className="mod-notif-subitem-title">
                            {getNotificationTypeLabel(key)}
                          </div>
                          <div className="mod-notif-subitem-desc">
                            {getNotificationDesc(key)}
                          </div>
                        </div>
                        <label className="mod-notif-switch">
                          <input
                            type="checkbox"
                            checked={value as boolean}
                            onChange={(e) =>
                              setConfig({
                                ...config,
                                emailNotifications: {
                                  ...config.emailNotifications,
                                  [key]: e.target.checked,
                                },
                              })
                            }
                          />
                          <span className="mod-notif-switch-slider"></span>
                        </label>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* SMS Notifications */}
            <div className="mod-notif-channel-card" data-channel="sms">
              <div className="mod-notif-channel-header">
                <div className="mod-notif-channel-icon-wrapper">
                  <span className="mod-notif-channel-icon">💬</span>
                </div>
                <div className="mod-notif-channel-info">
                  <div className="mod-notif-channel-title">SMS</div>
                  <div className="mod-notif-channel-description">
                    Notificaciones por mensaje de texto para alertas críticas
                  </div>
                </div>
                <div className="mod-notif-switch-container">
                  <label className="mod-notif-switch">
                    <input
                      type="checkbox"
                      checked={config.smsNotifications.enabled}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          smsNotifications: {
                            ...config.smsNotifications,
                            enabled: e.target.checked,
                          },
                        })
                      }
                    />
                    <span className="mod-notif-switch-slider"></span>
                  </label>
                </div>
              </div>
              {config.smsNotifications.enabled && (
                <div className="mod-notif-subitems-grid">
                  {Object.entries(config.smsNotifications)
                    .filter(([key]) => key !== "enabled")
                    .map(([key, value]) => (
                      <div
                        key={key}
                        className="mod-notif-subitem-card"
                        data-type={key}
                      >
                        <div className="mod-notif-subitem-icon">
                          {getNotificationIcon(key)}
                        </div>
                        <div className="mod-notif-subitem-info">
                          <div className="mod-notif-subitem-title">
                            {getNotificationTypeLabel(key)}
                          </div>
                          <div className="mod-notif-subitem-desc">
                            {getNotificationDesc(key)}
                          </div>
                        </div>
                        <label className="mod-notif-switch">
                          <input
                            type="checkbox"
                            checked={value as boolean}
                            onChange={(e) =>
                              setConfig({
                                ...config,
                                smsNotifications: {
                                  ...config.smsNotifications,
                                  [key]: e.target.checked,
                                },
                              })
                            }
                          />
                          <span className="mod-notif-switch-slider"></span>
                        </label>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Tarjeta de Plantillas - Premium */}
        <Card
          title="Plantillas de Mensajes"
          subtitle="Personaliza el contenido de cada tipo de notificación"
          variant="default"
          hoverable={true}
          className="mod-notif-config-card"
          onClick={() => {}}
          icon={<div className="card-title-icon">📝</div>}
        >
          <div className="mod-notif-config-section">
            {/* Plantilla Inicio de Ruta */}
            <div className="mod-notif-template-card">
              <div className="mod-notif-template-header">
                <div className="mod-notif-template-icon-wrapper">🚶</div>
                <div className="mod-notif-template-title">Inicio de Ruta</div>
                <div className="mod-notif-switch-container">
                  <label className="mod-notif-switch">
                    <input
                      type="checkbox"
                      checked={config.templateRouteStart.enabled}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          templateRouteStart: {
                            ...config.templateRouteStart,
                            enabled: e.target.checked,
                          },
                        })
                      }
                    />
                    <span className="mod-notif-switch-slider"></span>
                  </label>
                </div>
              </div>
              {config.templateRouteStart.enabled && (
                <div className="mod-notif-template-fields">
                  <div className="mod-notif-input-group">
                    <label
                      className="mod-notif-input-label"
                      data-field="subject"
                    >
                      Asunto del Email
                    </label>
                    <input
                      type="text"
                      value={config.templateRouteStart.subject}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          templateRouteStart: {
                            ...config.templateRouteStart,
                            subject: e.target.value,
                          },
                        })
                      }
                      className="mod-notif-input"
                      placeholder="Ej: Inicio de Ruta - OpenBlind"
                    />
                  </div>
                  <div className="mod-notif-input-group">
                    <label className="mod-notif-input-label" data-field="body">
                      Cuerpo del Mensaje
                    </label>
                    <textarea
                      value={config.templateRouteStart.body}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          templateRouteStart: {
                            ...config.templateRouteStart,
                            body: e.target.value,
                          },
                        })
                      }
                      className="mod-notif-textarea"
                      placeholder="Ej: Hola {{userName}}, has iniciado tu ruta hacia {{destination}}."
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Área Legal */}
            <div className="mod-notif-legal-section">
              <div className="mod-notif-legal-header">
                <div className="mod-notif-legal-icon">⚖️</div>
                <div className="mod-notif-legal-title">
                  Texto Legal y Aviso de Privacidad
                </div>
              </div>
              <textarea
                value={config.legalText}
                onChange={(e) =>
                  setConfig({ ...config, legalText: e.target.value })
                }
                className="mod-notif-legal-textarea"
                placeholder="Este texto aparecerá al final de todas las notificaciones por email..."
              />
              <div className="mod-notif-variables-help">
                <strong>Variables disponibles:</strong> {"{{"}userName{"}}"},{" "}
                {"{{"}destination{"}}"}, {"{{"}location{"}}"}, {"{{"}date{"}}"},{" "}
                {"{{"}time{"}}"}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="mod-notif-action-buttons">
        <Button
          variant="primary"
          size="lg"
          disabled={loading}
          loading={loading}
          fullWidth={false}
          leftIcon={null}
          rightIcon={null}
          className="mod-notif-save-button"
          onClick={handleSave}
        >
          <span className="mod-notif-save-icon">💾</span>
          {loading
            ? "Guardando en MySQL..."
            : "Guardar Configuración de Notificaciones"}
        </Button>
      </div>
    </div>
  );
}

function getNotificationTypeLabel(type: string): string {
  const labels: { [key: string]: string } = {
    route_start: "Inicio de Ruta",
    route_end: "Fin de Ruta",
    safety_alert: "Alerta de Seguridad",
    support_message: "Mensaje de Soporte",
    emergency: "Emergencia",
  };
  return labels[type] || type;
}
