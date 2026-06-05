import { Link } from "react-router";
import { Logo } from "../Logo";

export function HomeLink() {
    return (
        <Link to="/" className="p-[10px] transition-colors duration-100
            text-teal-75 hover:text-teal-70 dark:text-teal-65 dark:hover:text-teal-60">
            <Logo/>
        </Link>
    );
}
