'use client'

import { Layout } from 'antd';
import styles from './main-layout.module.css'
import Navigation from './navigation';
import { usePathname } from 'next/navigation';

const { Header, Footer, Content } = Layout;

function MainLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <Layout className={styles.layout}>
            {pathname === "/login" || pathname === "/register" ?
                <></> : <Header className={styles.header}>
                    <Navigation />
                </Header>}
            <Content className={styles.content}>{children}</Content>
            {pathname === "/login" || pathname === "/register" ?
                <></> : <Footer className={styles.footer}>Footer</Footer>}
        </Layout>
    )
}

export default MainLayout;