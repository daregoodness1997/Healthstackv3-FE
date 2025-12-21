/**
 * Refactored Action Loader using Zustand
 *
 * This replaces the old Context-based action loader
 */

import React from 'react';
import { Spin } from 'antd';
import { useActionLoader } from '../../stores/uiStore';

export default function ActionLoaderRefactored() {
  const actionLoader = useActionLoader();

  if (!actionLoader.open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        zIndex: 999999,
      }}
    >
      <Spin size="large" />
      {actionLoader.message && (
        <div style={{ color: '#fff', marginTop: '16px', fontSize: '16px' }}>
          {actionLoader.message}
        </div>
      )}
    </div>
  );
}
