import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ConfigProvider, Layout } from "antd";
import zhCN from "antd/locale/zh_CN";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";
import "./App.css";

const { Content } = Layout;

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <Layout style={{ minHeight: "100vh" }}>
          <Content>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </Content>
        </Layout>
      </Router>
    </ConfigProvider>
  );
}

export default App;
