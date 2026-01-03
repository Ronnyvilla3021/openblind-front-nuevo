/**
 * Config Service - Gestión de configuración de Tarjeta ID y Notificaciones
 *
 * @description Servicio UNIFICADO para gestionar las 2 pantallas de configuración:
 *              - Tarjeta ID (features/config y modules/config)
 *              - Notificaciones (features/config y modules/config)
 *
 * Este servicio está en modules/config/services/ y es usado por ambas carpetas
 *
 * @author VILLA REYES RONNY XAVIER (N°4)
 */

import http from '../../../core/services/httpClient';
import { API_ENDPOINTS } from '../../../core/constants/endpoints';

export const configService = {
  /**
   * Obtiene la configuración global del sistema (incluye idCardConfig y notificationsConfig)
   * @returns {Promise<object>} Configuración global
   */
  getConfiguracionGlobal: async () => {
    return http.get(API_ENDPOINTS.CONFIG_PANTALLAS.GET);
  },

  /**
   * Actualiza la configuración global (formato plano o anidado)
   * Soporta actualizar idCardConfig y/o notificationsConfig
   * @param {object} data - Datos de configuración
   * @returns {Promise<object>} Configuración actualizada
   */
  updateConfiguracionGlobal: async (data) => {
    return http.put(API_ENDPOINTS.CONFIG_PANTALLAS.UPDATE, data);
  },

  /**
   * Obtiene solo la configuración de Tarjeta ID
   * @returns {Promise<object>} Configuración de Tarjeta ID
   */
  getIDCardConfig: async () => {
    const response = await http.get(API_ENDPOINTS.CONFIG_PANTALLAS.GET);
    return {
      success: response.success,
      data: response.data?.idCardConfig || {}
    };
  },

  /**
   * Actualiza solo la configuración de Tarjeta ID
   * @param {object} idCardConfig - Configuración de Tarjeta ID
   * @returns {Promise<object>} Configuración actualizada
   */
  updateIDCardConfig: async (idCardConfig) => {
    return http.put(API_ENDPOINTS.CONFIG_PANTALLAS.UPDATE, { idCardConfig });
  },

  /**
   * Obtiene solo la configuración de Notificaciones
   * @returns {Promise<object>} Configuración de Notificaciones
   */
  getNotificationsConfig: async () => {
    const response = await http.get(API_ENDPOINTS.CONFIG_PANTALLAS.GET);
    return {
      success: response.success,
      data: response.data?.notificationsConfig || {}
    };
  },

  /**
   * Actualiza solo la configuración de Notificaciones
   * @param {object} notificationsConfig - Configuración de Notificaciones
   * @returns {Promise<object>} Configuración actualizada
   */
  updateNotificationsConfig: async (notificationsConfig) => {
    return http.put(API_ENDPOINTS.CONFIG_PANTALLAS.UPDATE, { notificationsConfig });
  },

  /**
   * Actualiza un campo específico de la configuración
   * @param {string} field - Nombre del campo (ej: 'idCardConfig.nombreCompleto.visible')
   * @param {any} value - Valor del campo
   * @returns {Promise<object>} Configuración actualizada
   */
  updateConfigField: async (field, value) => {
    return http.patch(API_ENDPOINTS.CONFIG_PANTALLAS.UPDATE_FIELD, { field, value });
  },

  /**
   * Resetea la configuración a valores por defecto
   * @param {string} tipo - Tipo de reseteo ('todo', 'idCard', 'notifications')
   * @returns {Promise<object>} Configuración reseteada
   */
  resetConfiguracion: async (tipo = 'todo') => {
    return http.post(API_ENDPOINTS.CONFIG_PANTALLAS.RESET, { tipo });
  },
};

export default configService;