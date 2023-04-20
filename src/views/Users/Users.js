import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Badge,Dropdown,DropdownToggle,DropdownMenu,DropdownItem, Card, CardBody, CardHeader, Col, FormGroup, InputGroupAddon, InputGroup, Row, Button, Table, Input } from 'reactstrap';
import { UrlLink, TokenData } from '../../constanst';
import Axios from "../../config";
import withAuth from '../../hoc/withAuth';
import _ from "lodash";
import Pager from 'react-pager';

import {
  Menu,
  MenuList,
  MenuButton,
  MenuItem,
  MenuLink,
} from "@reach/menu-button"
import "@reach/menu-button/styles.css";

function UserRow(props) {
  const user = props.user
  const userLink = `/users`
  const getBadge = (status) => {
    return status === true ? 'Hoạt động' : 'Đã khoá';
  }
  
  return (
    <tr key={user.id}>
      <th scope="row"><Link to={userLink}>{user.id}</Link></th>
      <td><Link to={userLink}>{user.fullName}</Link></td>
      <td>{user.emailAddress}</td>
      <td><Link to={userLink}>{getBadge(user.isActive)}</Link></td>
      <td>
      <Menu>
        <MenuButton className="btn btn-primary">
          Xem {/* <span aria-hidden>▾</span> */}
        </MenuButton>
        <MenuList>
        
          <MenuItem onSelect={() => props.history.push(`${userLink}/detail/${user.id}`)}>
           Chi tiết
          </MenuItem>
          <MenuItem onSelect={() => props.history.push(`${userLink}/edit/${user.id}`)}>Chỉnh sửa</MenuItem>
          <MenuItem onSelect={() => alert("Mark as Draft")}>Phân quyền</MenuItem>
          <MenuItem onSelect={() => alert("Delete")}>Xoá</MenuItem>
          {/* <MenuLink as="a" href="https://reach.tech/workshops">Attend a Workshop</MenuLink> */}
        </MenuList>
      </Menu>
      </td>
    </tr>
  )
}

class Users extends Component {

  constructor(props) {
    super(props);
    this.state = {
      users: [],
      total: 0,
      current: 0,
      visiblePage: 2,
      searchtext:"",
      isloading: false,
      dropdownOpen: false
    }
    this.toggle = this.toggle.bind(this);
    this.handlePageChanged = this.handlePageChanged.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onCreateUser = this.onCreateUser.bind(this);
  }
  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  async getUserAsync() {
    try {
      var result = JSON.parse(localStorage.getItem(TokenData))

      if (result == null || !result.accessToken) {
        return;
      }
      const token = result.accessToken
      
      const MaxResultCount = 10;
      const SkipCount = this.state.current*MaxResultCount;
      const response = await Axios.getInstance(token).get(`/api/services/app/User/GetAll?SkipCount=${SkipCount}&MaxResultCount=${MaxResultCount}&Keyword=${this.state.searchtext}`)
      
      if (response.data.success) {
        this.setState({
          users: response.data.result.items,
          total: response.data.result.totalCount,
          isloading:false
        });
      }
    } catch (error) {
      this.setState({
        isloading:false
      });
    }
  }

  handlePageChanged(newPage) {
    this.setState({
      isloading: true
    });
    this.setState({ current: newPage }, () => {
      this.getUserAsync();
    });
  }

  onSearch() {
    this.setState({
      isloading: true
    });
    this.getUserAsync();
  }


  loading = () => <div className="animated fadeIn pt-1 text-center">Đang xử lý...</div>
  onCreateUser = ()=>{
    this.props.history.push("/users/create/id");
  }

  componentDidMount() {
    this.setState({
      isloading: true
    });
    this.getUserAsync();
  }


  render() {
    
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={6}>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Danh sách người dùng <small className="text-muted"></small>
              </CardHeader>
              <CardBody>

              <FormGroup row>
                  <Col md="12">
                    <Button className="btn btn-danger" onClick={this.onCreateUser}>Thêm tài khoản</Button>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col md="12">

                    <InputGroup>
                      <Input onChange={(text)=>this.setState({
                        searchtext:text.target.value
                      })} value={this.state.searchtext} type="email" id="input2-group2" name="input2-group2" placeholder="Tìm kiếm người dùng..." />
                      <InputGroupAddon addonType="append">
                        <Button onClick={this.onSearch} type="button" color="primary">Tìm kiếm</Button>
                      </InputGroupAddon>
                    </InputGroup>
                  </Col>
                </FormGroup>
                {
                  !this.state.isloading ?
                      <Table responsive hover>
                        <thead>
                          <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Họ và Tên</th>
                            <th scope="col">Email</th>
                            <th scope="col">Trạng thái</th>
                            <th>#</th>
                          </tr>
                        </thead>
                        <tbody>
                        {
                          this.state.users.length<=0?(<tr colSpan={3}><td>Không có dữ liệu</td></tr>):""
                        }  
                        {
                          _.map(this.state.users, (user, index) =>
                            <UserRow toggle={this.toggle} key={index} user={user} dropdownOpen={this.state.dropdownOpen} history={this.props.history}/>
                          )
                        }
                        </tbody>
                      </Table>
                    :this.loading()
                }
                <Pager
                  total={this.state.total}
                  current={this.state.current}
                  visiblePages={this.state.visiblePage}
                  titles={{ first: 'Trang đầu', last: 'Trang cuối' }}
                  className="pagination-md pull-right pager"
                  onPageChanged={this.handlePageChanged}
                />
              </CardBody>

            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default withAuth(Users);
