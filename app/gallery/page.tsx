import { GalleryGrid } from "@/components/valentine/gallery-grid"
import { Navbar } from "@/components/ui/navbar"

export default function GalleryPage() {
    return (
        <main className="min-h-screen w-full bg-background text-foreground">
            {/* Navbar is in layout, but we need spacer/padding for fixed nav */}
            <div className="h-24" />

            <div className="flex flex-col items-center justify-center py-12 text-center">
                <h1 className="font-serif text-4xl md:text-6xl font-medium text-foreground/90 drop-shadow-sm mb-4">
                    Our Memories
                </h1>
                <p className="text-muted-foreground max-w-lg px-4 leading-relaxed">
                    Setiap kenangan ini, apapun itu, akan kusimpan selamanya. Maaf jika masih ada yang kurang, tapi semua ini kubuat tulus untukmu.
                </p>
            </div>

            <GalleryGrid />

            <div className="h-24" /> {/* Bottom spacer */}
        </main>
    )
}
