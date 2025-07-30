import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddNewNotification from "./components/Notifications/AddNewNotification";
import "./global.scss";

const DummyNotificationsPage = () => (
  <div style={{ padding: 20 }}>
    <h2>Notifications List Page</h2>
    <p>This is a placeholder for the notifications list.</p>
    <a href="/">Go to Add New Notification</a>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AddNewNotification />} />
        <Route
          path="/admin/notifications"
          element={<DummyNotificationsPage />}
        />
      </Routes>
    </Router>
  );
}

export default App;
