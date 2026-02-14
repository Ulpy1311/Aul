"use client"

import { useEffect } from "react"

export function SecurityGuard() {
    useEffect(() => {
        // 1. Disable Right Click (Redundant if CustomContextMenu is active, but good backup)
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault()
        }

        // 2. Disable Keyboard Shortcuts (F12, Ctrl+Shift+I, etc.)
        const handleKeyDown = (e: KeyboardEvent) => {
            // F12
            if (e.key === "F12") {
                e.preventDefault()
                e.stopPropagation()
            }

            // Ctrl + Shift + I/J/C (DevTools)
            if (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i" || e.key === "J" || e.key === "j" || e.key === "C" || e.key === "c")) {
                e.preventDefault()
                e.stopPropagation()
            }

            // Ctrl + U (View Source)
            if (e.ctrlKey && (e.key === "U" || e.key === "u")) {
                e.preventDefault()
                e.stopPropagation()
            }

            // Ctrl + S (Save Page)
            if (e.ctrlKey && (e.key === "S" || e.key === "s")) {
                e.preventDefault()
                e.stopPropagation()
            }
        }

        // 3. DevTools Detection (Elements/Console open check)
        // This is a "best effort" approach as browsers try to hide this state.
        const checkDevTools = () => {
            const threshold = 160
            const widthThreshold = window.outerWidth - window.innerWidth > threshold
            const heightThreshold = window.outerHeight - window.innerHeight > threshold

            if (widthThreshold || heightThreshold) {
                // Optionally you could redirect or show a warning popup relative to privacy
                // console.clear() // Keep console clean
            }
        }

        // 4. Console Clearing & Warning
        const clearConsole = () => {
            // Prevent console inspection by flooding or clearing
            // Note: We don't want to be malicious, just annoying to inspectors
            console.log("%cStop!", "color: red; font-size: 50px; font-weight: bold;")
            console.log("%cThis is a secure area.", "font-size: 20px;")
        }

        document.addEventListener("contextmenu", handleContextMenu)
        document.addEventListener("keydown", handleKeyDown)
        window.addEventListener("resize", checkDevTools)

        // Initial check
        const interval = setInterval(() => {
            checkDevTools()
            // clearConsole() // Optional: can be annoying for dev, uncomment if truly needed
        }, 1000)

        clearConsole()

        return () => {
            document.removeEventListener("contextmenu", handleContextMenu)
            document.removeEventListener("keydown", handleKeyDown)
            window.removeEventListener("resize", checkDevTools)
            clearInterval(interval)
        }
    }, [])

    // Render nothing
    return null
}
