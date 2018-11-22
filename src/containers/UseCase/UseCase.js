import React from 'react';
import styles from './UseCase.module.scss';
import { Row, Col } from 'antd';
import { Menu, Icon } from 'antd';
import {Link} from 'react-router-dom';


class UseCase extends React.Component {

    navLinkOnClick = (e) => {
        console.log('Link clicked',e)
    }

    render() {
        
        return (
            
            <div className={styles.UseCase}>
                <Row gutter={15} >
                    <Col span={6}>
                        <div className={styles.Sider}>
                            <Menu onClick={this.navLinkOnClick} style={{fontSize: '24px'}} mode="inline">
                                
                                <Menu.Item key="info">
                                    <Link to={this.props.match.url + "/Information"}><span><Icon type="notification" /><span>Information</span></span></Link>
                                </Menu.Item>
                            
                                <Menu.Item key="link">
                                    <Link to={this.props.match.url + "/Connections"}><span><Icon type="link" /><span>Connections</span></span></Link>
                                </Menu.Item>

                                <Menu.Item key="readings">
                                    <Link to={this.props.match.url + "/Readings"}><span><Icon type="dot-chart" /><span>Readings</span></span></Link>
                                </Menu.Item>

                                <Menu.Item key="historic-data">
                                    <Link to={this.props.match.url + "/HistoricData"}><span><Icon type="pie-chart" /><span>Historic Data</span></span></Link>
                                </Menu.Item>
                            </Menu>
                        </div>
                    </Col>

                    <Col span={18}>
                        <div className={styles.Content}>
                           Content Here
                        </div>
                    </Col>
                </Row>
            </div>
           
        )
    }
}

export default UseCase;