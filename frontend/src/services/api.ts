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
		try {
			const response = await api.get("/tours");
			// Ensure we return the tours array, whether it's directly in data or nested
			return Array.isArray(response.data) ? response.data : response.data.tours;
		} catch (error) {
			if (error instanceof AxiosError) {
				if (!error.response) {
					// Network error (API unreachable)
					throw new APIError(
						"Unable to reach the tour service. Please check your internet connection.",
						undefined,
						"NETWORK_ERROR"
					);
				}

				// Server error
				const status = error.response.status;
				let message = "An error occurred while fetching tours.";

				if (status === 404) {
					message = "Tour service endpoint not found.";
				} else if (status >= 500) {
					message = "Tour service is currently unavailable.";
				}

				throw new APIError(message, status, error.code);
			}

			// Unknown error
			throw new APIError("An unexpected error occurred while fetching tours.");
		}
	},

	getTourById: async (id: string) => {
		try {
			const response = await api.get(`/tours/${id}`);
			return response.data;
		} catch (error) {
			console.error(`Error fetching tour ${id}:`, error);
			throw error;
		}
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

	getUserBookings: async (userId: string) => {
		try {
			const response = await api.get(`/bookings/user/${userId}`);
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
