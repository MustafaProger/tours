import { Box, TextField, Slider, Typography } from "@mui/material";
import { useState, useEffect } from "react";

type Props = {
	onFilter: (filters: {
		search: string;
		maxPrice: number | null;
		maxDuration: number | null;
	}) => void;
	maxPriceAvailable: number;
	maxDurationAvailable: number;
};

export default function TourFilters({
	onFilter,
	maxPriceAvailable,
	maxDurationAvailable,
}: Props) {
	const [search, setSearch] = useState("");
	const [maxPrice, setMaxPrice] = useState<number | null>(null);
	const [maxDuration, setMaxDuration] = useState<number | null>(null);

	useEffect(() => {
		onFilter({ search, maxPrice, maxDuration });
	}, [search, maxPrice, maxDuration]);

	return (
		<Box
			sx={{
				position: "sticky",
				top: 80,
				minWidth: 280,
				maxHeight: 270,
				bgcolor: "#fff",
				p: 3,
				borderRadius: 2,
				boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
				display: "flex",
				flexDirection: "column",
				gap: 1.5,
				"@media(max-width:768px)": {
					position: "static",
					width: "100%",
					boxShadow: "none",
					mb: 3,
				},
			}}>
			<TextField
				label='Поиск по названию'
				variant='outlined'
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				sx={{pb: 2}}
			/>

			{maxPriceAvailable > 0 && (
				<>
					<Typography variant='body2'>
						Макс. цена: {maxPrice ?? maxPriceAvailable}₽
					</Typography>
					<Slider
						value={maxPrice ?? maxPriceAvailable}
						onChange={(_, value) => setMaxPrice(value as number)}
						min={0}
						max={maxPriceAvailable}
					/>
				</>
			)}

			{maxDurationAvailable > 0 && (
				<>
					<Typography variant='body2'>
						Макс. длительность: {maxDuration ?? maxDurationAvailable} дней
					</Typography>
					<Slider
						value={maxDuration ?? maxDurationAvailable}
						onChange={(_, value) => setMaxDuration(value as number)}
						min={1}
						max={maxDurationAvailable}
					/>
				</>
			)}
		</Box>
	);
}
