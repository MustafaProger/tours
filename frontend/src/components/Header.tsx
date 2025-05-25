import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, Search } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Header = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const location = useLocation();
	const { user, logout } = useAuth();

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 100) {
				setIsScrolled(true);
			} else {
				setIsScrolled(false);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Close mobile menu when changing routes
	useEffect(() => {
		setIsOpen(false);
	}, [location]);

	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	const handleLogout = () => {
		logout();
	};

	return (
		<header
			className={`fixed top-0 z-50 transition-all duration-300 w-[100%] ${
				isScrolled || isOpen
					? "bg-white shadow-md"
					: location.pathname === "/"
					? "bg-transparent"
					: "bg-white shadow-sm"
			}`}>
			<div className='container-custom'>
				<div className='flex items-center justify-between h-16 md:h-20'>
					<div className='flex-shrink-0'>
						<Link
							to='/'
							className='flex items-center'>
							<span
								className={`text-2xl font-bold ${
									isScrolled || location.pathname !== "/"
										? "text-blue-600"
										: "text-white"
								}`}>
								ТурПро
							</span>
						</Link>
					</div>

					{/* Desktop Navigation */}
					<nav className='hidden md:flex space-x-8'>
						<Link
							to='/'
							className={`font-medium ${
								isScrolled || location.pathname !== "/"
									? "text-gray-700 hover:text-blue-600"
									: "text-white hover:text-blue-100"
							}`}>
							Главная
						</Link>
						<Link
							to='/tours'
							className={`font-medium ${
								isScrolled || location.pathname !== "/"
									? "text-gray-700 hover:text-blue-600"
									: "text-white hover:text-blue-100"
							}`}>
							Туры
						</Link>
						<Link
							to='/about'
							className={`font-medium ${
								isScrolled || location.pathname !== "/"
									? "text-gray-700 hover:text-blue-600"
									: "text-white hover:text-blue-100"
							}`}>
							О нас
						</Link>
					</nav>

					{/* User Account */}
					<div className='hidden md:flex items-center space-x-4'>
						{user ? (
							<div className='relative group'>
								<button className='flex items-center space-x-2 font-medium text-gray-700 hover:text-blue-600'>
									<User size={20} />
									<span>{user.name}</span>
								</button>
								<div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300'>
									<Link
										to='/dashboard'
										className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
										Личный кабинет
									</Link>
									<button
										onClick={handleLogout}
										className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
										Выйти
									</button>
								</div>
							</div>
						) : (
							<>
								<Link
									to='/login'
									className={`font-medium ${
								isScrolled || location.pathname !== "/"
									? "text-gray-700 hover:text-blue-600"
									: "text-white hover:text-blue-100"
							}`}>
									Войти
								</Link>
								<Link
									to='/register'
									className='btn btn-primary'>
									Регистрация
								</Link>
							</>
						)}
					</div>

					{/* Mobile Menu Button */}
					<div className='md:hidden'>
						<button
							onClick={toggleMenu}
							className={`${
								isScrolled || location.pathname !== "/"
									? "text-gray-800"
									: "text-white"
							}`}>
							{isOpen ? <X size={24} /> : <Menu size={24} />}
						</button>
					</div>
				</div>
			</div>

			{/* Mobile Menu */}
			{isOpen && (
				<div className='md:hidden bg-white'>
					<div className='px-2 pt-2 pb-3 space-y-1 border-t'>
						<Link
							to='/'
							className='block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md'>
							Главная
						</Link>
						<Link
							to='/tours'
							className='block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md'>
							Туры
						</Link>
						<Link
							to='/about'
							className='block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md'>
							О нас
						</Link>
						{user ? (
							<>
								<Link
									to='/dashboard'
									className='block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md'>
									Личный кабинет
								</Link>
								<button
									onClick={handleLogout}
									className='block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md'>
									Выйти
								</button>
							</>
						) : (
							<>
								<Link
									to='/login'
									className='block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md'>
									Войти
								</Link>
								<Link
									to='/register'
									className='block px-3 py-2 text-base font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md'>
									Регистрация
								</Link>
							</>
						)}
					</div>
				</div>
			)}
		</header>
	);
};

export default Header;
