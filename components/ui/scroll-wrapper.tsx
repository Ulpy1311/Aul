"use client";

import { useRef, useState, useEffect } from "react";

export function ScrollWrapper({ children }: { children: React.ReactNode }) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startY, setStartY] = useState(0);
    const [scrollTop, setScrollTop] = useState(0);

    const handleMouseDown = (e: React.MouseEvent) => {
        // Only enable dragging for left click and if not clicking on interactive elements
        const target = e.target as HTMLElement;
        if (
            target.tagName === "BUTTON" ||
            target.tagName === "A" ||
            target.tagName === "INPUT" ||
            target.closest("button") ||
            target.closest("a")
        ) {
            return;
        }

        setIsDragging(true);
        setStartY(e.pageY - (document.documentElement.scrollTop || document.body.scrollTop));
        setScrollTop(document.documentElement.scrollTop || document.body.scrollTop);
        document.body.style.cursor = "grabbing";
        document.body.style.userSelect = "none";
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        document.body.style.cursor = "";
        document.body.style.removeProperty("user-select");
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        const y = e.pageY - (document.documentElement.scrollTop || document.body.scrollTop);
        // Logic: moving mouse UP (negative Y change) should scroll DOWN (increase scrollTop)?
        // Wait, typical drag scroll: "Pulling down" moves content down (scrolling up).
        // If I click and drag UP, I expect the page to move down (scroll up).

        // Simpler logic: DeltaY
        // currentY - startY

        // Let's use standard "grab and drag" logic like a PDF
        // scrollTop = initialScrollTop - (currentMouseY - initialMouseY)
        // But pageY includes scroll, so we use clientY for delta? No, pageY is absolute doc pos.

        // Let's re-think:
        // On MouseDown: capture `startY = e.clientY` and `startScroll = window.scrollY`
        // On MouseMove: `offset = e.clientY - startY`
        // `window.scrollTo(0, startScroll - offset)`
    };

    // Re-implementing with window logic inside useEffect for global capture
    useEffect(() => {
        let startY = 0;
        let startScroll = 0;
        let dragging = false;

        const onMouseDown = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (
                target.tagName === "BUTTON" ||
                target.tagName === "A" ||
                target.tagName === "INPUT" ||
                target.closest("button") ||
                target.closest("a") ||
                target.closest(".no-drag") // Escape hatch
            ) {
                return;
            }

            dragging = true;
            startY = e.clientY;
            startScroll = window.scrollY;
            document.body.style.cursor = "grabbing";
            document.body.style.userSelect = "none";
        };

        const onMouseMove = (e: MouseEvent) => {
            if (!dragging) return;
            e.preventDefault();
            const delta = e.clientY - startY;
            window.scrollTo({
                top: startScroll - delta,
                behavior: "auto" // Instant for direct control
            });
        };

        const onMouseUp = () => {
            dragging = false;
            document.body.style.cursor = "";
            document.body.style.removeProperty("user-select");
        };

        window.addEventListener("mousedown", onMouseDown);
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
        window.addEventListener("mouseleave", onMouseUp);

        return () => {
            window.removeEventListener("mousedown", onMouseDown);
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
            window.removeEventListener("mouseleave", onMouseUp);
        };
    }, []);

    return <>{children}</>;
}
