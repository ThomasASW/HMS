'use client';

import React, { useState } from 'react'
import { Card, Steps } from 'antd';
import HotelDetailsForm from './hotel-details-form';
import HotelImagesForm from './hotel-images-form';
import ImageDescForm from './image-desc-form-item';

function HotelForm() {

    const [current, setCurrent] = useState(0);
    const [insertedID, setInsertedID] = useState("");
    const [fileUrls, setFileUrls] = useState<string[]>([]);

    const next = (id: string) => {
        setInsertedID(id);
        setCurrent(1);
    }

    const imageNext = (urls: string[]) => {
        setFileUrls(urls);
        setCurrent(2);
    }

    return (
        <Card style={{ width: "85%" }}>
            <Steps
                size='small'
                current={current}
                items={[
                    {
                        title: "Hotel details",
                    },
                    {
                        title: "Upload images"
                    },
                    {
                        title: "Image details"
                    }
                ]}
                style={{ marginBottom: "25px" }}
            />
            {current == 0 ? <HotelDetailsForm next={next} /> : current == 1 ? <HotelImagesForm next={imageNext} id={insertedID} /> : <ImageDescForm id={insertedID} fileUrls={fileUrls} />}
        </Card >
    )
}

export default HotelForm;