import { Button, Card, Form, Input, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { DefaultOptionType } from 'antd/es/select';
import { Filter, filterSlice, useDispatch } from '../../../redux';
import APIService from '../services/API-Service';

function FilterSidebar() {

    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [countries, setCountries] = useState<DefaultOptionType[]>([])
    const [states, setStates] = useState<DefaultOptionType[]>([])

    useEffect(() => {
        getCountryList();
        getStateList();
    }, [])

    const getCountryList = async () => {
        const response = await APIService.getCountryList();
        console.log(response);
        if (response.status == 200) {
            const json = await response.json();
            const countryList: string[] = JSON.parse(json);
            let countrySelectProps: DefaultOptionType[] = []
            countryList.forEach((country) => {
                countrySelectProps.push({
                    label: country,
                    value: country
                })
            })
            setCountries(countrySelectProps);
        }
    }

    const getStateList = async () => {
        const response = await APIService.getStateList();
        console.log(response);
        if (response.status == 200) {
            const json = await response.json();
            const stateList: string[] = JSON.parse(json);
            let stateSelectProps: DefaultOptionType[] = []
            stateList.forEach((state) => {
                stateSelectProps.push({
                    label: state,
                    value: state
                })
            })
            setStates(stateSelectProps);
        }
    }

    const filter = (values: Filter) => {
        dispatch(
            filterSlice.actions.filter(values)
        )
    }

    return (
        <Card
            title="Filter"
            style={{ width: "100%", height: "100%" }}
            bodyStyle={{ padding: "10px" }}
            headStyle={{ paddingLeft: "10px", paddingRight: "10px" }}
        >
            <Form
                layout='vertical'
                form={form}
                onFinish={filter}
            >
                <Form.Item name="name" label="Search" style={{ marginBottom: "5px" }}>
                    <Input
                        placeholder='Search hotels'
                        allowClear
                    />
                </Form.Item>
                <Form.Item name="address" label="Address" style={{ marginBottom: "5px" }}>
                    <Input placeholder='Search by address' allowClear />
                </Form.Item>
                <Form.Item name="state" label="State" style={{ marginBottom: "5px" }}>
                    <Select
                        placeholder="Filter by state"
                        options={states}
                        allowClear
                    />
                </Form.Item>
                <Form.Item name="country" label="Country" style={{ marginBottom: "5px" }}>
                    <Select
                        placeholder="Filter by country"
                        options={countries}
                        allowClear
                    />
                </Form.Item>
                <Form.Item style={{ marginTop: "15px" }}>
                    <Button
                        type='primary'
                        block
                        htmlType='submit'
                    >
                        Filter
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    )
}

export default FilterSidebar