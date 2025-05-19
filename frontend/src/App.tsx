import Header from "./components/Header";
import { Toolbar } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";

function App() {
	return (
		<div className='app'>
			<Header />
			<Toolbar />
			<Routes>
				<Route
					path='/'
					element={<Home />}
				/>
				<Route
					path='/about'
					element={<h2>О проекте</h2>}
				/>
				<Route
					path='/tours'
					element={<h2>Туры</h2>}
				/>
				<Route
					path='/tours'
					element={<h2>Туры</h2>}
				/>
				<Route
					path='/contacts'
					element={<h2>Контакты</h2>}
				/>
			</Routes>
		</div>
	);
}

export default App;
