import React from 'react';
import { Row, Col } from 'antd';
import LabsList from './components/LabsList';
import LabCreate from './components/LabCreate';
import LabDetail from './components/LabDetail';
import LabModify from './components/LabModify';
import { useLaboratoryStore } from '../../stores/laboratoryStore';
// @ts-ignore - JS module
import { ObjectContext } from '../../context';

/**
 * LabsRefactored Component
 * Main orchestrator for Laboratory management interface
 *
 * Features:
 * - Split into focused sub-components
 * - Zustand for state management
 * - TanStack Query for data operations
 * - Ant Design UI
 * - Responsive layout
 */

const LabsRefactored: React.FC = () => {
  const { state } = React.useContext(ObjectContext) as any;
  const { activeView } = useLaboratoryStore();

  // Use store state, fallback to ObjectContext for backward compatibility
  const currentView = activeView || state.StoreModule?.show || 'list';

  return (
    <section className="section remPadTop">
      <Row gutter={16}>
        {/* Left Column - List */}
        <Col xs={24} lg={16}>
          <LabsList />
        </Col>

        {/* Right Column - Dynamic Content */}
        <Col xs={24} lg={8}>
          {currentView === 'create' && <LabCreate onSuccess={() => {}} />}

          {currentView === 'detail' && <LabDetail />}

          {currentView === 'modify' && <LabModify onSuccess={() => {}} />}
        </Col>
      </Row>
    </section>
  );
};

export default LabsRefactored;
