// @ts-nocheck
import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  Badge,
  Dropdown,
  Button,
  List,
  Typography,
  Space,
  Avatar,
  Empty,
  Spin,
  Divider,
  Tag,
} from 'antd';
import {
  BellOutlined,
  CheckOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { toast } from 'react-toastify';
import useSound from 'use-sound';

import client from '../../feathers';
import { UserContext, ObjectContext } from '../../context';
import notificationSound from './assets/notification_sound.mp3';

dayjs.extend(relativeTime);

const { Text, Paragraph } = Typography;

interface Notification {
  _id: string;
  title: string;
  body: string;
  createdAt: string;
  isRead: string[];
  priority?: string;
  type?: string;
  senderId?: string;
  senderName?: string;
  facilityId: string;
}

const NotificationDropdown: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const { user } = useContext(UserContext);
  const { showActionLoader, hideActionLoader } = useContext(ObjectContext);
  const navigate = useNavigate();

  const notificationsServer = client.service('notification');
  const [play] = useSound(notificationSound, { volume: 0.5 });

  const fetchNotifications = useCallback(async () => {
    if (!user?.currentEmployee) return;

    const userId = user.currentEmployee._id;
    setLoading(true);

    try {
      const response = await notificationsServer.find({
        query: {
          facilityId: user.currentEmployee.facilityDetail._id,
          $limit: 10,
          senderId: { $ne: userId },
          isRead: { $nin: [userId] },
          $sort: { createdAt: -1 },
        },
      });

      setNotifications(response.data);
      setUnreadCount(response.data.length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();

    // Listen for new notifications
    const handleCreated = (notification: Notification) => {
      if (
        notification.facilityId === user?.currentEmployee?.facilityDetail?._id
      ) {
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
        play();
      }
    };

    notificationsServer.on('created', handleCreated);

    return () => {
      notificationsServer.removeListener('created', handleCreated);
    };
  }, [fetchNotifications, play, user]);

  const markAsRead = async (notificationId: string, isRead: string[]) => {
    const userId = user.currentEmployee._id;

    try {
      showActionLoader();
      await notificationsServer.patch(notificationId, {
        isRead: [...isRead, userId],
      });

      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
      setUnreadCount((prev) => prev - 1);
      toast.success('Notification marked as read');
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    } finally {
      hideActionLoader();
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      showActionLoader();
      await notificationsServer.remove(notificationId);

      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
      setUnreadCount((prev) => prev - 1);
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    } finally {
      hideActionLoader();
    }
  };

  const markAllAsRead = async () => {
    const userId = user.currentEmployee._id;

    try {
      showActionLoader();
      await Promise.all(
        notifications.map((notification) =>
          notificationsServer.patch(notification._id, {
            isRead: [...notification.isRead, userId],
          }),
        ),
      );

      setNotifications([]);
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Failed to mark all as read');
    } finally {
      hideActionLoader();
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'blue';
      default:
        return 'default';
    }
  };

  const notificationContent = (
    <div style={{ width: 380, maxHeight: 500, overflow: 'auto' }}>
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text strong style={{ fontSize: 16 }}>
          Notifications ({unreadCount})
        </Text>
        {notifications.length > 0 && (
          <Button
            type="link"
            size="small"
            onClick={markAllAsRead}
            icon={<CheckOutlined />}
          >
            Mark all read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      {loading ? (
        <div style={{ padding: 40, textAlign: 'center' }}>
          <Spin />
        </div>
      ) : notifications.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No new notifications"
          style={{ padding: 40 }}
        />
      ) : (
        <List
          dataSource={notifications}
          renderItem={(notification) => (
            <List.Item
              key={notification._id}
              style={{
                padding: '12px 16px',
                cursor: 'pointer',
                transition: 'background 0.3s',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = '#fafafa')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = 'transparent')
              }
              actions={[
                <Button
                  type="text"
                  size="small"
                  icon={<CheckOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    markAsRead(notification._id, notification.isRead);
                  }}
                  title="Mark as read"
                />,
                <Button
                  type="text"
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notification._id);
                  }}
                  title="Delete"
                />,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    icon={<MessageOutlined />}
                    style={{ backgroundColor: '#1890ff' }}
                  />
                }
                title={
                  <Space>
                    <Text strong style={{ fontSize: 14 }}>
                      {notification.title}
                    </Text>
                    {notification.priority && (
                      <Tag
                        color={getPriorityColor(notification.priority)}
                        style={{ fontSize: 11 }}
                      >
                        {notification.priority}
                      </Tag>
                    )}
                  </Space>
                }
                description={
                  <Space
                    direction="vertical"
                    size={4}
                    style={{ width: '100%' }}
                  >
                    <Paragraph
                      ellipsis={{ rows: 2 }}
                      style={{ margin: 0, fontSize: 13, color: '#595959' }}
                    >
                      {notification.body}
                    </Paragraph>
                    <Space size={4} style={{ fontSize: 12, color: '#8c8c8c' }}>
                      <ClockCircleOutlined />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {dayjs(notification.createdAt).fromNow()}
                      </Text>
                    </Space>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      )}

      {/* Footer */}
      {notifications.length > 0 && (
        <>
          <Divider style={{ margin: 0 }} />
          <div style={{ padding: '8px 16px', textAlign: 'center' }}>
            <Button
              type="link"
              onClick={() => {
                navigate('/app/communication/notifications');
                setOpen(false);
              }}
            >
              View all notifications
            </Button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <Dropdown
      open={open}
      onOpenChange={setOpen}
      dropdownRender={() => notificationContent}
      trigger={['click']}
      placement="bottomRight"
    >
      <Badge count={unreadCount} overflowCount={99}>
        <Button
          type="text"
          icon={<BellOutlined />}
          style={{
            fontSize: '18px',
            width: 40,
            height: 40,
          }}
        />
      </Badge>
    </Dropdown>
  );
};

export default NotificationDropdown;
