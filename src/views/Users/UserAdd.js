import React, { Component } from 'react';
import { Card, CardBody, Badge, CardHeader, Col, Row, CardFooter, Button, FormGroup, Label, Input, FormText } from 'reactstrap';
import withAuth from '../../hoc/withAuth';
import _ from "lodash";
import { UrlLink, TokenData } from '../../constanst';
import Axios from "../../config";
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const CheckBox = props => {
  return (

    <FormGroup check className="checkbox" key={props.id}>
      <Input className="form-check-input" key={props.id} onChange={props.handleCheckChieldElement} type="checkbox" checked={props.isChecked} value={props.id} />
      <Label check className="form-check-label" htmlFor={`checkbox${props.id}`}>{props.name}</Label>
    </FormGroup>


  )
}

const UserSchema = Yup.object().shape({
  userName:Yup.string()
  .min(2, 'Tên đăng nhập quá ngắn!')
  .max(30, 'Tên đăng nhập quá dài!')
  .required('Tên đăng nhập không để trống'),
  name: Yup.string()
    .required('Tên họ không để trống'),
  surname: Yup.string()
    .required('Tên lót không để trống'),
  password:Yup.string()
    .required('Mật khẩu không để trống'),
  emailAddress: Yup.string()
    .email('Không đúng định dạng email')
    .required('Email không để trống'),
});

class UserAdd extends Component {

  constructor(props) {
    super(props);
    this.state = {
      
      roles: [],
      

    }
    this.container = React.createRef();

  }

  async componentDidMount() {
    try {
      var result = JSON.parse(localStorage.getItem(TokenData))

      if (result == null || !result.accessToken) {
        return;
      }
      const token = result.accessToken
      
      const responserole = await Axios.getInstance(token).get(`/api/services/app/Role/GetAll`)

      if ( responserole.data.success) {
        var items = responserole.data.result.items.map((member) => {
          return {
            ...member,
            isChecked: false
          }
        });
        this.setState({
          roles: items
        });
      }
    } catch (error) {

      console.log(error);
    }
  }


  handleAllChecked = (event) => {
    let roles = this.state.roles
    roles.forEach(fruite => fruite.isChecked = event.target.checked)
    this.setState({ roles: roles })
  }

  handleCheckChieldElement = (event) => {
    let roles = this.state.roles

    roles.forEach(fruite => {
      if (_.toLower(fruite.id) === _.toLower(event.target.value))
        fruite.isChecked = event.target.checked
    })
    this.setState({ fruites: roles }, () => {
      console.log(this.state.roles);
    })
  }

  async onSave(values) {

    let roles = [];
    _.map(this.state.roles, item => {
      if (item.isChecked === true) {
        roles.push(item.name)
      }
    });

    try {
      var result = JSON.parse(localStorage.getItem(TokenData))

      if (result == null || !result.accessToken) {
        return;
      }
      const token = result.accessToken

      const {userName,name,surname,emailAddress,password} = values

      const response = await Axios.getInstance(token).post(`/api/services/app/User/Create`, {

        userName: userName,
        name: name,
        surname: surname,
        emailAddress: emailAddress,
        isActive: true,
        roleNames: roles,
        password: password

      })

      toastr.options = {
        positionClass: 'toast-top-right',
        hideDuration: 100,
        timeOut: 3000,
        progressBar: true,
      }
      // toastr.clear()//Xoá các toastr trước đây
      toastr.success(`Thêm tài khoản người dùng thành công`)

      if (response.data.success) {
        // this.setState({
        //   user: response.data.result
        // });
      }
    } catch (error) {

      toastr.options = {
        positionClass: 'toast-top-right',
        hideDuration: 100,
        timeOut: 3000,
        progressBar: true,
      }
      // toastr.clear()//Xoá các toastr trước đây
      toastr.error(`Đã có lỗi trong quá trình xử lý`)
    }

  }


  onBack=()=> {
    
    this.props.history.go(-1);
  }

  render() {

    if (this.state.user === null || this.state.user === {}) return;
    return (
      <div className="animated fadeIn">

        <Row>

          <Col lg={12}>
            <Formik
              initialValues={{
                id: 1,
                userName: "",
                name: "",
                surname: "",
                emailAddress: "",
                isActive: true,
                fullName: "",
                lastLoginTime: "",
                creationTime: "",
                password:""
              }}
              validationSchema={UserSchema}
              onSubmit={values => {
                //Khi tất các valid thì nó sẽ chạy vào submit
                this.onSave(values);
              }}
              onReset={values=>{

              }}
            >
              {({ errors, touched, handleReset,isValidating,handleSubmit}) => (
                <Card>

                  <CardHeader>
                    <strong><i className="icon-info pr-1"></i>Thông tin người dùng</strong>
                  </CardHeader>
                  <CardBody>

                    <Col lg={6}>

                      <Form className="form-horizontal">

                        <FormGroup row>
                          <Col md="3">
                            <Label htmlFor="text-input">Tên đăng nhập</Label>
                          </Col>
                          <Col xs="12" md="9">
                            <Field className={`form-control ${errors.userName && touched.userName && 'is-invalid' }`} name="userName" type="text"   placeholder="Nhập tên tài khoản..."/>
                            {errors.userName && touched.userName &&  <span className="invalid-feedback">{errors.userName}</span>}
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col md="3">
                            <Label htmlFor="text-input">Tên họ</Label>
                          </Col>
                          <Col xs="12" md="9">
                           
                            <Field className={`form-control ${errors.name && touched.name && 'is-invalid' }`} name="name" type="text" placeholder="Nhập tên họ tài khoản..." />
                            {errors.name && touched.name &&  <span className="invalid-feedback">{errors.name}</span>}

                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col md="3">
                            <Label htmlFor="text-input">Tên lót</Label>
                          </Col>
                          <Col xs="12" md="9">
                          
                            <Field className={`form-control ${errors.surname && touched.surname && 'is-invalid' }`} name="surname" type="text" placeholder="Nhập tên lỏt tài khoản..."  />
                            {errors.surname && touched.surname &&  <span className="invalid-feedback">{errors.surname}</span>}

                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col md="3">
                            <Label htmlFor="email-input">Email</Label>
                          </Col>
                          <Col xs="12" md="9">
                           
                            <Field className={`form-control ${errors.emailAddress && touched.emailAddress && 'is-invalid' }`} name="emailAddress" type="email" id="email-input" placeholder="Email..." autoComplete="email"/>
                            {errors.emailAddress && touched.emailAddress &&  <span className="invalid-feedback">{errors.emailAddress}</span>}

                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col md="3">
                            <Label htmlFor="password-input">Mật khẩu</Label>
                          </Col>
                          <Col xs="12" md="9">
                           

                            <Field className={`form-control ${errors.password && touched.password && 'is-invalid' }`} name="password" type="password" id="password-input" placeholder="Nhập mật khẩu..." autoComplete="new-password"/>
                            {errors.password && touched.password &&  <span className="invalid-feedback">{errors.password}</span>}


                          </Col>
                        </FormGroup>


                        <FormGroup row>
                          <Col md="3">
                            <Label>Trạng thái</Label>
                          </Col>
                          <Col md="9">
                            {/* <FormGroup check inline>
                              <Input className="form-check-input" type="radio" id="inline-radio1" name="inline-radios" value="option1" />
                              <Label className="form-check-label" check htmlFor="inline-radio1">Hoạt động</Label>
                            </FormGroup> */}
                            <FormGroup check inline>
                              <Input className="form-check-input" type="radio" id="inline-radio2" name="inline-radios" value="option2" />
                              <Label className="form-check-label" check htmlFor="inline-radio2">Khoá tài khoản</Label>
                            </FormGroup>

                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col md="3"><Label>Vai trò</Label></Col>
                          <Col md="9">
                            <FormGroup check className="checkbox">
                              <Input className="form-check-input" key="all" type="checkbox" onChange={this.handleAllChecked} value="checkedall" />
                              <Label check className="form-check-label" htmlFor={`checkboxall`}>Tất cả</Label>
                            </FormGroup>
                            {
                              _.map(this.state.roles, item => {

                                return <CheckBox key={item.id} handleCheckChieldElement={this.handleCheckChieldElement}  {...item} />

                              })
                            }
                          </Col>
                        </FormGroup>
                      </Form>


                    </Col>

                  </CardBody>
                  <CardFooter>
                  
                    <Button onClick={handleSubmit}
                           type="submit" size="sm" color="success"><i className="fa fa-dot-circle-o"></i> Lưu lại</Button>
                    <Button type="reset" size="sm" color="danger" 
                        onClick={handleReset}><i className="fa fa-ban"></i> Làm lại</Button>
                     <Button type="submit" size="sm" color="primary" 
                        onClick={this.onBack}><i className="fa fa-ban"></i> Quay lại</Button>
                  </CardFooter>
                </Card>
              )}
            </Formik>
          </Col>
        </Row>
      </div>
    )
  }
}

export default withAuth(UserAdd);
