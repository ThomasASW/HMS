'use client'

import { useState, useEffect } from "react";
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import { HomeOutlined, LogoutOutlined, PlusCircleOutlined, ShoppingCartOutlined } from "@ant-design/icons"
import { usePathname, useRouter } from "next/navigation";

const items: MenuProps['items'] = [
    {
        label: 'Hotels',
        key: 'list',
        icon: <HomeOutlined />,
    },
    {
        label: 'Bookings',
        key: 'bookings',
        icon: <ShoppingCartOutlined />,
    },
    {
        label: 'Logout',
        key: 'logout',
        icon: <LogoutOutlined />,
    },
];

const hotelAdminMenu: MenuProps['items'] = [
    {
        label: 'Hotels',
        key: 'list',
        icon: <HomeOutlined />,
    },
    {
        label: 'Logout',
        key: 'logout',
        icon: <LogoutOutlined />,
    },
];

const adminMenu: MenuProps['items'] = [
    {
        label: 'Hotels',
        key: 'list',
        icon: <HomeOutlined />,
    },
    {
        label: 'Add Hotel',
        key: 'upsert',
        icon: <PlusCircleOutlined />,
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
    const [role, setRole] = useState<string | null>();

    useEffect(() => {
        setRole(localStorage.getItem("role"))
    }, [])

    useEffect(() => {
        console.log(pathname);
        const paths = pathname.split("/");
        const keys = items?.map((item) => `${item?.key}`)
        if (keys != undefined) {
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                if (paths.includes(key)) {
                    setCurrent(key)
                }
            }
        }
    }, [pathname])

    const onClick: MenuProps['onClick'] = (e) => {
        console.log('click ', e);
        if (e.key === "logout") {
            logout();
        } else {
            route(e.key);
            setCurrent(e.key);
        }
    };

    const route = (key: string) => {
        if (key == "upsert") {
            push("/hotels/upsert");
        } else if (key == "list" && role == "user") {
            push("list")
        } else if (key == "bookings") {
            push("bookings")
        }
    }

    const logout = async () => {
        const response = await fetch("/api/users/logout", { method: "POST" });
        if (response.status === 200) {
            localStorage.removeItem("role")
            push("/login");
        }
    }

    return <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={role == "user" ? items : role == "admin" ? adminMenu : hotelAdminMenu} />;

}

export default Navigation;