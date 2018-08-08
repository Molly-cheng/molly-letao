$(function(){

  //使用bootstrap-validator插件
  //校验规则：
  // 1. 用户名不能为空
  // 2. 用户密码不能为空
  // 3. 用户密码长度为6-12位
  $('#form').bootstrapValidator({
    //设置校验规则
    fields: {
      username: {
        //校验规则
        validators: {
          //非空校验
          notEmpty: {
            //配置提示信息
            message: "用户名不能为空"
          },
          //长度校验
          stringLength: {
            min:2,
            max:6,
            message:"用户名长度必须是2-6位"
          }
        }
      },
      password: {
        validators: {
          //非空校验
          notEmpty: {
            message :"密码不能为空"
          },
          //长度校验
          stringLength: {
            min:6,
            max:12,
            message: "密码长度必须是6-12位"
          }
        }
      }
    }
  });


});