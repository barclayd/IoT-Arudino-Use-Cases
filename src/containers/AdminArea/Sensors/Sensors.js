import React from 'react';
import {Select, Button, Collapse, Form, Input, Icon, Row, Col, notification} from 'antd';
import {connect} from 'react-redux';

const FormItem = Form.Item;
const Option = Select.Option;
const Panel = Collapse.Panel;
const { TextArea } = Input;

const formItemLayout = {

};

const UseCasesController = (props) => {


    let content = (<div> No Use Cases</div>);
    let notification = (props.deleted ? props.deletedUseCaseNotification('warning') : null);

    if (props.useCases){
        content =
            (
                <Collapse accordion>
                    {Object.keys(props.useCases).map((useCaseKey, index) => {
                        const useCase = props.useCases[useCaseKey];
                        const useCaseUsersIDs = props.getUseCaseUsers(useCase).map(user => user.userUUID);
                        return (
                            <Panel header={useCase.name} key={index}>
                                <h3>Information:</h3>
                                <div key={index}>
                                    <FormItem {...formItemLayout} label='Name'>
                                        <Input style={{width: '100%'}} value={useCase.name} onChange={(e) => props.updateUseCase('name', e, useCase)}/>
                                    </FormItem>
                                    <FormItem {...formItemLayout} label='Summary'>
                                        <Input style={{width: '100%'}} value={useCase.shortDesc}  onChange={(e) => props.updateUseCase('shortDesc', e, useCase)}/>
                                    </FormItem>
                                    <FormItem {...formItemLayout} label='Description'>
                                        <TextArea rows={4} style={{width: '100%'}} value={useCase.longDesc} onChange={(e) => props.updateUseCase('longDesc', e, useCase)}/>
                                    </FormItem>
                                    <h3>Users' Permissions:</h3>
                                    <p>Manage the users who can see and access this use case</p>
                                    <Select
                                        mode="multiple"
                                        style={{ width: '100%' }}
                                        placeholder="Please select"
                                        value={useCaseUsersIDs}
                                        onChange={(value) => props.handleUseCasePermissionsChanged(useCase, value)}
                                    >
                                        {props.users.map((user, index) => {
                                            return (<Option value={user.userUUID} key={index}>{user.name}</Option>)
                                        })}
                                    </Select>
                                    <Button onClick={props.handleUseCasesSave} type="primary">
                                        Save
                                    </Button>
                                </div>
                            </Panel>

                        );
                    })}
                </Collapse>
            )
    }

    return (
        <React.Fragment>
            {notification}
            <h2>Sensors</h2>
            {content}
        </React.Fragment>);
};


const mapStateToProps = state => {
    return {
        deleted: state.useCaseFirebase.deleted,
        lastDeletedUseCase: state.useCaseFirebase.deletedUseCase
    }
};

export default connect(mapStateToProps)(UseCasesController);