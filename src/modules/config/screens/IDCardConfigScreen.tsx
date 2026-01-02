/**
 * Configuración de Tarjeta de Identificación - Módulos
 * 
 * @author [Tu Nombre]
 */

import { useState, useEffect } from 'react';
import { Card, Button, Toast } from '../../../shared/components';
import { getConfiguracionGlobal, updateConfiguracionGlobal } from '../../../services/api';
import './config.css';

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
      console.error('Error:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const dataToSend = { idCardConfig: config };
      const response: any = await updateConfiguracionGlobal(dataToSend);
      
      if (response.success) {
        setToast({ 
          message: 'Configuración de Tarjeta ID guardada correctamente en MySQL', 
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
    <div className="config-screen">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="page-header">
        <div>
          <h1>🪪 Configuración de Tarjeta de Identificación</h1>
          <p>Personaliza los campos de la tarjeta digital y la información del código QR (Módulos)</p>
        </div>
        <div className="header-stats">
          <div className="stat-box">
            <div className="stat-number">{camposVisibles}</div>
            <div className="stat-label">Campos Visibles</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">{camposObligatorios}</div>
            <div className="stat-label">Campos Obligatorios</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">{opcionesQRActivas}</div>
            <div className="stat-label">Opciones QR</div>
          </div>
        </div>
      </div>

      <div className="config-content">
        <Card
          title="Campos de la Tarjeta"
          subtitle="Configura qué campos son obligatorios, visibles y su orden"
          variant="default"
          hoverable={true}
          className="config-card"
          onClick={() => {}}
          icon={null}
        >
          {/* Mismo contenido que el archivo anterior */}
          <div className="config-section">
            {/* ... mismo contenido que features ... */}
          </div>
        </Card>

        <Card
          title="Código QR"
          subtitle="Selecciona qué información se incluirá en el código QR"
          variant="default"
          hoverable={true}
          className="config-card"
          onClick={() => {}}
          icon={null}
        >
          <div className="config-section">
            {/* ... mismo contenido que features ... */}
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
          {loading ? 'Guardando...' : '💾 Guardar Configuración'}
        </Button>
      </div>
    </div>
  );
}