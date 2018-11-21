import React, {Component} from 'react';
import UseCaseCard from "../../components/UseCaseCard/UseCaseCard";
import styles from './UseCasesList.module.scss'
import {connect} from 'react-redux';
import * as actions from '../../store/actions/index';
import { Row, Col } from 'antd';

class UseCasesList extends Component {

    componentDidMount() {
        this.props.onFetchUseCase();
    }

    render() {

        console.log(this.props.useCases);

        return (
            <div className={styles.UseCasesList}>
                <Row gutter={16}>

                   {
                    this.props.useCases.map((useCase, index) => {
                        const isLoading = this.props.loading;
                        if(isLoading) {
                            return (
                            <Col span={8} >
                                <UseCaseCard key={index} loading={isLoading}/>
                            </Col>
                            )
                        }
                        return (
                            <Col span={8} >
                                <UseCaseCard key={index} {...useCase} />
                            </Col>
                        )   
                    })
                   }
                </Row>
            </div>
           
        )
    }
}


const mapStateToProps = state => {
    return {
        useCases: state.useCaseData.useCases,
        error: state.useCaseData.error,
        loading: state.useCaseData.loading
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onFetchUseCase: () => dispatch(actions.fetchUseCase())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(UseCasesList);