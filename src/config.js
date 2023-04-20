import axios from "axios";
import _ from 'lodash';
import { UrlLink } from './constanst';
// const UrlLink="http://rat.medigroup.com.vn"
// const UrlLink="http://192.168.1.135:5353"

var instance = axios.create({
	baseURL: UrlLink,
	// headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
	// headers:{'Access-Control-Allow-Origin':'*'}
});

// //instance.defaults.baseURL = UrlPublish;
// instance.defaults.timeout = 10000;
// //axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// //axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// export default instance;

class AxiosBase {

	getInstance(token = "", timeout = 10000) {

		if (!_.isEmpty(token)) {//eslint-disable-line
			instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
		}
		
		//instance.defaults.baseURL = UrlPublish;
		instance.defaults.timeout = timeout;
		//axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
		//axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
		return instance;
	}
}

export default new AxiosBase();
