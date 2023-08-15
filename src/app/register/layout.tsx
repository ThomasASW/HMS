import React from "react";
import styles from './layout.module.css'

export default function RegisterLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className={styles.container}>{children}</div>
    )
}