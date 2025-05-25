import Header from "./components/Header";
import { Toolbar } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import About from "./pages/About";
import Tours from './pages/Tours'

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
					element={<About />}
				/>
				<Route
					path='/tours'
					element={<Tours />}
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
			<Footer />
		</div>
	);
}

export default App;
