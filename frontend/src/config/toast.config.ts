import toast from "react-hot-toast";

const createToast = (
  message: string,
  status: "success" | "warning" | "error",
) => {
  const config = {
    success: { icon: "✅", style: { background: "#4caf50", color: "#fff" } },
    warning: { icon: "⚠️", style: { background: "#ff9800", color: "#fff" } },
    error: { icon: "❌", style: { background: "#f44336", color: "#fff" } },
  };

  toast(message, {
    icon: config[status].icon,
    style: {
      borderRadius: "10px",
      background: "#333",
      color: "#fff",
    },
  });
};

export default createToast;
