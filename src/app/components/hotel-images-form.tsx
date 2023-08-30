import { InboxOutlined } from "@ant-design/icons";
import { Button, Upload, UploadFile, UploadProps } from "antd";
import { useEffect, useState } from "react"
import APIService from "../services/API-Service";

const { Dragger } = Upload;

interface HotelImagesFormProps {
    next: (urls: string[]) => void,
    id: string
}

function HotelImagesForm({ next, id }: HotelImagesFormProps) {

    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [uploading, setUploading] = useState(false);

    const props: UploadProps = {
        name: "images",
        multiple: true,
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload(file, FileList) {
            if (FileList.length != 0) {
                setFileList([...fileList, ...FileList])
            } else {
                setFileList([...fileList, file])
            }
            return false;
        },
        fileList,
    }

    const upload = async () => {
        setUploading(true);
    }

    useEffect(() => {
        if (uploading) {
            handleUpload();
        }
    }, [uploading])

    const handleUpload = async () => {
        const response = await APIService.uploadHotelImages(id, fileList)
        console.log(response);
        if (response.status == 200) {
            const json = await response.json()
            next(json.fileUrls)
        }
        setUploading(false)
    }

    return (
        <>
            <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag files to this area to upload</p>
                <p className="ant-upload-hint">Select images to upload</p>
            </Dragger>
            <Button
                style={{ marginTop: "10px" }}
                disabled={fileList.length === 0}
                loading={uploading}
                onClick={upload}
                block
                type='primary'
            >
                Next
            </Button>
        </>
    )
}

export default HotelImagesForm