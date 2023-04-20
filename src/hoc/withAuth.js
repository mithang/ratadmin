import React, { Component, lazy, Suspense } from 'react';
import { UrlLink, TokenData } from '../constanst';

const withAuth = WrappedComponent => {
    return class ProtectedRoutes extends Component {
   
      componentWillMount() {
        var result = JSON.parse(localStorage.getItem(TokenData))
        
        if(result==null || !result.accessToken){
            this.props.history.push('/login');
        }
        // if (!this.props.authenticated) {
        //   this.props.history.push('/login');
        // }
      }
   
      render() {
   
        return (
          <div>
            <WrappedComponent {...this.props} />
          </div>
        )
      }
    }
  }
   
  export default withAuth;