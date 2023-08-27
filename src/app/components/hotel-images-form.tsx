import { InboxOutlined } from "@ant-design/icons";
import { Button, Upload, UploadFile, UploadProps } from "antd";
import { useEffect, useState } from "react"
import { RcFile } from "antd/es/upload";

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
        const formData = new FormData();
        fileList.forEach((file) => {
            formData.append("files[]", file as RcFile);
        });
        formData.append("hotelId", id);
        const endpoint = '/api/hotels/upload-images'
        const options = {
            method: 'POST',
            body: formData,
        }
        fetch(endpoint, options)
            .then((response) => {
                response.json().then((json) => {
                    if (response.status == 200) {
                        setUploading(false);
                        next(json.fileUrls);
                    }
                })
            })
            .catch((error) => {
                console.log(error);
                setUploading(false);
            })
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