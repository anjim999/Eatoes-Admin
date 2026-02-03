import { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { 
    LayoutDashboard, 
    Menu as MenuIcon, 
    ShoppingBag, 
    Sun, 
    Moon, 
    X,
    ChevronRight,
    UtensilsCrossed
} from 'lucide-react';
import clsx from 'clsx';

export default function MainLayout() {
    const { theme, toggleTheme } = useTheme();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    // Close sidebar when route changes on mobile
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location]);

    // Prevent body scroll when sidebar is open on mobile
    useEffect(() => {
        if (isSidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isSidebarOpen]);

    const navItems = [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/menu', icon: UtensilsCrossed, label: 'Menu Management' },
        { to: '/orders', icon: ShoppingBag, label: 'Orders' },
    ];

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-40 flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                    <img src="/logo-new.png" alt="Eatoes" className="w-10 h-10" />
                    <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                        Eatoes
                    </span>
                </div>
                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    aria-label="Toggle navigation menu"
                >
                    {isSidebarOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                </button>
            </header>

            {/* Backdrop Overlay */}
            <div
                className={clsx(
                    "fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden",
                    isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setIsSidebarOpen(false)}
            />

            {/* Sidebar */}
            <aside
                className={clsx(
                    "fixed lg:static inset-y-0 left-0 w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
                    isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
                )}
            >
                <div className="p-6 flex items-center justify-between lg:justify-start gap-4">
                    <div className="flex items-center gap-3">
                        <img src="/logo-new.png" alt="Eatoes" className="w-12 h-12" />
                        <div className="flex flex-col">
                            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent leading-tight">
                                Eatoes Admin
                            </span>
                            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Restaurant Control</span>
                        </div>
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {navItems.map(({ to, icon: Icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                clsx(
                                    'group flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300',
                                    isActive
                                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30 font-medium'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-primary-600 dark:hover:text-primary-400'
                                )
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <div className="flex items-center gap-3">
                                        <Icon className={clsx("w-5 h-5 transition-transform duration-300 group-hover:scale-110")} />
                                        <span>{label}</span>
                                    </div>
                                    <ChevronRight className={clsx("w-4 h-4 opacity-0 transition-all duration-300", isActive && "opacity-100 translate-x-1")} />
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
                    <button
                        onClick={toggleTheme}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-300 border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                    >
                        <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700">
                            {theme === 'light' ? <Moon className="w-4 h-4 text-gray-600" /> : <Sun className="w-4 h-4 text-yellow-500" />}
                        </div>
                        <span className="font-medium">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                    </button>
                    
                    <div className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-bold text-xs">
                                AD
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-gray-900 dark:text-white">Admin User</span>
                                <span className="text-[10px] text-gray-500">Super Admin</span>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto lg:pt-0 pt-16 scroll-smooth">
                <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
