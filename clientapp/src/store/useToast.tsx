import { toast as toaster } from "sonner";
import NotificationBell from "@/assets/noti.gif";

const toast = {
  error(message: string) {
    toaster.error(message, { position: "top-right", duration: 5000 });
  },
  success(message: string) {
    toaster.success(message, { position: "top-right", duration: 5000 });
  },
  info(message: string) {
    toaster.info(message, {
      position: "top-center",
      duration: 5000,
      icon: null,
    });
  },
  notification(message: string) {
    toaster.success(message, {
      position: "top-center",
      duration: 5000,
      icon: (
        <img
          alt="notification-bell"
          src={NotificationBell}
          style={{
            width: 40,
            height: 45,
          }}
        />
      ),

      action: {
        label: "X",
        onClick: () => {},
      },
    });
  },
};

export { toast };
