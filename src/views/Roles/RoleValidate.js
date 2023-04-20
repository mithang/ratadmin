
 import * as Yup from 'yup';
 const roleSchema = Yup.object().shape({
    name: Yup.string()
      .required('Tên vai trò không để trống'),
    displayName: Yup.string()
      .required('Tên vai trò không để trống'),
      
  });

  export default roleSchema;