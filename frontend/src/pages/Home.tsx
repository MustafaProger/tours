import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

type Tour = {
	title: string;
	desc: string;
	link?: string;
};

const tours: Tour[] = [
	{
		title: "Горы Кавказа",
		desc: "Незабываемое приключение в сердце природы.",
		link: "/tours/kavkaz",
	},
	{
		title: "Золотое кольцо",
		desc: "Историческое путешествие по древним городам.",
		link: "/tours/kolco",
	},
	{
		title: "Байкал",
		desc: "Открой глубину самого чистого озера мира.",
		link: "/tours/baikal",
	},
];

const containerVariants = {
	hidden: { opacity: 0, scale: 0.9 },
	visible: {
		opacity: 1,
		scale: 1,
		transition: {
			duration: 0,
			delayChildren: 0.3,
			staggerChildren: 0.2,
		},
	},
};

const itemVariantsDown = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { type: "spring", stiffness: 300, damping: 24 },
	},
};

const TourCard: React.FC<{ tour: Tour } & React.ComponentProps<any>> = ({
	tour,
	...props
}) => (
	<Box
		component={Link}
		to={tour.link || "#"}
		{...props}
		sx={{
			width: 300,
			bgcolor: "rgba(255,255,255,0.15)",
			p: 2,
			borderRadius: 2,
			color: "#fff",
			textDecoration: "none",
			transition: "transform 0.3s, box-shadow 0.3s",
			"&:hover": {
				transform: "scale(1.05)",
				boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
				bgcolor: "rgba(255,255,255,0.25)",
			},
		}}>
		<Typography
			variant='h6'
			gutterBottom>
			{tour.title}
		</Typography>
		<Typography variant='body2'>{tour.desc}</Typography>
		<Button
			variant='outlined'
			size='small'
			sx={{
				mt: 2,
				color: "#fff",
				borderColor: "#fff",
				transition: "transform 0.3s",
				"&:hover": { transform: "scale(1.1)" },
			}}>
			Подробнее
		</Button>
	</Box>
);

const MotionTourCard = motion(TourCard);

export default function Home() {
	return (
		<>
			<motion.div
				variants={containerVariants}
				initial='hidden'
				whileInView='visible'
				viewport={{ once: true, amount: 0.2 }}>
				<Box
					component='section'
					sx={{
						minHeight: "660px",
						backgroundImage:
							"url('https://www.atorus.ru/sites/default/files/styles/head_carousel/public/2024-01/46155579904_745ca62eae_b.jpg.webp?itok=mGeMLjpM')",
						backgroundSize: "cover",
						backgroundPosition: "center",
						color: "white",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						textAlign: "center",
						px: 2,
						position: "relative",
						zIndex: 1,
						"&::after": {
							content: '""',
							position: "absolute",
							top: 0,
							left: 0,
							width: "100%",
							height: "100%",
							backgroundColor: "rgba(0, 0, 0, 0.5)",
							zIndex: -1,
						},
					}}>
					<motion.div variants={itemVariantsDown}>
						<Typography
							variant='h3'
							gutterBottom>
							Открой мир с TourApp
						</Typography>
					</motion.div>
					<motion.div variants={itemVariantsDown}>
						<Typography
							variant='h6'
							gutterBottom>
							Выбирай и бронируй лучшие туры онлайн
						</Typography>
					</motion.div>
					<motion.div variants={itemVariantsDown}>
						<Button
							variant='contained'
							size='large'
							component={Link}
							to='/tours'
							sx={{
								mt: 4,
								transition: "transform 0.3s",
								"&:hover": {
									transform: "scale(1.05)",
								},
							}}>
							Перейти к турам
						</Button>
					</motion.div>
				</Box>
			</motion.div>

			<Box
				component='section'
				sx={{ px: 3, py: 5, bgcolor: "#1876D1" }}>
				<motion.div
					variants={containerVariants}
					initial='hidden'
					whileInView='visible'
					viewport={{ once: true, amount: 0.2 }}>
					<Box component='section'>
						<motion.div variants={itemVariantsDown}>
							<Typography
								sx={{ textAlign: "center", pb: 3, m: 0 }}
								variant='h4'
								gutterBottom
								color='white'>
								Популярные туры
							</Typography>
						</motion.div>
						<Box
							sx={{
								display: "flex",
								gap: 2,
								flexWrap: "wrap",
								justifyContent: "center",
							}}>
							{tours.map((tour) => (
								<MotionTourCard
									variants={itemVariantsDown}
									key={tour.title}
									tour={tour}></MotionTourCard>
							))}
						</Box>
					</Box>
				</motion.div>
			</Box>

			<motion.div
				variants={containerVariants}
				initial='hidden'
				whileInView='visible'
				viewport={{ once: true, amount: 0.2 }}>
				<Box
					component='section'
					sx={{ mt: 10, px: 3 }}>
					<motion.div variants={itemVariantsDown}>
						<Typography
							variant='h4'
							gutterBottom
							color='black'
							sx={{ textAlign: "center", pb: 3, m: 0 }}>
							Почему выбирают нас
						</Typography>
					</motion.div>
					<Box
						sx={{
							display: "flex",
							flexWrap: "wrap",
							gap: 3,
							justifyContent: "center",
							color: "#000",
						}}>
						{[
							"Большой выбор туров по всему миру",
							"Удобное онлайн-бронирование",
							"Поддержка 24/7 и лучшие цены",
						].map((item, i) => (
							<motion.div
								variants={itemVariantsDown}
								key={i}>
								<Box
									sx={{
										width: 250,
										bgcolor: "rgba(0,0,0,0.15)",
										p: 2,
										borderRadius: 2,
										textAlign: "center",
									}}>
									<Typography variant='body1'>{item}</Typography>
								</Box>
							</motion.div>
						))}
					</Box>
				</Box>
			</motion.div>

			{/* Футер — без анимаций */}
			<Box
				component='footer'
				sx={{
					mt: 10,
					py: 4,
					textAlign: "center",
					color: "#ccc",
					bgcolor: "#D9D9D9",
				}}>
				<Typography
					variant='body2'
					sx={{ color: "grey" }}>
					© 2025 TourApp. Все права защищены.
				</Typography>
			</Box>
		</>
	);
}
