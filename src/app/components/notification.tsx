"use client"

import { message } from 'antd';
import React, { useEffect } from 'react'
import { getNotificationContent, notificationSlice, useDispatch, useSelector } from '../../../redux';

function Notification() {

    const dispatch = useDispatch();
    const notification = useSelector(getNotificationContent);
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        if (notification.content != null && notification.content != "") {
            messageApi.open({
                type: notification.type,
                content: notification.content,
                duration: notification.duration
            })
            dispatch(notificationSlice.actions.notify({
                content: "",
                type: "error",
                duration: 0
            }))
        }
    }, [notification])

    return (
        <>{contextHolder}</>
    )
}

export default Notification