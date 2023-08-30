import styles from "./layout.module.css"

export default function ListLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <div className={styles.container}>{children}</div>
}