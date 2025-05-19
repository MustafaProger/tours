import { Box, Typography, Button, Avatar, Grid } from "@mui/material";
import { motion } from "framer-motion";

import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import LanguageIcon from "@mui/icons-material/Language";

import {
	containerVariants,
	itemVariantsDown,
} from "../animations/motionVariants";
import type { AboutPageTeam, Feature } from "../types/tour";

import { Link } from "react-router-dom";

const aboutFeatures: Feature[] = [
	{
		icon: <LanguageIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
		title: "Глобальный охват",
		desc: "Туры по России и всему миру с проверенными партнёрами.",
	},
	{
		icon: <FlightTakeoffIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
		title: "Быстрое бронирование",
		desc: "Онлайн-оформление туров за пару минут без бумажной волокиты.",
	},
	{
		icon: <SupportAgentIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
		title: "Поддержка 24/7",
		desc: "Профессиональная помощь в любое время суток.",
	},
];

const team: AboutPageTeam[] = [
	{
		name: "Анна Иванова",
		role: "Менеджер по туризму",
		avatar: "https://randomuser.me/api/portraits/women/44.jpg",
	},
	{
		name: "Иван Петров",
		role: "Технический директор",
		avatar: "https://randomuser.me/api/portraits/men/46.jpg",
	},
	{
		name: "Мария Ким",
		role: "Специалист поддержки",
		avatar: "https://randomuser.me/api/portraits/women/48.jpg",
	},
];

export default function About() {
	return (
		<Box
			component='main'
			sx={{ px: { xs: 2, md: 6 }, py: 6, maxWidth: 1200, mx: "auto" }}>
			{/* Миссия */}
			<motion.section
				variants={containerVariants}
				initial='hidden'
				whileInView='visible'
				viewport={{ once: true, amount: 0.3 }}
				style={{ marginBottom: 60, textAlign: "center" }}>
				<motion.div variants={itemVariantsDown}>
					<Typography
						variant='h3'
						gutterBottom
						sx={{ fontWeight: "bold" }}>
						Наша миссия
					</Typography>
				</motion.div>
				<motion.div variants={itemVariantsDown}>
					<Typography
						variant='h6'
						color='text.secondary'
						sx={{ maxWidth: 800, mx: "auto" }}>
						Мы стремимся сделать путешествия доступными, безопасными и
						незабываемыми для каждого, предоставляя качественные туры и сервис с
						вниманием к деталям.
					</Typography>
				</motion.div>
			</motion.section>

			<motion.section
				variants={containerVariants}
				initial='hidden'
				whileInView='visible'
				viewport={{ once: true, amount: 0.3 }}
				style={{ marginBottom: 60 }}>
				<motion.div variants={itemVariantsDown}>
					<Typography
						variant='h4'
						gutterBottom
						sx={{ textAlign: "center", mb: 4 }}>
						Почему выбирают нас
					</Typography>
				</motion.div>
				<Grid
					container
					spacing={4}
					justifyContent='center'>
					{aboutFeatures.map((feature, i) => (
						<motion.div
							key={i}
							variants={itemVariantsDown}>
							<Box
								sx={{
									bgcolor: "#f0f4ff",
									p: 4,
									borderRadius: 3,
									textAlign: "center",
									boxShadow: "0 6px 20px rgba(25, 118, 210, 0.2)",
									transition: "transform 0.3s",
									"&:hover": {
										transform: "translateY(-10px)",
										boxShadow: "0 10px 30px rgba(25, 118, 210, 0.35)",
									},
								}}>
								<Box sx={{ mb: 2 }}>{feature.icon}</Box>
								<Typography
									variant='h6'
									gutterBottom>
									{feature.title}
								</Typography>
								<Typography
									variant='body1'
									color='text.secondary'>
									{feature.desc}
								</Typography>
							</Box>
						</motion.div>
					))}
				</Grid>
			</motion.section>

			<motion.section
				variants={containerVariants}
				initial='hidden'
				whileInView='visible'
				viewport={{ once: true, amount: 0.3 }}
				style={{ marginBottom: 60 }}>
				<motion.div variants={itemVariantsDown}>
					<Typography
						variant='h4'
						gutterBottom
						sx={{ textAlign: "center", mb: 4 }}>
						Наша команда
					</Typography>
				</motion.div>
				<Grid
					container
					spacing={6}
					justifyContent='center'>
					{team.map(({ name, role, avatar }, i) => (
						<motion.div
							key={i}
							variants={itemVariantsDown}>
							<Box
								sx={{
									width: 220,
									bgcolor: "#e3f2fd",
									p: 3,
									borderRadius: 4,
									textAlign: "center",
									boxShadow: "0 6px 20px rgba(25, 118, 210, 0.15)",
									transition: "transform 0.3s",
									cursor: "default",
									"&:hover": {
										transform: "translateY(-8px)",
										boxShadow: "0 10px 30px rgba(25, 118, 210, 0.25)",
									},
								}}>
								<Avatar
									alt={name}
									src={avatar}
									sx={{ width: 100, height: 100, mx: "auto", mb: 2 }}
								/>
								<Typography
									variant='h6'
									fontWeight='bold'>
									{name}
								</Typography>
								<Typography
									variant='body2'
									color='text.secondary'>
									{role}
								</Typography>
							</Box>
						</motion.div>
					))}
				</Grid>
			</motion.section>

			<motion.section
				variants={containerVariants}
				initial='hidden'
				whileInView='visible'
				viewport={{ once: true, amount: 0.3 }}>
				<motion.div variants={itemVariantsDown}>
					<Box sx={{ textAlign: "center" }}>
						<Typography
							variant='h4'
							gutterBottom>
							Готовы начать путешествие?
						</Typography>
						<Button
							variant='contained'
							size='large'
							component={Link}
							to='/tours'
							sx={{
								mt: 4,
								maxWidth: 225,
								transition: "transform 0.3s",
								bgcolor: "#1876D1",
								"&:hover": {
									transform: "scale(1.05)",
								},
							}}>
							Посмотреть туры
						</Button>
					</Box>
				</motion.div>
			</motion.section>
		</Box>
	);
}
