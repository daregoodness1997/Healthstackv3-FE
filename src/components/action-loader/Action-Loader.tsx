import React, { useContext } from 'react';
import { Spin } from 'antd';
import { ObjectContext } from '../../context';
import styled from 'styled-components';

const BackdropOverlay = styled.div<{ open: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: ${(props) => (props.open ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.45);
  z-index: 999999;
`;

const SpinContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

const MessageText = styled.div`
  color: #fff;
  font-size: 16px;
  text-align: center;
`;

export default function ActionLoader() {
  const context = useContext(ObjectContext);

  // Return null if context is not available
  if (!context || !context.state) {
    return null;
  }

  const { state } = context;

  return (
    <BackdropOverlay open={state?.actionLoader?.open || false}>
      <SpinContainer>
        <Spin size="large" />
        {state?.actionLoader?.message && (
          <MessageText>{state.actionLoader.message}</MessageText>
        )}
      </SpinContainer>
    </BackdropOverlay>
  );
}
