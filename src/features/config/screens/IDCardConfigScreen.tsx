/**
 * Configuración de Tarjeta de Identificación - Features
 * src/features/config/screens/IDCardConfigScreen.tsx
 * 
 * @author Ronny Villa (N°5)
 * @updated Diseño mejorado con iconos
 */

import { useState, useEffect } from 'react';
import { Card, Button } from '../../../shared/components';
import { getConfiguracionGlobal, updateConfiguracionGlobal } from '../../../services/api';
import './IDnotificationsconfig.css';

export default function IDCardConfigScreen() {
  const [config, setConfig] = useState({
    // Configuración de campos de la tarjeta
    nombreCompleto: { visible: true, obligatorio: true, orden: 1 },
    email: { visible: true, obligatorio: true, orden: 2 },
    telefono: { visible: true, obligatorio: false, orden: 3 },
    direccion: { visible: true, obligatorio: false, orden: 4 },
    tipoSangre: { visible: false, obligatorio: false, orden: 5 },
    
    // Configuración de QR
    qrIncluirFoto: false,
    qrContactosEmergencia: true,
    qrInfoMedica: false,
    qrTipoSangre: false,
    qrAlergias: false,
    qrDiasExpiracion: 30,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response: any = await getConfiguracionGlobal();
      if (response.success) {
        if (response.data && response.data.idCardConfig) {
          setConfig({ ...config, ...response.data.idCardConfig });
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const dataToSend = {
        idCardConfig: config
      };
      
      const response: any = await updateConfiguracionGlobal(dataToSend);
      if (response.success) {
        alert('✅ Configuración guardada correctamente en la base de datos');
        await loadConfig();
      } else {
        alert('❌ Error: ' + (response.message || 'No se pudo guardar la configuración'));
      }
    } catch (error) {
      console.error('Error al guardar configuración:', error);
      alert('❌ Error de conexión: No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const camposVisibles = [
    config.nombreCompleto.visible,
    config.email.visible,
    config.telefono.visible,
    config.direccion.visible,
    config.tipoSangre.visible
  ].filter(Boolean).length;

  const camposObligatorios = [
    config.nombreCompleto.obligatorio,
    config.email.obligatorio,
    config.telefono.obligatorio,
    config.direccion.obligatorio
  ].filter(Boolean).length;

  const opcionesQRActivas = [
    config.qrIncluirFoto,
    config.qrContactosEmergencia,
    config.qrInfoMedica,
    config.qrTipoSangre,
    config.qrAlergias
  ].filter(Boolean).length;

  return (
    <div className="feat-idcard-config-screen">
      <div className="feat-idcard-page-header">
        <div>
          <h1>Configuración de Tarjeta de Identificación</h1>
          <p>Personaliza los campos de la tarjeta digital y la información del código QR</p>
        </div>
        <div className="feat-idcard-header-stats">
          <div className="feat-idcard-stat-box">
            <div className="feat-idcard-stat-number">{camposVisibles}</div>
            <div className="feat-idcard-stat-label">Campos Visibles</div>
          </div>
          <div className="feat-idcard-stat-box">
            <div className="feat-idcard-stat-number">{camposObligatorios}</div>
            <div className="feat-idcard-stat-label">Campos Obligatorios</div>
          </div>
          <div className="feat-idcard-stat-box">
            <div className="feat-idcard-stat-number">{opcionesQRActivas}</div>
            <div className="feat-idcard-stat-label">Opciones QR</div>
          </div>
        </div>
      </div>

      <div className="feat-idcard-config-content">
        {/* Tarjeta de Campos */}
        <Card
          title="Campos de la Tarjeta"
          subtitle="Configura qué campos son obligatorios, visibles y su orden"
          variant="default"
          hoverable={true}
          className="feat-idcard-config-card"
          data-type="fields"
          onClick={() => {}}
          icon={null}
        >
          <div className="feat-idcard-config-section">
            {/* Nombre Completo */}
            <div className="feat-idcard-config-item" data-field="nombreCompleto">
              <div className="feat-idcard-config-field-group">
                <label className="feat-idcard-checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={config.nombreCompleto.visible}
                    onChange={(e) => setConfig({ 
                      ...config, 
                      nombreCompleto: { 
                        ...config.nombreCompleto, 
                        visible: e.target.checked 
                      }
                    })} 
                  />
                  <span>Nombre Completo</span>
                </label>
                {config.nombreCompleto.visible && (
                  <label className="feat-idcard-checkbox-label feat-idcard-ml-3">
                    <input 
                      type="checkbox" 
                      checked={config.nombreCompleto.obligatorio}
                      onChange={(e) => setConfig({ 
                        ...config, 
                        nombreCompleto: { 
                          ...config.nombreCompleto, 
                          obligatorio: e.target.checked 
                        }
                      })} 
                    />
                    <span className="feat-idcard-text-sm">Obligatorio</span>
                  </label>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="feat-idcard-config-item" data-field="email">
              <div className="feat-idcard-config-field-group">
                <label className="feat-idcard-checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={config.email.visible}
                    onChange={(e) => setConfig({ 
                      ...config, 
                      email: { 
                        ...config.email, 
                        visible: e.target.checked 
                      }
                    })} 
                  />
                  <span>Email</span>
                </label>
                {config.email.visible && (
                  <label className="feat-idcard-checkbox-label feat-idcard-ml-3">
                    <input 
                      type="checkbox" 
                      checked={config.email.obligatorio}
                      onChange={(e) => setConfig({ 
                        ...config, 
                        email: { 
                          ...config.email, 
                          obligatorio: e.target.checked 
                        }
                      })} 
                    />
                    <span className="feat-idcard-text-sm">Obligatorio</span>
                  </label>
                )}
              </div>
            </div>

            {/* Teléfono */}
            <div className="feat-idcard-config-item" data-field="telefono">
              <div className="feat-idcard-config-field-group">
                <label className="feat-idcard-checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={config.telefono.visible}
                    onChange={(e) => setConfig({ 
                      ...config, 
                      telefono: { 
                        ...config.telefono, 
                        visible: e.target.checked 
                      }
                    })} 
                  />
                  <span>Teléfono</span>
                </label>
                {config.telefono.visible && (
                  <label className="feat-idcard-checkbox-label feat-idcard-ml-3">
                    <input 
                      type="checkbox" 
                      checked={config.telefono.obligatorio}
                      onChange={(e) => setConfig({ 
                        ...config, 
                        telefono: { 
                          ...config.telefono, 
                          obligatorio: e.target.checked 
                        }
                      })} 
                    />
                    <span className="feat-idcard-text-sm">Obligatorio</span>
                  </label>
                )}
              </div>
            </div>

            {/* Dirección */}
            <div className="feat-idcard-config-item" data-field="direccion">
              <div className="feat-idcard-config-field-group">
                <label className="feat-idcard-checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={config.direccion.visible}
                    onChange={(e) => setConfig({ 
                      ...config, 
                      direccion: { 
                        ...config.direccion, 
                        visible: e.target.checked 
                      }
                    })} 
                  />
                  <span>Dirección</span>
                </label>
                {config.direccion.visible && (
                  <label className="feat-idcard-checkbox-label feat-idcard-ml-3">
                    <input 
                      type="checkbox" 
                      checked={config.direccion.obligatorio}
                      onChange={(e) => setConfig({ 
                        ...config, 
                        direccion: { 
                          ...config.direccion, 
                          obligatorio: e.target.checked 
                        }
                      })} 
                    />
                    <span className="feat-idcard-text-sm">Obligatorio</span>
                  </label>
                )}
              </div>
            </div>

            {/* Tipo de Sangre */}
            <div className="feat-idcard-config-item" data-field="tipoSangre">
              <label className="feat-idcard-checkbox-label">
                <input 
                  type="checkbox" 
                  checked={config.tipoSangre.visible}
                  onChange={(e) => setConfig({ 
                    ...config, 
                    tipoSangre: { 
                      ...config.tipoSangre, 
                      visible: e.target.checked 
                    }
                  })} 
                />
                <span>Tipo de Sangre</span>
              </label>
            </div>
          </div>
        </Card>

        {/* Tarjeta de QR */}
        <Card
          title="Código QR"
          subtitle="Selecciona qué información se incluirá en el código QR"
          variant="default"
          hoverable={true}
          className="feat-idcard-config-card"
          data-type="qr"
          onClick={() => {}}
          icon={null}
        >
          <div className="feat-idcard-config-section">
            {/* Incluir Foto */}
            <div className="feat-idcard-config-item" data-option="qrIncluirFoto">
              <label className="feat-idcard-checkbox-label">
                <input 
                  type="checkbox" 
                  checked={config.qrIncluirFoto}
                  onChange={(e) => setConfig({ ...config, qrIncluirFoto: e.target.checked })} 
                />
                <span>Incluir Foto de Perfil</span>
              </label>
            </div>

            {/* Contactos de Emergencia */}
            <div className="feat-idcard-config-item" data-option="qrContactosEmergencia">
              <label className="feat-idcard-checkbox-label">
                <input 
                  type="checkbox" 
                  checked={config.qrContactosEmergencia}
                  onChange={(e) => setConfig({ ...config, qrContactosEmergencia: e.target.checked })} 
                />
                <span>
                  Contactos de Emergencia
                  <span className="feat-idcard-recommended">Recomendado</span>
                </span>
              </label>
            </div>

            {/* Información Médica */}
            <div className="feat-idcard-config-item" data-option="qrInfoMedica">
              <label className="feat-idcard-checkbox-label">
                <input 
                  type="checkbox" 
                  checked={config.qrInfoMedica}
                  onChange={(e) => setConfig({ ...config, qrInfoMedica: e.target.checked })} 
                />
                <span>Información Médica</span>
              </label>
            </div>

            {/* Tipo de Sangre */}
            <div className="feat-idcard-config-item" data-option="qrTipoSangre">
              <label className="feat-idcard-checkbox-label">
                <input 
                  type="checkbox" 
                  checked={config.qrTipoSangre}
                  onChange={(e) => setConfig({ ...config, qrTipoSangre: e.target.checked })} 
                />
                <span>Tipo de Sangre</span>
              </label>
            </div>

            {/* Alergias */}
            <div className="feat-idcard-config-item" data-option="qrAlergias">
              <label className="feat-idcard-checkbox-label">
                <input 
                  type="checkbox" 
                  checked={config.qrAlergias}
                  onChange={(e) => setConfig({ ...config, qrAlergias: e.target.checked })} 
                />
                <span>
                  Alergias
                  <span className="feat-idcard-recommended">Recomendado</span>
                </span>
              </label>
            </div>

            {/* Tiempo de expiración */}
            <div className="feat-idcard-slider-container" data-option="qrDiasExpiracion">
              <label>Tiempo de expiración del QR</label>
              <div className="feat-idcard-days-display">
                {config.qrDiasExpiracion} día{config.qrDiasExpiracion !== 1 ? 's' : ''}
              </div>
              <input 
                type="range" 
                min="1" 
                max="90" 
                value={config.qrDiasExpiracion} 
                onChange={(e) => setConfig({ ...config, qrDiasExpiracion: parseInt(e.target.value) })} 
                className="feat-idcard-slider" 
              />
              <div className="feat-idcard-quick-presets">
                <button 
                  onClick={() => setConfig({ ...config, qrDiasExpiracion: 7 })} 
                  className={config.qrDiasExpiracion === 7 ? 'feat-idcard-active' : ''}
                >
                  1 semana
                </button>
                <button 
                  onClick={() => setConfig({ ...config, qrDiasExpiracion: 30 })} 
                  className={config.qrDiasExpiracion === 30 ? 'feat-idcard-active' : ''}
                >
                  1 mes
                </button>
                <button 
                  onClick={() => setConfig({ ...config, qrDiasExpiracion: 90 })} 
                  className={config.qrDiasExpiracion === 90 ? 'feat-idcard-active' : ''}
                >
                  3 meses
                </button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="feat-idcard-action-buttons">
        <Button 
          variant="primary"
          size="lg"
          disabled={loading}
          loading={loading}
          fullWidth={false}
          leftIcon={null}
          rightIcon={null}
          className="feat-idcard-save-button"
          onClick={handleSave}
        >
          {loading ? 'Guardando...' : 'Guardar Configuración'}
        </Button>
      </div>
    </div>
  );
}