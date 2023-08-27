import { Col, Row } from "antd";

function PageFooter() {
    return (
        <Row>
            <Col span={8}></Col>
            <Col span={8} style={{ textAlign: "center" }}>Copyright 2023</Col>
            <Col span={8}></Col>
        </Row>
    )
}

export default PageFooter;