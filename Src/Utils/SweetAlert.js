/**
 * Global SweetAlert utility.
 *
 * 1. Place <SweetAlertProvider /> once inside App.js (after NavigationContainer).
 * 2. Call showAlert() from any screen — class or functional.
 *
 * showAlert({
 *   title:       'Done!',
 *   message:     'Animal saved.',
 *   type:        'success',          // 'success' | 'error' | 'warning' | 'confirm'
 *   confirmText: 'OK',               // optional override
 *   cancelText:  'No',               // optional override (confirm type only)
 *   onConfirm:   () => {},           // optional callback
 *   onCancel:    () => {},           // optional callback (confirm type only)
 * });
 */

import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Module-level setter — set once when the provider mounts
let _setConfig = null;

export const showAlert = (options = {}) => {
  if (_setConfig) {
    _setConfig({ ...DEFAULT_CONFIG, ...options, show: true });
  }
};

// ─── Type definitions ─────────────────────────────────────────────────────────

const TYPE_MAP = {
  success: {
    icon:       'checkmark-circle',
    iconColor:  '#3dac40',
    btnColor:   '#3dac40',
    confirmTxt: 'OK',
    showCancel: false,
  },
  error: {
    icon:       'close-circle',
    iconColor:  '#e53935',
    btnColor:   '#e53935',
    confirmTxt: 'OK',
    showCancel: false,
  },
  warning: {
    icon:       'warning',
    iconColor:  '#f57c00',
    btnColor:   '#f57c00',
    confirmTxt: 'OK',
    showCancel: false,
  },
  confirm: {
    icon:       'help-circle',
    iconColor:  '#1565c0',
    btnColor:   '#1565c0',
    confirmTxt: 'Yes',
    showCancel: true,
  },
};

const DEFAULT_CONFIG = {
  show:        false,
  title:       '',
  message:     '',
  type:        'success',
  confirmText: null,
  cancelText:  'Cancel',
  onConfirm:   null,
  onCancel:    null,
};

// ─── Provider — place this ONCE in App.js ─────────────────────────────────────

export default function SweetAlertProvider() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);

  useEffect(() => {
    _setConfig = setConfig;
    return () => { _setConfig = null; };
  }, []);

  const hide       = () => setConfig((prev) => ({ ...prev, show: false }));
  const typeConfig = TYPE_MAP[config.type] || TYPE_MAP.success;

  return (
    <AwesomeAlert
      show={config.show}
      showProgress={false}
      title={config.title}
      message={config.message}
      closeOnTouchOutside={!typeConfig.showCancel}
      closeOnHardwareBackPress={!typeConfig.showCancel}
      showCancelButton={typeConfig.showCancel}
      showConfirmButton
      cancelText={config.cancelText}
      confirmText={config.confirmText || typeConfig.confirmTxt}
      confirmButtonColor={typeConfig.btnColor}
      cancelButtonColor="#9e9e9e"
      titleStyle={{
        color:      typeConfig.iconColor,
        fontWeight: 'bold',
        fontSize:   20,
        textAlign:  'center',
      }}
      messageStyle={{
        color:     '#555',
        fontSize:  15,
        textAlign: 'center',
        marginTop: 4,
      }}
      customView={
        <View style={{ alignItems: 'center', marginBottom: 4 }}>
          <Ionicons
            name={typeConfig.icon}
            size={62}
            color={typeConfig.iconColor}
          />
        </View>
      }
      onCancelPressed={() => {
        hide();
        config.onCancel?.();
      }}
      onConfirmPressed={() => {
        hide();
        config.onConfirm?.();
      }}
      onDismiss={hide}
    />
  );
}
