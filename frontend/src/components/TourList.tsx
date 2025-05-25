import { useEffect, useState } from "react";
import { Box, Grid, Pagination, Typography } from "@mui/material";
import TourCard from "../components/TourCard";
import TourFilters from "../components/TourFilters";

import type { Tour } from "../types/tour";

export default function Tours() {
	const [tours, setTours] = useState<Tour[]>([]);
	const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
	const [filters, setFilters] = useState({
		search: "",
		maxPrice: null as number | null,
		maxDuration: null as number | null,
	});
	const [page, setPage] = useState(1);
	const itemsPerPage = 10;

	// useEffect(() => {
	// 	fetch("http://localhost:5000/api/tours")
	// 		.then((res) => res.json())
	// 		.then((data) => setTours(data))
	// 		.catch(() => setTours([]));
	// }, []);

	const maxPriceAvailable = Math.max(...tours.map((t) => t.price), 0);
	const maxDurationAvailable = Math.max(
		...tours.map((t) => {
			const match = t.duration.match(/\d+/);
			return match ? parseInt(match[0], 10) : 0;
		}),
		0
	);

	useEffect(() => {
		let filtered = [...tours];

		if (filters.search.trim()) {
			filtered = filtered.filter((t) =>
				t.title.toLowerCase().includes(filters.search.toLowerCase())
			);
		}
		if (filters.maxPrice !== null) {
			filtered = filtered.filter((t) => t.price <= filters.maxPrice!);
		}
		if (filters.maxDuration !== null) {
			filtered = filtered.filter((t) => {
				const match = t.duration.match(/\d+/);
				const durDays = match ? parseInt(match[0], 10) : 0;
				return durDays <= (filters.maxDuration ?? durDays);
			});
		}

		setFilteredTours(filtered);
		setPage(1);
	}, [filters, tours]);

	const paginatedTours = filteredTours.slice(
		(page - 1) * itemsPerPage,
		page * itemsPerPage
	);

	return (
		<Box sx={{ display: "flex", px: 3, py: 5, gap: 4, minHeight: "80vh" }}>
			<TourFilters
				onFilter={setFilters}
				maxPriceAvailable={maxPriceAvailable}
				maxDurationAvailable={maxDurationAvailable}
			/>

			<Box sx={{ flexGrow: 1 }}>
				<Typography
					variant='h4'
					sx={{ mb: 4, color: "#fff", textAlign: "center" }}>
					Все туры
				</Typography>

				<Grid
					container
					spacing={3}>
					{paginatedTours.map((tour) => (
						<Grid
							item
							key={tour.title}
							xs={12}
							sm={6}
							md={4}>
							<TourCard tour={tour} />
						</Grid>
					))}
				</Grid>

				<Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
					<Pagination
						count={Math.ceil(filteredTours.length / itemsPerPage)}
						page={page}
						onChange={(_, value) => setPage(value)}
						color='primary'
						shape='rounded'
					/>
				</Box>
			</Box>
		</Box>
	);
}
