import { useState } from "react";
import { CollapsedSidebar } from "./CollapsedSidebar";
import { ExpandedSidebar } from "./ExpandedSidebar";

export function Sidebar() {
    const [expanded, setExpanded] = useState(true);

    const handleToggleExpanded = () => {
        setExpanded(!expanded);
    };

    if (expanded) {
        return (
            <ExpandedSidebar
                onCollapse={handleToggleExpanded}
            />
        );
    } else {
        return (
            <CollapsedSidebar
                onExpand={handleToggleExpanded}
            />
        );
    }
}
