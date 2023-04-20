import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row, Alert } from 'reactstrap';
import qs from 'querystring';
import { UrlLink, TokenData } from '../../../constanst';
import Axios from "../../../config";
import {
  withRouter
} from 'react-router-dom';

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: "admin",
      password: "123qwe",
      visible: false
    }
    this.onDismiss = this.onDismiss.bind(this);
  }

  onDismiss(value) {
    this.setState({ visible: value });
  }

  onLogin = async () => {

      try {
        const response = await  Axios.getInstance().post('/api/TokenAuth/Authenticate', {
          "userNameOrEmailAddress": this.state.username,
          "password": this.state.password,
          "rememberClient": true
        })
        if(response.data.success){
          localStorage.setItem(TokenData, JSON.stringify(response.data.result));
          this.props.history.push('/dashboard')
        }
      } catch (error) {
        this.onDismiss(true);
      }
  }

  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <Alert color="danger" isOpen={this.state.visible} toggle={this.onDismiss}>
                Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng thử lại.
              </Alert>
            </Col>
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form>
                      <h1>Đăng nhập</h1>
                      <p className="text-muted">Đăng nhập bằng tài khoản của bạn</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" placeholder="Tên đăng nhập" autoComplete="username"
                          value={this.state.username} onChange={text => this.setState({ username: text.target.value })} />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="password" placeholder="Mật khẩu" autoComplete="current-password"
                          value={this.state.password} onChange={text => this.setState({ password: text.target.value })} />
                      </InputGroup>

                      <Row>
                        <Col xs="6">
                          <Button color="primary" className="px-4" onClick={this.onLogin}>Đăng nhập</Button>
                        </Col>
                        <Col xs="6" className="text-right">
                          {/* <Button color="link" className="px-0">Forgot password?</Button> */}
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                  <CardBody className="text-center">
                    <div>
                      <h2>Thông tin</h2>
                      <p>Thông tin tài khoản được cung cấp bởi người quản lý.</p>
                      <Link to="/register">
                        {/* <Button color="primary" className="mt-3" active tabIndex={-1}>Register Now!</Button> */}
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default withRouter(Login);
