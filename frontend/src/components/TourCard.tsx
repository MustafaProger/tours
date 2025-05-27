import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Calendar, Clock, DollarSign } from "lucide-react";
import { Tour } from "../types/tour";
import { bookingService } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';

interface TourCardProps {
	tour: Tour;
}

const TourCard = ({ tour }: TourCardProps) => {
	const [isBooking, setIsBooking] = useState(false);
	const [error, setError] = useState('');
	const { isAuthenticated } = useAuth();
	const navigate = useNavigate();
	const [hasBooking, setHasBooking] = useState(false);
	const [hasAlreadyPurchased, setHasAlreadyPurchased] = useState(false);

	useEffect(() => {
		const checkBooking = async () => {
			if (!isAuthenticated) return;
			try {
				const bookings = await bookingService.getMyBookings();
				// Проверяем есть ли неоплаченное бронирование или уже купленный тур
				const hasUnpaidBooking = bookings.some(b => b.tour?._id === tour._id && !b.paid);
				const hasAlreadyPurchased = bookings.some(b => b.tour?._id === tour._id && b.paid);
				setHasBooking(hasUnpaidBooking);
				setHasAlreadyPurchased(hasAlreadyPurchased);
			} catch (e) {
				setHasBooking(false);
				setHasAlreadyPurchased(false);
			}
		};
		checkBooking();
	}, [isAuthenticated, tour._id]);

	const handleBooking = async () => {
		if (!isAuthenticated) {
			navigate('/login');
			return;
		}

		try {
			setIsBooking(true);
			setError('');
			await bookingService.createBooking(tour._id);
			alert('Тур успешно забронирован!');
			navigate('/dashboard');
		} catch (err: any) {
			console.error('Booking error:', err);
			if (err.message === 'Необходима авторизация') {
				navigate('/login');
			} else {
				setError(err.response?.data?.message || 'Ошибка при бронировании');
			}
		} finally {
			setIsBooking(false);
		}
	};

	return (
		<div className='card tour-card group'>
			<div className='relative'>
				<img
					src={tour.image}
					alt={tour.title}
					className='w-full h-48 object-cover'
				/>
				<div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
			</div>
			<div className='p-4'>
				<h3 className='text-lg font-semibold mb-2'>{tour.title}</h3>
				<p className='text-gray-600 text-sm mb-4 line-clamp-2'>{tour.desc}</p>

				{/* ВРЕМЕННО: выводим _id для отладки */}
				<div className='text-xs text-gray-400 mb-2'>ID: {tour._id}</div>

				<div className='space-y-2 mb-4'>
					<div className='flex items-center text-sm text-gray-500'>
						<Calendar
							size={16}
							className='mr-2 text-blue-500'
						/>
						<span>
							{new Date(tour.date).toLocaleDateString("ru-RU", {
								day: "numeric",
								month: "long",
								year: "numeric",
							})}
						</span>
					</div>
					<div className='flex items-center text-sm text-gray-500'>
						<Clock
							size={16}
							className='mr-2 text-blue-500'
						/>
						<span>{tour.duration}</span>
					</div>
					<div className='flex items-center text-sm font-medium text-gray-900'>
						<DollarSign
							size={16}
							className='mr-2 text-blue-500'
						/>
						<span>{tour.price.toLocaleString("ru-RU")} ₽</span>
					</div>
				</div>

				<div className='flex justify-between items-center'>
					<Link
						to={`/tours/${tour._id}`}
						className='text-blue-600 font-medium text-sm hover:text-blue-700'>
						Подробнее
					</Link>
					{error && <p className="text-red-500 text-sm">{error}</p>}
					<button 
						className={`btn btn-secondary text-sm ${(isBooking || hasBooking || hasAlreadyPurchased) ? 'opacity-50 cursor-not-allowed' : ''}`}
						onClick={handleBooking}
						disabled={isBooking || hasBooking || hasAlreadyPurchased}
					>
						{hasBooking ? 'Забронировано' : isBooking ? 'Бронирование...' : 'Забронировать'}
					</button>
				</div>
			</div>
		</div>
	);
};

export default TourCard;
