import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Table } from 'reactstrap';
import withAuth from '../../hoc/withAuth';
import _ from "lodash";
import { UrlLink, TokenData } from '../../constanst';
import Axios from "../../config";



class User extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: {}
    }
  }

  async componentDidMount() {

    try {
      var result = JSON.parse(localStorage.getItem(TokenData))

      if (result == null || !result.accessToken) {
        return;
      }
      const token = result.accessToken
      const response = await Axios.getInstance(token).get(`/api/services/app/User/Get?Id=${this.props.match.params.id}`)

      if (response.data.success) {
        this.setState({
          user: response.data.result
        });
      }
    } catch (error) {
      //this.onDismiss(true);
      console.log(error);
    }

  }

  render() {
    
    if (this.state.user === null || this.state.user === {}) return;
    return (
      <div className="animated fadeIn">
        <Row>
          <Col lg={6}>
            <Card>
              <CardHeader>
                <strong><i className="icon-info pr-1"></i>User id: {this.props.match.params.id}</strong>
              </CardHeader>
              <CardBody>
                <Table responsive striped hover>
                  <tbody>

                    <tr>
                      <td>Họ và tên</td>
                      <td><strong>{this.state.user.name}</strong></td>
                    </tr>
                    <tr>
                      <td>Vai trò</td>
                      <td>

                        {
                          _.map(this.state.user.roleNames, item => {
                            return <strong>{item} </strong>;
                          })
                        }

                      </td>
                    </tr>

                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default withAuth(User);
