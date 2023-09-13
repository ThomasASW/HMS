import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Hotels - HMS"
}

export default function ListLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <div>{children}</div>
}