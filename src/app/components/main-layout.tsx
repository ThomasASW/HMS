'use client'

import { Layout } from 'antd';
import styles from './main-layout.module.css'
import Navigation from './navigation';
import { usePathname } from 'next/navigation';
import PageFooter from './footer';
import FilterSidebar from './filter-sidebar';

const { Header, Footer, Content, Sider } = Layout;

function MainLayout({ children }: { children: React.ReactNode }) {

    const pathname = usePathname();

    return (
        <Layout className={styles.layout}>
            {pathname === "/login" || pathname === "/register" ?
                <></> : <Header className={styles.header}>
                    <Navigation />
                </Header>}
            <Layout hasSider>
                <Sider width={pathname == "/hotels/list" ? 300 : 0} style={{ padding: "5px", backgroundColor: "inherit", position: "fixed", top: "64px", left: "0", bottom: "67px", height: `calc(100% - 67px - 64px)` }}>
                    {pathname == "/hotels/list" ? <FilterSidebar /> : <></>}
                </Sider>
                <Content style={{
                    padding: "5px",
                    height: `calc(100% - 67px - 64px)`,
                    width: pathname == "/hotels/list" ? "calc(100% - 300px)" : "100%",
                    position: "fixed",
                    left: pathname == "/hotels/list" ? "300px" : "0",
                    top: "64px",
                    overflowY: "scroll"
                }}>{children}</Content>
            </Layout>
            {pathname === "/login" || pathname === "/register" ?
                <></> : <Footer className={styles.footer}><PageFooter /></Footer>}
        </Layout>
    )
}

export default MainLayout;