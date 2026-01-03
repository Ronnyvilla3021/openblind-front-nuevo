/**
 * Configuración de Notificaciones - Features
 * src/features/config/screens/NotificationsConfigScreen.tsx
 *
 * @author Ronny Villa (N°5)
 * @updated Diseño mejorado con iconos
 */

import { useState, useEffect } from "react";
import { Card, Button } from "../../../shared/components";
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

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response: any = await getConfiguracionGlobal();
      if (response.success) {
        if (response.data && response.data.notificationsConfig) {
          setConfig({ ...config, ...response.data.notificationsConfig });
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const dataToSend = {
        notificationsConfig: config,
      };

      const response: any = await updateConfiguracionGlobal(dataToSend);
      if (response.success) {
        alert(
          "✅ Configuración de notificaciones guardada correctamente en la base de datos"
        );
        await loadConfig();
      } else {
        alert(
          "❌ Error: " +
            (response.message || "No se pudo guardar la configuración")
        );
      }
    } catch (error) {
      console.error("Error al guardar configuración:", error);
      alert("❌ Error de conexión: No se pudo conectar con el servidor");
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

  return (
    <div className="feat-notif-config-screen">
      <div className="feat-notif-page-header">
        <div>
          <h1>Configuración de Notificaciones</h1>
          <p>Gestiona los canales de comunicación y personaliza los mensajes</p>
        </div>
        <div className="feat-notif-header-stats">
          <div className="feat-notif-stat-box">
            <div className="feat-notif-stat-number">{canalesActivos}/3</div>
            <div className="feat-notif-stat-label">Canales Activos</div>
          </div>
          <div className="feat-notif-stat-box">
            <div className="feat-notif-stat-number">{plantillasActivas}/5</div>
            <div className="feat-notif-stat-label">Plantillas Activas</div>
          </div>
          <div className="feat-notif-stat-box">
            <div className="feat-notif-stat-number">
              {totalNotificacionesActivas()}
            </div>
            <div className="feat-notif-stat-label">Notificaciones</div>
          </div>
        </div>
      </div>

      <div className="feat-notif-config-content">
        {/* Tarjeta de Canales */}
        <Card
          title="Canales de Notificación"
          subtitle="Activa y configura los canales de comunicación disponibles"
          variant="default"
          hoverable={true}
          className="feat-notif-config-card"
          data-type="channels"
          onClick={() => {}}
          icon={null}
        >
          <div className="feat-notif-config-section">
            {/* Push Notifications */}
            <div className="feat-notif-channel-item">
              <div className="feat-notif-channel-header" data-channel="push">
                <div className="feat-notif-channel-icon">📱</div>
                <div className="feat-notif-channel-label">
                  Push Notifications
                </div>
                <label className="feat-notif-switch">
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
                  <span className="feat-notif-slider"></span>
                </label>
              </div>
              {config.pushNotifications.enabled && (
                <div className="feat-notif-subitems">
                  {Object.entries(config.pushNotifications)
                    .filter(([key]) => key !== "enabled")
                    .map(([key, value]) => (
                      <div
                        key={key}
                        className="feat-notif-subitem"
                        data-type={key}
                      >
                        <div className="feat-notif-subitem-icon">
                          {getNotificationIcon(key)}
                        </div>
                        <div className="feat-notif-subitem-label">
                          {getNotificationTypeLabel(key)}
                        </div>
                        <label className="feat-notif-switch">
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
                          <span className="feat-notif-slider"></span>
                        </label>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Email Notifications */}
            <div className="feat-notif-channel-item">
              <div className="feat-notif-channel-header" data-channel="email">
                <div className="feat-notif-channel-icon">📧</div>
                <div className="feat-notif-channel-label">Email</div>
                <label className="feat-notif-switch">
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
                  <span className="feat-notif-slider"></span>
                </label>
              </div>
              {config.emailNotifications.enabled && (
                <div className="feat-notif-subitems">
                  {Object.entries(config.emailNotifications)
                    .filter(([key]) => key !== "enabled")
                    .map(([key, value]) => (
                      <div
                        key={key}
                        className="feat-notif-subitem"
                        data-type={key}
                      >
                        <div className="feat-notif-subitem-icon">
                          {getNotificationIcon(key)}
                        </div>
                        <div className="feat-notif-subitem-label">
                          {getNotificationTypeLabel(key)}
                        </div>
                        <label className="feat-notif-switch">
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
                          <span className="feat-notif-slider"></span>
                        </label>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* SMS Notifications */}
            <div className="feat-notif-channel-item">
              <div className="feat-notif-channel-header" data-channel="sms">
                <div className="feat-notif-channel-icon">💬</div>
                <div className="feat-notif-channel-label">SMS</div>
                <label className="feat-notif-switch">
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
                  <span className="feat-notif-slider"></span>
                </label>
              </div>
              {config.smsNotifications.enabled && (
                <div className="feat-notif-subitems">
                  {Object.entries(config.smsNotifications)
                    .filter(([key]) => key !== "enabled")
                    .map(([key, value]) => (
                      <div
                        key={key}
                        className="feat-notif-subitem"
                        data-type={key}
                      >
                        <div className="feat-notif-subitem-icon">
                          {getNotificationIcon(key)}
                        </div>
                        <div className="feat-notif-subitem-label">
                          {getNotificationTypeLabel(key)}
                        </div>
                        <label className="feat-notif-switch">
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
                          <span className="feat-notif-slider"></span>
                        </label>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Tarjeta de Plantillas */}
        <Card
          title="Plantillas de Mensajes"
          subtitle="Personaliza el contenido de cada tipo de notificación"
          variant="default"
          hoverable={true}
          className="feat-notif-config-card"
          data-type="templates"
          onClick={() => {}}
          icon={null}
        >
          <div className="feat-notif-config-section">
            {/* Plantilla Inicio de Ruta */}
            <div className="feat-notif-template-item">
              <div className="feat-notif-template-header">
                <div className="feat-notif-template-icon">🚶</div>
                <div className="feat-notif-template-label">Inicio de Ruta</div>
                <label className="feat-notif-switch">
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
                  <span className="feat-notif-slider"></span>
                </label>
              </div>
              {config.templateRouteStart.enabled && (
                <div className="feat-notif-template-fields">
                  <div className="feat-notif-field-group">
                    <label
                      className="feat-notif-field-label"
                      data-field="subject"
                    >
                      Asunto:
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
                      className="feat-notif-input"
                      placeholder="Ej: Inicio de Ruta - OpenBlind"
                    />
                  </div>
                  <div className="feat-notif-field-group">
                    <label className="feat-notif-field-label" data-field="body">
                      Cuerpo del mensaje:
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
                      className="feat-notif-textarea"
                      placeholder="Ej: Hola {{userName}}, has iniciado tu ruta hacia {{destination}}."
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Texto Legal */}
            <div className="feat-notif-legal-area">
              <div className="feat-notif-legal-header">
                <div className="feat-notif-legal-title">
                  Texto Legal y Aviso de Privacidad
                </div>
              </div>
              <textarea
                value={config.legalText}
                onChange={(e) =>
                  setConfig({ ...config, legalText: e.target.value })
                }
                className="feat-notif-legal-textarea"
                placeholder="Este texto aparecerá al final de todas las notificaciones por email..."
              />
              <div
                style={{
                  fontSize: "var(--font-size-xs)",
                  color: "var(--color-text-secondary)",
                  marginTop: "var(--spacing-2)",
                }}
              >
                <strong>Variables disponibles:</strong> {"{{"}userName{"}}"},{" "}
                {"{{"}destination{"}}"}, {"{{"}location{"}}"}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="feat-notif-action-buttons">
        <Button
          variant="primary"
          size="lg"
          disabled={loading}
          loading={loading}
          fullWidth={false}
          leftIcon={null}
          rightIcon={null}
          className="feat-notif-save-button"
          onClick={handleSave}
        >
          {loading ? "Guardando..." : "Guardar Configuración de Notificaciones"}
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
