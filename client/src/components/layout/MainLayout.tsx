import { NavLink, Outlet } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { LayoutDashboard, Menu, ShoppingBag, Sun, Moon } from 'lucide-react';
import clsx from 'clsx';

export default function MainLayout() {
    const { theme, toggleTheme } = useTheme();

    const navItems = [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/menu', icon: Menu, label: 'Menu Management' },
        { to: '/orders', icon: ShoppingBag, label: 'Orders' },
    ];

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-colors">
                <div className="p-6 flex items-center gap-3">
                    <img src="/logo.png" alt="Eatoes Logo" className="w-10 h-10 rounded-lg" />
                    <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                        Eatoes Admin
                    </span>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-2">
                    {navItems.map(({ to, icon: Icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                clsx(
                                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                                    isActive
                                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium shadow-sm'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                                )
                            }
                        >
                            <Icon className="w-5 h-5" />
                            <span>{label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={toggleTheme}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                    >
                        {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                        <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
