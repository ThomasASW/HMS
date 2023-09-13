import React from "react";
import styles from './layout.module.css'
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login - HMS"
}

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className={styles.container}>{children}</div>
    )
}