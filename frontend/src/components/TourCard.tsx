import { Link } from "react-router-dom";
import { Calendar, Clock, DollarSign } from "lucide-react";
import { Tour } from "../types/tour";

interface TourCardProps {
	tour: Tour;
}

const TourCard = ({ tour }: TourCardProps) => {
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
						to={`/tours/${tour.link.split("/").pop()}`}
						className='text-blue-600 font-medium text-sm hover:text-blue-700'>
						Подробнее
					</Link>
					<button className='btn btn-secondary text-sm'>Забронировать</button>
				</div>
			</div>
		</div>
	);
};

export default TourCard;
