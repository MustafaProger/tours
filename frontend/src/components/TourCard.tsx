import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import type { Tour } from "../types/tour";

type Props = {
	tour: Tour;
};

export default function TourCard({ tour }: Props) {
	return (
		<Box
			sx={{
				bgcolor: "rgba(255,255,255,0.9)",
				borderRadius: 3,
				boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
				overflow: "hidden",
				display: "flex",
				flexDirection: "column",
				height: "100%",
				transition: "transform 0.3s, box-shadow 0.3s",
				"&:hover": {
					transform: "scale(1.03)",
					boxShadow: "0 12px 30px rgba(0,0,0,0.3)",
				},
			}}>
			<Box
				component='img'
				src={tour.image}
				alt={tour.title}
				sx={{
					height: 180,
					width: "100%",
					objectFit: "cover",
					borderBottomLeftRadius: 3,
					borderBottomRightRadius: 3,
				}}
			/>
			<Box sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column" }}>
				<Typography
					variant='h6'
					gutterBottom>
					{tour.title}
				</Typography>
				<Typography
					variant='body2'
					sx={{ flexGrow: 1, mb: 1, color: "#555" }}>
					{tour.desc}
				</Typography>
				<Typography
					variant='body2'
					sx={{ fontWeight: "bold" }}>
					Дата: {new Date(tour.date).toLocaleDateString("ru-RU")} в {tour.time}
				</Typography>
				<Typography variant='body2'>Длительность: {tour.duration}</Typography>
				<Typography
					variant='body1'
					sx={{ mt: 1, fontWeight: "bold", color: "#1976d2" }}>
					Цена: {tour.price.toLocaleString("ru-RU")} ₽
				</Typography>
				<Button
					component={Link}
					to={tour.link}
					variant='contained'
					sx={{ mt: 2 }}
					fullWidth>
					Оформить
				</Button>
			</Box>
		</Box>
	);
}
