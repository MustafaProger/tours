import axios, { AxiosError } from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Create axios instance with base URL
const api = axios.create({
	baseURL: API_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

// Custom error class for API errors
export class APIError extends Error {
	constructor(message: string, public status?: number, public code?: string) {
		super(message);
		this.name = "APIError";
	}
}

// Tours API
export const toursApi = {
	getAllTours: async () => {
		const response = await axios.get(`${API_URL}/tours`);
		return response.data;
	},

	getTourById: async (id: string) => {
		const response = await axios.get(`${API_URL}/tours/${id}`);
		return response.data;
	},

	filterTours: async (filters: any) => {
		try {
			const response = await api.get("/tours", { params: filters });
			return Array.isArray(response.data) ? response.data : response.data.tours;
		} catch (error) {
			console.error("Error filtering tours:", error);
			throw error;
		}
	},
};

// Auth API
export const authApi = {
	login: async (email: string, password: string) => {
		try {
			const response = await api.post("/auth/login", { email, password });
			return response.data;
		} catch (error) {
			console.error("Error during login:", error);
			throw error;
		}
	},

	register: async (name: string, email: string, password: string) => {
		try {
			const response = await api.post("/auth/register", {
				name,
				email,
				password,
			});
			return response.data;
		} catch (error) {
			console.error("Error during registration:", error);
			throw error;
		}
	},

	confirmCode: async (email: string, code: string) => {
		try {
			const response = await api.post("/auth/confirm", { email, code });
			console.log(response.data);
			return response.data;
		} catch (error) {
			console.error("Ошибка подтверждения:", error);
			throw error;
		}
	},
};

// Booking API
export const bookingApi = {
	createBooking: async (bookingData: any) => {
		try {
			const response = await api.post("/bookings", bookingData);
			return response.data;
		} catch (error) {
			console.error("Error creating booking:", error);
			throw error;
		}
	},

	getUserBookings: async () => {
		try {
			const response = await api.get("/bookings");
			return response.data;
		} catch (error) {
			console.error("Error fetching user bookings:", error);
			throw error;
		}
	},

	cancelBooking: async (bookingId: string) => {
		try {
			const response = await api.delete(`/bookings/${bookingId}`);
			return response.data;
		} catch (error) {
			console.error("Error canceling booking:", error);
			throw error;
		}
	},
};

export default api;
