import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import MenuPage from './pages/MenuPage';
import OrdersPage from './pages/OrdersPage';
import DashboardPage from './pages/DashboardPage';

function App() {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="menu" element={<MenuPage />} />
                <Route path="orders" element={<OrdersPage />} />
            </Route>
        </Routes>
    );
}

export default App;
