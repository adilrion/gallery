import { Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";

export function Footer() {
    return (
        <footer className="w-full bg-white">
            <div className="max-w-screen-2xl px-4 py-2 lg:px-8 lg:py-4 mx-auto">
                <div className="flex flex-row flex-wrap items-center justify-center gap-y-6 gap-x-12 bg-white text-center md:justify-between">
                    <Link

                        to="/"
                        className="mr-4 font-serif cursor-pointer py-1.5 font-bold uppercase"
                    >
                        Rio <span className="text-deep-orange-800">Gallery</span>
                    </Link>
                    <ul className="flex flex-wrap items-center gap-y-2 gap-x-8">
                        <li>
                            <Typography
                                as="a"
                                href="#"
                                color="blue-gray"
                                className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
                            >
                                About Us
                            </Typography>
                        </li>
                        <li>
                            <Typography
                                as="a"
                                href="#"
                                color="blue-gray"
                                className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
                            >
                                License
                            </Typography>
                        </li>
                        <li>
                            <Typography
                                as="a"
                                href="#"
                                color="blue-gray"
                                className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
                            >
                                Contribute
                            </Typography>
                        </li>
                        <li>
                            <Typography
                                as="a"
                                href="#"
                                color="blue-gray"
                                className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
                            >
                                Contact Us
                            </Typography>
                        </li>
                    </ul>
                </div>
                <hr className="my-8 border-blue-gray-50" />
                <Typography color="blue-gray" className="text-center font-normal">
                    &copy; 2023 Rio gallery
                </Typography>
            </div>
        </footer>
    );
}