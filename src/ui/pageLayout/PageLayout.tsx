import { useBreakpoints } from '../breakpoints';
import { MobileNav } from './mobileNav';
import { Nav } from './nav';

export function PageLayout() {
    const layout = useBreakpoints();
    return (
        <div className="h-full bg-white dark:bg-black flex flex-col">
            {(layout === 'sm' || layout === 'md') ? (
                <MobileNav/>
            ) : (
                <Nav/>
            )}
        </div>
    );
}
