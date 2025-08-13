import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import BoardView from "@/components/pages/BoardView";
import ListView from "@/components/pages/ListView";
import Analytics from "@/components/pages/Analytics";
import Settings from "@/components/pages/Settings";
import LabelManager from "@/components/pages/LabelManager";
function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Layout>
          <Routes>
            <Route path="/" element={<BoardView />} />
            <Route path="/board" element={<BoardView />} />
            <Route path="/list" element={<ListView />} />
            <Route path="/analytics" element={<Analytics />} />
<Route path="/settings" element={<Settings />} />
            <Route path="/labels" element={<LabelManager />} />
          </Routes>
        </Layout>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;