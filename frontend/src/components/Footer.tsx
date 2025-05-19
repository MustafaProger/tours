import React from "react";
import {
	Box,
	Container,
	Typography,
	Grid,
	Link,
	IconButton,
} from "@mui/material";

import InstagramIcon from "@mui/icons-material/Instagram";
import TelegramIcon from "@mui/icons-material/Telegram";
import FacebookIcon from "@mui/icons-material/Facebook";

const Footer: React.FC = () => {
	return (
		<Box
			component='footer'
			sx={{ bgcolor: "#1876D1", color: "white", py: 5, mt: 10 }}>
			<Container maxWidth='lg'>
				<Grid
					container
					spacing={4}
					sx={{
						justifyContent: "space-evenly",
						"@media (max-width: 768px)": {
							justifyContent: "start"
						},
					}}>
					<Grid
						item
						xs={12}
						md={4}>
						<Typography
							variant='h6'
							gutterBottom>
							TourApp
						</Typography>
						<Typography variant='body2'>
							Исследуйте мир с нами. <br /> Лучшие туры по доступным ценам.
						</Typography>
					</Grid>

					<Grid
						item
						xs={12}
						md={4}>
						<Typography
							variant='h6'
							gutterBottom>
							Быстрые ссылки
						</Typography>
						<Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
							<Link
								href='/'
								underline='none'
								color='inherit'>
								Главная
							</Link>
							<Link
								href='/about'
								underline='none'
								color='inherit'>
								О нас
							</Link>
							<Link
								href='/tours'
								underline='none'
								color='inherit'>
								Туры
							</Link>
						</Box>
					</Grid>

					<Grid
						item
						xs={12}
						md={4}>
						<Typography
							variant='h6'
							gutterBottom>
							Мы в соцсетях
						</Typography>
						<Box sx={{ display: "flex", gap: 1 }}>
							<IconButton
								href='#'
								target='_blank'
								sx={{ color: "white" }}>
								<InstagramIcon />
							</IconButton>
							<IconButton
								href='#'
								target='_blank'
								sx={{ color: "white" }}>
								<TelegramIcon />
							</IconButton>
							<IconButton
								href='#'
								target='_blank'
								sx={{ color: "white" }}>
								<FacebookIcon />
							</IconButton>
						</Box>
					</Grid>
				</Grid>

				<Box
					sx={{
						mt: 4,
						textAlign: "center",
						borderTop: "1px solid rgba(255,255,255,0.2)",
						pt: 2,
					}}>
					<Typography
						variant='body2'
						color='inherit'>
						© 2025 TourApp. Все права защищены.
					</Typography>
				</Box>
			</Container>
		</Box>
	);
};

export default Footer;
