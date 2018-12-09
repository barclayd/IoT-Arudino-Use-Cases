import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Form, Input, Select, InputNumber, Button, notification, Tabs, Popconfirm} from "antd";
import * as actions from "../../store/actions";
import FormItem from "antd/lib/form/FormItem";
import {Redirect} from "react-router-dom";
import {updateObject} from '../../store/utility';
import classes from './Settings.module.css';

let deleteRedirect;

class Settings extends Component {

    state = {
        justLanded: true,
        sensors: {
            sensorName: ''
        }
    };

    componentDidMount() {
         this.props.onFetchUseCaseData();
         this.props.onFetchSensors();
    }

    componentWillReceiveProps(nextProps) {
        if(!nextProps.loading) {
            nextProps.data.forEach((useCase) => {
                if (useCase.id === this.props.id) {
                    for(let sensor in useCase.sensorsData) {
                        this.setState({
                            sensors: useCase.sensorsData[sensor],
                            email: useCase.email,
                            name: useCase.name,
                            shortDesc: useCase.shortDesc,
                            longDesc: useCase.longDesc,
                            image: useCase.image,
                            imageDesc: useCase.imageDesc
                        })
                    }
                }
            });
        }
    }

    savedSettingsNotification = (type) => {
        notification[type]({
            message: 'Settings successfully saved!',
            description: `The settings have been successfully updated for ${this.state.name}`,
        });
    };

    openNewUseCaseNotification = (type) => {
        notification[type]({
            message: 'New Use Case Created!',
            description: `A new use case has been created. You can update the settings in greater detail here`,
        });
    };

    onChangeTab = (key) => {
        this.setState({
            tab: key
        })
    };

    submitSettings() {
        let sensorsData = [];
        sensorsData.push(this.state.sensors);
        let email = {
            email: {...this.state.email}
        };
        let useCaseData = {'name': this.state.name, 'shortDesc': this.state.shortDesc, 'longDesc': this.state.longDesc, 'image': this.state.image, 'imageDesc': this.state.imageDesc};
        let mergedObject = {...email, sensorsData};
        let finalMerge = {...mergedObject, ...useCaseData};
        this.props.onSubmitSettings(this.props.id, finalMerge);
        if(this.props.saved) {
            this.savedSettingsNotification('success');
        }
    }


    getSensorName = (settingName, settingValue) => {
        const updatedSensors = updateObject(this.state.sensors, {
            [settingName]: settingValue
        } );
        this.setState({
            sensors: updatedSensors
        });
    };

    changeEmailSetting = (settingName, settingValue) => {

        const updatedEmails = updateObject(this.state.email, {
            [settingName]: settingValue
        } );

      this.setState({
          email: updatedEmails
      })
    };

    changeEmailSettingOther = (settingName, settingValue) => {
        const updatedEmails = updateObject(this.state.email, {
            [settingName]: settingValue.target.value
        } );
        this.setState({
            email: updatedEmails
        })
    };

    changeUseCaseDetails = (settingName, settingValue) => {
        const newValue = settingValue.target.value;
        this.setState({
            [settingName]: newValue
        });
    };

    changeUseCaseDetailsOther = (settingName, settingValue) => {
        this.setState({
            [settingName]: settingValue
        });
    };

    confirmDelete = (e) => {
        console.log(e);
        this.props.onDeleteUseCase(this.props.id, this.state.name);
        deleteRedirect = (this.props.saved ? <Redirect exact to='/admin-area' /> : null);
    };

    cancelDelete = (e) =>  {
        console.log(e);
    };

    render() {
        const TabPane = Tabs.TabPane;

        const { TextArea } = Input;

        const FormItem = Form.Item;
        const Option = Select.Option;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 5 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 12 },
            },
        };

        let sensors = [];
        let emails = {};

        let settings = this.props.data.forEach((useCase) => {
            if (useCase.id === this.props.id) {
                for(let sensor in useCase.sensorsData) {
                    sensors.push(useCase.sensorsData[sensor]);
                }
                emails = {...useCase.email};
            }
        });

        const emailConfig = (email) => (email);

        let useCaseDetails = (
                <React.Fragment>
                 <FormItem {...formItemLayout} key='name' label='Name'>
                     <Input defaultValue={this.state.name} onChange={(e) => this.changeUseCaseDetails('name', e)}/>
                 </FormItem>
                <FormItem {...formItemLayout} key='shortDesc' label='Summary'>
                    <Input defaultValue={this.state.shortDesc} onChange={(e) => this.changeUseCaseDetails('shortDesc', e)}/>
                </FormItem>
                <FormItem {...formItemLayout} key='longDesc' label='Long Description'>
                    <TextArea value={this.state.longDesc} onChange={(e) => this.changeUseCaseDetails('longDesc', e)}/>
                </FormItem>
                    <FormItem {...formItemLayout} key='image' label='Image'>
                        <Select style={{width: '100%'}} value={this.state.image} placeholder='Please select a sensor type' onChange={(e) => this.changeUseCaseDetailsOther('image', e)}>
                            <Option value='road.jpg'>Road</Option>
                            <Option value='beach.jpg'>Beach</Option>
                            <Option value='nhsfridge.jpg'>Fridge</Option>
                            <Option value='bathmotion.jpg'>Bath</Option>
                            <Option value='watercomposition.jpg'>Water</Option>
                        </Select>
                    </FormItem>
                    <FormItem {...formItemLayout} key='imageDesc' label='Image Description'>
                        <Input defaultValue={this.state.imageDesc} onChange={(e) => this.changeUseCaseDetails('imageDesc', e)}/>
                    </FormItem>
                </React.Fragment>

    );


        let emailSettings = Object.keys(emails).map((email) => {
            switch (email) {
                        case('senders'):
                            return <FormItem {...formItemLayout} key={email} label={email}>
                                <Select settingType={email} mode='multiple' placeholder='Please select email addresses' defaultValue={emails[email]} value={emailConfig(emails[email])} onChange={(e) => this.changeEmailSetting(email, e)}>
                                <Option value={emails[email]} key={Math.random()}>{emails[email]}</Option>
                                    <Option value='test@gmail.com'>test@gmail.com</Option>
                                    <Option value='peter.trott@gmail.com'>peter.trott@gmail.com</Option>
                                </Select>
                            </FormItem>;
                        default:
                            return <FormItem {...formItemLayout} key={email} label={email}> <TextArea defaultValue={emails[email]} onChange={(e) => this.changeEmailSettingOther(email, e)}/> </FormItem>

            }
        });
        let sensorType;
        let sensorComponent;

        let sensorsSettings = sensors.map((sensor) => {
            return Object.keys(sensor).map((setting) => {
                if(!isNaN(parseInt(sensor[setting]))) {
                    return (
                        <FormItem {...formItemLayout} label={setting} key={sensor[setting]}>
                            <InputNumber defaultValue={sensor[setting]} style={{ width: '65%', marginRight: '3%' }}  onChange={(e) => this.getSensorName(setting, e)}/>
                            <Select style={{ width: '32%' }} defaultValue='celsius'>
                                <Option value='celsius'>°C</Option>
                                <Option value='fahrenheit'>°F</Option>
                            </Select>
                        </FormItem>
                    )
                } else {
                    switch (setting) {
                        case('sensorName'):
                            sensorType = (
                                <FormItem {...formItemLayout} label={'Sensor Type'} key={sensor[setting]}>
                                <Select defaultValue={sensor[setting]} placeholder='Select a sensor type' onChange={(e) => this.getSensorName(setting, e)}>
                                    {this.props.sensorsList.map((sensor, index) => {
                                        return (<Option value={sensor.sensorName} key={index}>{sensor.sensorName} </Option>)
                                    })}
                                </Select>
                            </FormItem>);
                            return null;
                        case('sensorComponent'):
                                    sensorComponent = (
                                        <FormItem {...formItemLayout} label={'Sensor Component'} key={sensor[setting]}>
                                            <Select defaultValue={sensor[setting]} placeholder='Please select a sensor component'
                                                    onChange={(e) => this.getSensorName(setting, e)}>
                                                {this.props.sensorsList.map((sensor, index) => {
                                                    if(sensor.sensorName === this.state.sensors.sensorName) {
                                                        return sensor.sensorComponents.map((cmp, index) => {
                                                            return (<Option value={cmp} key={index}>{cmp}</Option>)
                                                        })
                                                    }
                                                })}
                                            </Select>
                                        </FormItem>);
                                        return null;
                            default:
                            return <FormItem {...formItemLayout} key={setting} label={setting}> <Input
                                defaultValue={sensor[setting]} style={{width: '100%'}}/>
                            </FormItem>
                    }
                }
            });
        });


        let button = <Button type="primary" htmlType="submit" onClick={() => this.submitSettings()} loading={this.props.loading}>Submit</Button>;

        let notification = null;
        if(this.props.success && this.state.justLanded) {
            notification = this.openNewUseCaseNotification('info');
            this.setState({
                justLanded: false
            })
        }

        let deleteUsecase;
        if(this.state.name !== null) {
            deleteUsecase =
                <Popconfirm title={`Are you sure delete ${this.state.name} use case?`} onConfirm={this.confirmDelete} onCancel={this.cancelDelete} okText="Yes" cancelText="No">
                    <Button type="danger" htmlType="submit" loading={this.props.loading} style={{backgroundColor: '#f5222d', color: '#f5f5f5'}}>DELETE</Button>
                </Popconfirm>
        }


        return (
            <React.Fragment>
                {deleteRedirect}
                {notification}
                {settings}
                <Tabs type='card' onChange={this.onChangeTab} tabBarExtraContent={this.state.tab !== 'delete' ? button : deleteUsecase}>
                <TabPane tab="General Information" key="general">
                    <h2>General Settings</h2>
                    {useCaseDetails}
                </TabPane>
                    <TabPane tab="Email Settings" key="email">
                    <h2>Email Settings </h2>
                    <Form>
                        {emailSettings}
                    </Form>
                    </TabPane>
                    <TabPane tab="Sensor Settings" key="sensor">
                    <h2>Sensor Settings </h2>
                        <Form>
                            {sensorType}
                            {sensorComponent}
                    {sensorsSettings}
                        </Form>
                    </TabPane>
                    {localStorage.getItem("role") === 'Trainer' ? <TabPane tab="Delete" key="delete">
                        <h2>Delete the {this.state.name} Use Case</h2>
                        <p>This will remove all information relating to the Use Case</p>
                    </TabPane> : null}
                </Tabs>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        data: state.useCaseFirebase.data,
        loading: state.useCaseFirebase.loading,
        saved: state.useCaseFirebase.saved,
        success: state.createUseCase.success,
        sensorsList: state.sensors.sensors,
        deleted: state.useCaseFirebase.deleted
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onFetchUseCaseData: () => dispatch(actions.fetchUseCaseData()),
        onSubmitSettings: (useCaseId, settings) => dispatch(actions.submitSettings(useCaseId, settings)),
        onFetchSensors: () => dispatch(actions.fetchSensorsData()),
        onDeleteUseCase: (id, useCase) => dispatch(actions.deleteUseCase(id, useCase))
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(Settings);
