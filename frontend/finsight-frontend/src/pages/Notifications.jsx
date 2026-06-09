import { useEffect, useState } from "react";
import API from "../api";

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    const email = localStorage.getItem("email");

    if (!email) {
      return;
    }

    const res = await API.get(`/notifications/${email}`);
    setNotifications(res.data);
  };

  const markAsRead = async (id) => {
    await API.put(`/notifications/read/${id}`);
    loadNotifications();
  };

  const markAllAsRead = async () => {
    const email = localStorage.getItem("email");
    await API.put(`/notifications/read-all/${email}`);
    loadNotifications();
  };

  const deleteNotification = async (id) => {
    await API.delete(`/notifications/${id}`);
    loadNotifications();
  };

  return (
    <div className="container">
      <h1> Notifications</h1>

      <button onClick={markAllAsRead}>Mark All As Read</button>

      <div className="notification-list">
        {notifications.map((n) => (
          <div
            className={
              n.status === "UNREAD"
                ? "notification-card unread"
                : "notification-card"
            }
            key={n.notificationId}
          >
            <h3>{n.message}</h3>
            <p>Status: {n.status}</p>
            <p>{n.createdAt}</p>

            {n.status === "UNREAD" && (
              <button onClick={() => markAsRead(n.notificationId)}>
                Mark Read
              </button>
            )}

            <button
              onClick={() => deleteNotification(n.notificationId)}
              style={{ marginLeft: "10px", background: "#dc2626" }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications;