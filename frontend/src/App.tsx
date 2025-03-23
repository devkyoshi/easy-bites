import { AppRouting } from "@/config/AppRouting.tsx";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <AppRouting />
    </>
  );
}

export default App;
