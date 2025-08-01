import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddNewNotification from "./components/Notifications/AddNewNotification";
import "./global.scss";
import Notifications from "./components/Notifications/Notifications";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Notifications />} />
        <Route path="/add" element={<AddNewNotification />} />
        <Route path="/edit/:id" element={<AddNewNotification />} />
      </Routes>
    </Router>
  );
}

export default App;
