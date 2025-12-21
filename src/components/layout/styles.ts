import styled from 'styled-components';

export const LayoutWrapper = styled.div`
  position: relative;
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #f0f2f5;
`;

export const LayoutContent = styled.div`
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .layout {
    height: 100%;
  }

  .layout__content-main {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;

    /* Custom Scrollbar */
    &::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    &::-webkit-scrollbar-track {
      background: #f0f2f5;
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: #bfbfbf;
      border-radius: 4px;
      transition: background 0.2s ease;

      &:hover {
        background: #999;
      }
    }

    /* Smooth scrolling */
    scroll-behavior: smooth;

    /* Better font rendering */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .layout__content-main {
      padding: 16px !important;
    }
  }
`;

/* Page Container for consistent spacing */
export const PageContainer = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
`;

/* Content Section with card styling */
export const ContentSection = styled.section`
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 16px;
  box-shadow:
    0 1px 2px 0 rgba(0, 0, 0, 0.03),
    0 1px 6px -1px rgba(0, 0, 0, 0.02),
    0 2px 4px 0 rgba(0, 0, 0, 0.02);

  @media (max-width: 768px) {
    padding: 16px;
  }
`;
