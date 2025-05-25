import TourList from "../components/TourList";

const Tours = () => {
	return (
		<div className='fade-in'>
			{/* Page Header */}
			<section className='relative py-16 md:py-24 md:pt-48 bg-blue-700'>
				<div className='absolute inset-0 opacity-20'>
					<img
						src='https://wallpapersok.com/images/hd/world-wonders-to-travel-wallpaper-gc3y5vth644x90n1.jpg'
						alt='Tours background'
						className='w-full h-full object-cover'
					/>
				</div>
				<div className='container-custom relative z-10'>
					<div className='max-w-2xl'>
						<h1 className='text-white mb-4'>Наши туры</h1>
						<p className='text-blue-100 text-lg'>
							Выберите идеальное путешествие из нашей коллекции уникальных туров
						</p>
					</div>
				</div>
			</section>

			{/* Tours List Section */}
			<section className='section'>
				<div className='container-custom'>
					<TourList />
				</div>
			</section>
		</div>
	);
};

export default Tours;
