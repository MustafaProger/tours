import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { Link } from "react-router-dom";

const navItems = [
	{ label: "Главная", path: "/" },
	{ label: "О нас", path: "/about" },
	{ label: "Туры", path: "/tours" },
	{ label: "Контакты", path: "/contacts" },
];

export default function DrawerAppBar() {
	const [mobileOpen, setMobileOpen] = React.useState(false);

	const handleDrawerToggle = () => {
		setMobileOpen((prevState) => !prevState);
	};

	const drawer = (
		<Box
			onClick={handleDrawerToggle}
			sx={{ textAlign: "center" }}>
			<Typography
				variant='h6'
				sx={{ my: 2 }}>
				TourApp
			</Typography>
			<Divider />
			<List>
				{navItems.map((item) => (
					<ListItem
						key={item.path}
						disablePadding>
						<ListItemButton
							component={Link}
							to={item.path}
							sx={{ textAlign: "center" }}>
							<ListItemText primary={item.label} />
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</Box>
	);

	return (
		<Box sx={{ display: "flex", textAlign: "center" }}>
			<CssBaseline />
			<AppBar component='nav'>
				<Toolbar sx={{ justifyContent: "end" }}>
					<IconButton
						color='inherit'
						aria-label='open drawer'
						edge='end'
						onClick={handleDrawerToggle}
						sx={{ display: { sm: "none" } }}>
						<MenuIcon />
					</IconButton>
					<Typography
						variant='h6'
						component='div'
						sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}>
						<Box
							display='flex'
							alignItems='center'
							gap={1}>
							TourApp
						</Box>
					</Typography>
					<Box sx={{ display: { xs: "none", sm: "block" } }}>
						{navItems.map((item) => (
							<Button
								component={Link}
								to={item.path}
								key={item.path}
								sx={{ color: "#fff" }}>
								{item.label}
							</Button>
						))}
					</Box>
				</Toolbar>
			</AppBar>

			<nav>
				<Drawer
					variant='temporary'
					anchor='right'
					open={mobileOpen}
					onClose={handleDrawerToggle}
					ModalProps={{
						keepMounted: true,
					}}
					sx={{
						display: { xs: "block", sm: "none" },
						"& .MuiDrawer-paper": { width: 240 },
					}}>
					{drawer}
				</Drawer>
			</nav>
		</Box>
	);
}
