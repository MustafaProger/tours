import { createContext, useContext, useState, useEffect } from "react";

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

	// Check for saved user on mount
	useEffect(() => {
		const storedUser = localStorage.getItem("user");
		const storedToken = localStorage.getItem("token");

		if (storedUser && storedToken) {
			try {
				const userData = JSON.parse(storedUser);
				setUser({ ...userData, token: storedToken });
				setIsAuthenticated(true);
			} catch (error) {
				console.error("Failed to parse stored user:", error);
				localStorage.removeItem("user");
				localStorage.removeItem("token");
			}
		}
		setLoading(false);
	}, []);

	const login = async (email: string, password: string) => {
		setLoading(true);

		try {
			// In production, this would use the real API
			// const response = await authApi.login(email, password);

			// For development, we'll use mock data
			await new Promise((resolve) => setTimeout(resolve, 1000));

			const mockUser = {
				id: "123",
				name: email.split("@")[0],
				email,
				token: "mock-token-" + Math.random().toString(36).substring(2, 15),
			};

			setUser(mockUser);
			setIsAuthenticated(true);
			localStorage.setItem("user", JSON.stringify(mockUser));
			localStorage.setItem("token", mockUser.token);
		} catch (error) {
			throw new Error("Неверный email или пароль");
		} finally {
			setLoading(false);
		}
	};

	const register = async (name: string, email: string, password: string) => {
		setLoading(true);

		try {
			// In production, this would use the real API
			// const response = await authApi.register(name, email, password);

			// For development, we'll use mock data
			await new Promise((resolve) => setTimeout(resolve, 1000));

			const mockUser = {
				id: Date.now().toString(),
				name,
				email,
				token: "mock-token-" + Math.random().toString(36).substring(2, 15),
			};

			setUser(mockUser);
			setIsAuthenticated(true);
			localStorage.setItem("user", JSON.stringify(mockUser));
			localStorage.setItem("token", mockUser.token);
		} catch (error) {
			throw new Error("Ошибка при регистрации");
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
			value={{ user, loading, login, register, logout, isAuthenticated }}>
			{children}
		</AuthContext.Provider>
	);
};
