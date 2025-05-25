import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import LanguageIcon from "@mui/icons-material/Language";

import type { TourHome, Feature } from "../types/tour";
import {
	containerVariants,
	itemVariantsDown,
} from "../animations/motionVariants";

const tours: TourHome[] = [
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

const features: Feature[] = [
	{
		icon: <LanguageIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
		title: "Большой выбор",
		desc: "Туры по России и всему миру",
	},
	{
		icon: <FlightTakeoffIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
		title: "Удобная бронь",
		desc: "Оформление за пару минут",
	},
	{
		icon: <SupportAgentIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
		title: "Поддержка 24/7",
		desc: "Помощь в любое время суток",
	},
];

const TourCard: React.FC<{ tour: Tour }> = ({ tour, ...props }) => (
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
		<Box component='main'>
			<motion.div
				variants={containerVariants}
				initial='hidden'
				whileInView='visible'
				viewport={{ once: true, amount: 0.2 }}>
				<Box
					component='section'
					sx={{
						minHeight: "480px",
						backgroundImage:
							"url('https://opis-cdn.tinkoffjournal.ru/mercury/faq-thailand__main_.z9x1nlkar7tp.jpg')",
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
							sx={{ textAlign: "center", pb: 3 }}>
							Почему выбирают нас
						</Typography>
					</motion.div>

					<Box
						sx={{
							display: "flex",
							flexWrap: "wrap",
							gap: 3,
							justifyContent: "center",
							alignItems: "stretch",
						}}>
						{features.map((feature, i) => (
							<motion.div
								variants={itemVariantsDown}
								key={i}>
								<Box
									sx={{
										width: 280,
										bgcolor: "#f5f5f5",
										p: 3,
										borderRadius: 3,
										textAlign: "center",
										boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
										transition: "transform 0.3s",
										"&:hover": {
											transform: "translateY(-5px)",
										},
									}}>
									<Box sx={{ mb: 2 }}>{feature.icon}</Box>
									<Typography
										variant='h6'
										gutterBottom>
										{feature.title}
									</Typography>
									<Typography
										variant='body2'
										color='text.secondary'>
										{feature.desc}
									</Typography>
								</Box>
							</motion.div>
						))}
					</Box>
				</Box>
			</motion.div>
		</Box>
	);
}
