import { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../services/api";

interface User {
	id: string;
	name: string;
	email: string;
	token?: string;
}

interface AuthContextType {
	user: User | null;
	loading: boolean;
	login: (email: string, password: string) => Promise<void>;
	register: (name: string, email: string, password: string) => Promise<void>;
	confirmCode: (email: string, code: string) => Promise<void>;
	logout: () => void;
	isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		const storedUser = localStorage.getItem("user");
		const storedToken = localStorage.getItem("token");

		if (storedUser && storedToken) {
			try {
				const userData = JSON.parse(storedUser);
				setUser({ ...userData, token: storedToken });
				setIsAuthenticated(true);
			} catch (error) {
				localStorage.removeItem("user");
				localStorage.removeItem("token");
			}
		}
		setLoading(false);
	}, []);

	const login = async (email: string, password: string) => {
		setLoading(true);
		try {
			const data = await authApi.login(email, password);
			setUser(data.user);
			setIsAuthenticated(true);
			localStorage.setItem("user", JSON.stringify(data.user));
			localStorage.setItem("token", data.token);
		} catch (error) {
			throw new Error("Ошибка входа");
		} finally {
			setLoading(false);
		}
	};

	const register = async (name: string, email: string, password: string) => {
		setLoading(true);
		try {
			await authApi.register(name, email, password); // реальный запрос
		} catch (error) {
			throw new Error("Ошибка при регистрации");
		} finally {
			setLoading(false);
		}
	};

	const confirmCode = async (email: string, code: string) => {
		setLoading(true);
		try {
			await authApi.confirmCode(email, code); // подтверждение кода
		} catch (error) {
			throw new Error("Неверный код подтверждения");
		} finally {
			setLoading(false);
		}
	};

	const logout = () => {
		setUser(null);
		setIsAuthenticated(false);
		localStorage.removeItem("user");
		localStorage.removeItem("token");
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				loading,
				login,
				register,
				confirmCode,
				logout,
				isAuthenticated,
			}}>
			{children}
		</AuthContext.Provider>
	);
};
