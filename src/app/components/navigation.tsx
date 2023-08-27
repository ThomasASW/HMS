'use client'

import { useState, useEffect } from "react";
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import { HomeOutlined, LogoutOutlined } from "@ant-design/icons"
import { usePathname, useRouter } from "next/navigation";

const items: MenuProps['items'] = [
    {
        label: 'Hotels',
        key: 'hotels',
        icon: <HomeOutlined />,
    },
    {
        label: 'Logout',
        key: 'logout',
        icon: <LogoutOutlined />,
    },
];

function Navigation() {

    const { push } = useRouter();
    const pathname = usePathname();
    const [current, setCurrent] = useState('mail');

    useEffect(() => {
        console.log(pathname);
        const path = pathname.substring(1);
        if (items?.map((item) => item?.key).includes(path)) {
            setCurrent(path)
        }
    }, [pathname])

    const onClick: MenuProps['onClick'] = (e) => {
        console.log('click ', e);
        if (e.key === "logout") {
            logout();
        } else {
            setCurrent(e.key);
        }
    };

    const logout = async () => {
        const response = await fetch("/api/users/logout", { method: "POST" });
        if (response.status === 200) {
            push("/login");
        }
    }

    return <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />;

}

export default Navigation;