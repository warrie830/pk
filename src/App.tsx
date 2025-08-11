import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ConfigProvider, Layout, Menu, Button } from "antd";
import { HomeOutlined, SettingOutlined } from "@ant-design/icons";
import zhCN from "antd/locale/zh_CN";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";
import "./App.css";

const { Header, Content } = Layout;

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <Layout className="min-h-screen">
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
