import { ReactElement } from "react";

export type TourHome = {
	title: string;
	desc: string;
	link?: string;
};

export type Feature = {
	icon: ReactElement;
	title: string;
	desc: string;
};

export type AboutPageTeam = {
	name: string;
	role: string;
	avatar: string;
};

export type Tour = {
	title: string;
	date: string;
	time: string;
	duration: string;
	price: number;
	desc: string;
	link: string;
	image: string;
};
