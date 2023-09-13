import React from "react";
import styles from './layout.module.css'
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Register - HMS"
}

export default function RegisterLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className={styles.container}>{children}</div>
    )
}