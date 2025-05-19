import { ReactElement } from "react";

export type Tour = {
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
