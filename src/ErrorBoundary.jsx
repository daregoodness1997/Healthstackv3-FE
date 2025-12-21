import { Component } from 'react';
import { Result, Button, Typography } from 'antd';
import { FrownOutlined, HomeOutlined, ReloadOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

const { Paragraph, Text } = Typography;

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const isDevelopment = import.meta.env.DEV;

      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#fff',
            padding: '20px',
          }}
        >
          <div
            style={{
              maxWidth: '600px',
              width: '100%',
              background: 'white',
              borderRadius: '8px',
              padding: '48px 24px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.01)',
            }}
          >
            <Result
              status="error"
              icon={
                <FrownOutlined style={{ fontSize: 72, color: '#ff4d4f' }} />
              }
              title={
                <span
                  style={{ fontSize: 28, fontWeight: 600, color: '#262626' }}
                >
                  Oops! Something went wrong
                </span>
              }
              subTitle={
                <div style={{ marginTop: 16 }}>
                  <Paragraph
                    style={{ fontSize: 16, color: '#595959', marginBottom: 24 }}
                  >
                    We&apos;re sorry, but something unexpected happened. The
                    page you were viewing has encountered an error.
                  </Paragraph>

                  {isDevelopment && this.state.error && (
                    <div
                      style={{
                        background: '#f5f5f5',
                        padding: '16px',
                        borderRadius: '8px',
                        marginTop: 16,
                        textAlign: 'left',
                        maxHeight: '200px',
                        overflow: 'auto',
                      }}
                    >
                      <Text
                        strong
                        style={{
                          color: '#d32f2f',
                          display: 'block',
                          marginBottom: 8,
                        }}
                      >
                        Error Details:
                      </Text>
                      <Text
                        code
                        style={{ fontSize: 12, wordBreak: 'break-word' }}
                      >
                        {this.state.error.toString()}
                      </Text>
                    </div>
                  )}
                </div>
              }
              extra={[
                <Button
                  key="home"
                  type="primary"
                  size="large"
                  icon={<HomeOutlined />}
                  onClick={this.handleGoHome}
                  style={{
                    height: 48,
                    minWidth: 140,
                    fontSize: 16,
                    borderRadius: 8,
                    marginRight: 12,
                  }}
                >
                  Go Home
                </Button>,
                <Button
                  key="reload"
                  size="large"
                  icon={<ReloadOutlined />}
                  onClick={this.handleReload}
                  style={{
                    height: 48,
                    minWidth: 140,
                    fontSize: 16,
                    borderRadius: 8,
                  }}
                >
                  Reload Page
                </Button>,
              ]}
            />
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};
