/**
 * Configuración de Tarjeta de Identificación - Módulos
 * src/modules/config/screens/IDCardConfigScreen.tsx
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

export default function IDCardConfigScreen() {
  const [config, setConfig] = useState({
    nombreCompleto: { visible: true, obligatorio: true, orden: 1 },
    email: { visible: true, obligatorio: true, orden: 2 },
    telefono: { visible: true, obligatorio: false, orden: 3 },
    direccion: { visible: true, obligatorio: false, orden: 4 },
    tipoSangre: { visible: false, obligatorio: false, orden: 5 },

    qrIncluirFoto: false,
    qrContactosEmergencia: true,
    qrInfoMedica: false,
    qrTipoSangre: false,
    qrAlergias: false,
    qrDiasExpiracion: 30,
  });

  const [toast, setToast] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response: any = await getConfiguracionGlobal();
      if (response.success && response.data && response.data.idCardConfig) {
        setConfig({ ...config, ...response.data.idCardConfig });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const dataToSend = { idCardConfig: config };
      const response: any = await updateConfiguracionGlobal(dataToSend);

      if (response.success) {
        setToast({
          message: "Configuración guardada correctamente en MySQL",
          type: "success",
        });
        await loadConfig();
      } else {
        setToast({
          message: "Error: " + (response.message || "No se pudo guardar"),
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error al guardar configuración:", error);
      setToast({
        message:
          "Error de conexión: No se pudo conectar con el servidor en http://localhost:8888", // ✅ Igual que ejemplo
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const camposVisibles = [
    config.nombreCompleto.visible,
    config.email.visible,
    config.telefono.visible,
    config.direccion.visible,
    config.tipoSangre.visible,
  ].filter(Boolean).length;

  const camposObligatorios = [
    config.nombreCompleto.obligatorio,
    config.email.obligatorio,
    config.telefono.obligatorio,
    config.direccion.obligatorio,
  ].filter(Boolean).length;

  const opcionesQRActivas = [
    config.qrIncluirFoto,
    config.qrContactosEmergencia,
    config.qrInfoMedica,
    config.qrTipoSangre,
    config.qrAlergias,
  ].filter(Boolean).length;

  return (
    <div className="mod-idcard-config-screen">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="mod-idcard-page-header">
        <div>
          <div className="mod-idcard-header-icon">🪪</div>
          <div>
            <h1>Configuración de Tarjeta de Identificación</h1>
            <p>
              Personaliza los campos de la tarjeta digital y la información del
              código QR (Módulos)
            </p>
          </div>
        </div>
        <div className="mod-idcard-header-stats">
          <div className="mod-idcard-stat-box">
            <div className="mod-idcard-stat-number">{camposVisibles}</div>
            <div className="mod-idcard-stat-label">Campos Visibles</div>
          </div>
          <div className="mod-idcard-stat-box">
            <div className="mod-idcard-stat-number">{camposObligatorios}</div>
            <div className="mod-idcard-stat-label">Campos Obligatorios</div>
          </div>
          <div className="mod-idcard-stat-box">
            <div className="mod-idcard-stat-number">{opcionesQRActivas}</div>
            <div className="mod-idcard-stat-label">Opciones QR</div>
          </div>
        </div>
      </div>

      <div className="mod-idcard-config-content">
        {/* Tarjeta de Campos - Versión Premium */}
        <Card
          title="Campos de la Tarjeta"
          subtitle="Configura qué campos son obligatorios, visibles y su orden"
          variant="default"
          hoverable={true}
          className="mod-idcard-config-card"
          onClick={() => {}}
          icon={<div className="card-title-icon">📋</div>}
        >
          <div className="mod-idcard-config-section">
            {/* Nombre Completo */}
            <div className="mod-idcard-config-item" data-field="nombreCompleto">
              <div className="mod-idcard-config-item-content">
                <div className="mod-idcard-field-icon">👤</div>
                <label className="mod-idcard-config-label">
                  <input
                    type="checkbox"
                    checked={config.nombreCompleto.visible}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        nombreCompleto: {
                          ...config.nombreCompleto,
                          visible: e.target.checked,
                        },
                      })
                    }
                  />
                  Nombre Completo
                </label>
              </div>
              {config.nombreCompleto.visible && (
                <div className="mod-idcard-checkbox-group">
                  <label className="mod-idcard-checkbox-label">
                    <div className="mod-idcard-custom-checkbox">
                      <input
                        type="checkbox"
                        checked={config.nombreCompleto.obligatorio}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            nombreCompleto: {
                              ...config.nombreCompleto,
                              obligatorio: e.target.checked,
                            },
                          })
                        }
                      />
                      <span className="check-icon">✓</span>
                    </div>
                    <span className="mod-idcard-checkbox-text">
                      Obligatorio
                    </span>
                  </label>
                </div>
              )}
            </div>

            {/* Email */}
            <div className="mod-idcard-config-item" data-field="email">
              <div className="mod-idcard-config-item-content">
                <div className="mod-idcard-field-icon">✉️</div>
                <label className="mod-idcard-config-label">
                  <input
                    type="checkbox"
                    checked={config.email.visible}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        email: {
                          ...config.email,
                          visible: e.target.checked,
                        },
                      })
                    }
                  />
                  Email
                </label>
              </div>
              {config.email.visible && (
                <div className="mod-idcard-checkbox-group">
                  <label className="mod-idcard-checkbox-label">
                    <div className="mod-idcard-custom-checkbox">
                      <input
                        type="checkbox"
                        checked={config.email.obligatorio}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            email: {
                              ...config.email,
                              obligatorio: e.target.checked,
                            },
                          })
                        }
                      />
                      <span className="check-icon">✓</span>
                    </div>
                    <span className="mod-idcard-checkbox-text">
                      Obligatorio
                    </span>
                  </label>
                </div>
              )}
            </div>

            {/* Teléfono */}
            <div className="mod-idcard-config-item" data-field="telefono">
              <div className="mod-idcard-config-item-content">
                <div className="mod-idcard-field-icon">📱</div>
                <label className="mod-idcard-config-label">
                  <input
                    type="checkbox"
                    checked={config.telefono.visible}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        telefono: {
                          ...config.telefono,
                          visible: e.target.checked,
                        },
                      })
                    }
                  />
                  Teléfono
                </label>
              </div>
              {config.telefono.visible && (
                <div className="mod-idcard-checkbox-group">
                  <label className="mod-idcard-checkbox-label">
                    <div className="mod-idcard-custom-checkbox">
                      <input
                        type="checkbox"
                        checked={config.telefono.obligatorio}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            telefono: {
                              ...config.telefono,
                              obligatorio: e.target.checked,
                            },
                          })
                        }
                      />
                      <span className="check-icon">✓</span>
                    </div>
                    <span className="mod-idcard-checkbox-text">
                      Obligatorio
                    </span>
                  </label>
                </div>
              )}
            </div>

            {/* Dirección */}
            <div className="mod-idcard-config-item" data-field="direccion">
              <div className="mod-idcard-config-item-content">
                <div className="mod-idcard-field-icon">📍</div>
                <label className="mod-idcard-config-label">
                  <input
                    type="checkbox"
                    checked={config.direccion.visible}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        direccion: {
                          ...config.direccion,
                          visible: e.target.checked,
                        },
                      })
                    }
                  />
                  Dirección
                </label>
              </div>
              {config.direccion.visible && (
                <div className="mod-idcard-checkbox-group">
                  <label className="mod-idcard-checkbox-label">
                    <div className="mod-idcard-custom-checkbox">
                      <input
                        type="checkbox"
                        checked={config.direccion.obligatorio}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            direccion: {
                              ...config.direccion,
                              obligatorio: e.target.checked,
                            },
                          })
                        }
                      />
                      <span className="check-icon">✓</span>
                    </div>
                    <span className="mod-idcard-checkbox-text">
                      Obligatorio
                    </span>
                  </label>
                </div>
              )}
            </div>

            {/* Tipo de Sangre */}
            <div className="mod-idcard-config-item" data-field="tipoSangre">
              <div className="mod-idcard-config-item-content">
                <div className="mod-idcard-field-icon">💉</div>
                <label className="mod-idcard-config-label">
                  <input
                    type="checkbox"
                    checked={config.tipoSangre.visible}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        tipoSangre: {
                          ...config.tipoSangre,
                          visible: e.target.checked,
                        },
                      })
                    }
                  />
                  Tipo de Sangre
                </label>
              </div>
            </div>
          </div>
        </Card>

        {/* Tarjeta de QR - Versión Premium */}
        <Card
          title="Código QR"
          subtitle="Selecciona qué información se incluirá en el código QR"
          variant="default"
          hoverable={true}
          className="mod-idcard-config-card"
          onClick={() => {}}
          icon={<div className="card-title-icon">🔳</div>}
        >
          <div className="mod-idcard-config-section">
            {/* Incluir Foto */}
            <div className="mod-idcard-config-item" data-option="qrIncluirFoto">
              <div className="mod-idcard-config-item-content">
                <div className="mod-idcard-field-icon">📸</div>
                <label className="mod-idcard-config-label">
                  <input
                    type="checkbox"
                    checked={config.qrIncluirFoto}
                    onChange={(e) =>
                      setConfig({ ...config, qrIncluirFoto: e.target.checked })
                    }
                  />
                  Incluir Foto de Perfil
                </label>
              </div>
            </div>

            {/* Contactos de Emergencia */}
            <div
              className="mod-idcard-config-item"
              data-option="qrContactosEmergencia"
            >
              <div className="mod-idcard-config-item-content">
                <div className="mod-idcard-field-icon">🚨</div>
                <label className="mod-idcard-config-label">
                  <input
                    type="checkbox"
                    checked={config.qrContactosEmergencia}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        qrContactosEmergencia: e.target.checked,
                      })
                    }
                  />
                  Contactos de Emergencia
                  <span className="mod-idcard-recommended">Recomendado</span>
                </label>
              </div>
            </div>

            {/* Información Médica */}
            <div className="mod-idcard-config-item" data-option="qrInfoMedica">
              <div className="mod-idcard-config-item-content">
                <div className="mod-idcard-field-icon">🏥</div>
                <label className="mod-idcard-config-label">
                  <input
                    type="checkbox"
                    checked={config.qrInfoMedica}
                    onChange={(e) =>
                      setConfig({ ...config, qrInfoMedica: e.target.checked })
                    }
                  />
                  Información Médica
                </label>
              </div>
            </div>

            {/* Tipo de Sangre */}
            <div className="mod-idcard-config-item" data-option="qrTipoSangre">
              <div className="mod-idcard-config-item-content">
                <div className="mod-idcard-field-icon">🩸</div>
                <label className="mod-idcard-config-label">
                  <input
                    type="checkbox"
                    checked={config.qrTipoSangre}
                    onChange={(e) =>
                      setConfig({ ...config, qrTipoSangre: e.target.checked })
                    }
                  />
                  Tipo de Sangre
                </label>
              </div>
            </div>

            {/* Alergias */}
            <div className="mod-idcard-config-item" data-option="qrAlergias">
              <div className="mod-idcard-config-item-content">
                <div className="mod-idcard-field-icon">🤧</div>
                <label className="mod-idcard-config-label">
                  <input
                    type="checkbox"
                    checked={config.qrAlergias}
                    onChange={(e) =>
                      setConfig({ ...config, qrAlergias: e.target.checked })
                    }
                  />
                  Alergias
                  <span className="mod-idcard-recommended">Recomendado</span>
                </label>
              </div>
            </div>

            {/* Tiempo de expiración */}
            <div className="mod-idcard-slider-container">
              <div className="mod-idcard-slider-header">
                <label>Tiempo de expiración del QR</label>
                <div className="mod-idcard-days-value">
                  {config.qrDiasExpiracion}
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="90"
                value={config.qrDiasExpiracion}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    qrDiasExpiracion: parseInt(e.target.value),
                  })
                }
                className="mod-idcard-slider"
              />
              <div className="mod-idcard-quick-presets">
                <button
                  onClick={() => setConfig({ ...config, qrDiasExpiracion: 7 })}
                  className={`mod-idcard-preset-btn ${
                    config.qrDiasExpiracion === 7 ? "mod-idcard-active" : ""
                  }`}
                >
                  <div className="mod-idcard-preset-icon">📅</div>1 semana
                </button>
                <button
                  onClick={() => setConfig({ ...config, qrDiasExpiracion: 30 })}
                  className={`mod-idcard-preset-btn ${
                    config.qrDiasExpiracion === 30 ? "mod-idcard-active" : ""
                  }`}
                >
                  <div className="mod-idcard-preset-icon">🗓️</div>1 mes
                </button>
                <button
                  onClick={() => setConfig({ ...config, qrDiasExpiracion: 90 })}
                  className={`mod-idcard-preset-btn ${
                    config.qrDiasExpiracion === 90 ? "mod-idcard-active" : ""
                  }`}
                >
                  <div className="mod-idcard-preset-icon">📆</div>3 meses
                </button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="mod-idcard-action-buttons">
        <Button
          variant="primary"
          size="lg"
          disabled={loading}
          loading={loading}
          fullWidth={false}
          leftIcon={null}
          rightIcon={null}
          className="mod-idcard-save-button"
          onClick={handleSave}
        >
          <span className="mod-idcard-save-icon">💾</span>
          {loading ? "Guardando..." : "Guardar Configuración"}
        </Button>
      </div>
    </div>
  );
}
