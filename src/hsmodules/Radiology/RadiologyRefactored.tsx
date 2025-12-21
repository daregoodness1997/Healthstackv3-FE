import React from 'react';
import { Row, Col } from 'antd';
import RadiologyList from './components/RadiologyList';
import RadiologyCreate from './components/RadiologyCreate';
import RadiologyDetail from './components/RadiologyDetail';
import RadiologyModify from './components/RadiologyModify';
import { useRadiologyStore } from '../../stores/radiologyStore';
// @ts-ignore - JS module
import { ObjectContext } from '../../context';

/**
 * RadiologyRefactored Component
 * Main orchestrator for Radiology management interface
 */

const RadiologyRefactored: React.FC = () => {
  const { state } = React.useContext(ObjectContext) as any;
  const { activeView } = useRadiologyStore();

  const currentView = activeView || state.StoreModule?.show || 'list';

  return (
    <section className="section remPadTop">
      <Row gutter={16}>
        <Col xs={24} lg={16}>
          <RadiologyList />
        </Col>

        <Col xs={24} lg={8}>
          {currentView === 'create' && <RadiologyCreate onSuccess={() => {}} />}

          {currentView === 'detail' && <RadiologyDetail />}

          {currentView === 'modify' && <RadiologyModify onSuccess={() => {}} />}
        </Col>
      </Row>
    </section>
  );
};

export default RadiologyRefactored;
