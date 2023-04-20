import React, { Component } from 'react';
import { Card, CardBody, Badge, CardHeader, Col, Row, CardFooter, Button, FormGroup, Label, Input, FormText } from 'reactstrap';
import withAuth from '../../hoc/withAuth';
import _ from "lodash";
import { UrlLink, TokenData } from '../../constanst';
import Axios from "../../config";
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'
import { Formik, Form, Field } from 'formik';
import roleSchema from "./RoleValidate";
import {
  withRouter
} from 'react-router-dom';


const CheckBox = props => {
  return (

    <FormGroup check className="checkbox" key={props.name}>
      <Input className="form-check-input" key={props.name} onChange={props.handleCheckChieldElement} type="checkbox" checked={props.isChecked} value={props.name} />
      <Label check className="form-check-label" htmlFor={`checkbox${props.name}`}>{props.name}</Label>
    </FormGroup>


  )
}

class RoleAdd extends Component {

  constructor(props) {
    super(props);
    this.state = {
      permissions: [],
    }
  }

  async componentDidMount() {
    try {
      var result = JSON.parse(localStorage.getItem(TokenData))

      if (result == null || !result.accessToken) {
        return;
      }
      const token = result.accessToken
      
      const responserole = await Axios.getInstance(token).get(`/api/services/app/Role/GetAllPermissions`)

      if ( responserole.data.success) {
        var items = responserole.data.result.items.map((member) => {
          return {
            ...member,
            isChecked: false
          }
        });
        this.setState({
          permissions: items
        });
      }
    } catch (error) {

      console.log(error);
    }
  }


  handleAllChecked = (event) => {
    let permissions = this.state.permissions
    permissions.forEach(fruite => fruite.isChecked = event.target.checked)
    this.setState({ permissions: permissions })
  }

  handleCheckChieldElement = (event) => {
    let permissions = this.state.permissions

    permissions.forEach(fruite => {
      if (_.toLower(fruite.name) === _.toLower(event.target.value))
        fruite.isChecked = event.target.checked
    })
    this.setState({ fruites: permissions }, () => {
      console.log(this.state.permissions);
    })
  }

  async onSave(values) {

    let permissions = [];
    _.map(this.state.permissions, item => {
      if (item.isChecked === true) {
        permissions.push(item.name)
      }
    });

    try {
      var result = JSON.parse(localStorage.getItem(TokenData))

      if (result == null || !result.accessToken) {
        return;
      }
      const token = result.accessToken

      const {displayName,name} = values

      const response = await Axios.getInstance(token).post(`/api/services/app/role/Create`, {

        displayName: displayName,
        name: name,
        description:"",
        grantedPermissions:permissions

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
        //   role: response.data.result
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

    if (this.state.role === null || this.state.role === {}) return;
    return (
      <div className="animated fadeIn">

        <Row>

          <Col lg={12}>
            <Formik
              initialValues={{
                name: "",
                displayName: "",
              }}
              validationSchema={roleSchema}
              onSubmit={(values,{setSubmitting, setErrors, setStatus, resetForm}) => {
                //Khi tất các valid thì nó sẽ chạy vào submit
                this.onSave(values);
                resetForm();
              }}
              onReset={values=>{
                  console.log(values);
              }}
            >
              {({ errors, touched,handleReset, isValidating,handleSubmit}) => (
                <Card>

                  <CardHeader>
                    <strong><i className="icon-info pr-1"></i>Thông tin vai trò</strong>
                  </CardHeader>
                  <CardBody>

                    <Col lg={6}>

                      <Form className="form-horizontal">

                        
                        <FormGroup row>
                          <Col md="3">
                            <Label htmlFor="text-input">Tên vai trò</Label>
                          </Col>
                          <Col xs="12" md="9">
                           
                            <Field className={`form-control ${errors.name && touched.name && 'is-invalid' }`} name="name" type="text" placeholder="Nhập tên họ tài khoản..." />
                            {errors.name && touched.name &&  <span className="invalid-feedback">{errors.name}</span>}

                          </Col>
                        </FormGroup>

                        <FormGroup row>
                          <Col md="3">
                            <Label htmlFor="text-input">Tên vai trò (viết tắc)</Label>
                          </Col>
                          <Col xs="12" md="9">
                            <Field className={`form-control ${errors.displayName && touched.displayName && 'is-invalid' }`} name="displayName" type="text"   placeholder="Nhập tên tài khoản..."/>
                            {errors.displayName && touched.displayName &&  <span className="invalid-feedback">{errors.displayName}</span>}
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
                              _.map(this.state.permissions, item => {

                                return <CheckBox key={item.name} handleCheckChieldElement={this.handleCheckChieldElement}  {...item} />

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

export default  withRouter(withAuth(RoleAdd));
