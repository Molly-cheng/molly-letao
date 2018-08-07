$(function(){

  //使用bootstrap-validator插件
  //校验规则：
  // 1. 用户名不能为空
  // 2. 用户密码不能为空
  // 3. 用户密码长度为6-12位
  //1-用bootstrap-validator插件做表单的基础验证
  $('#form').bootstrapValidator({
    //设置小图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    //设置校验规则
    fields: {
      username: {
        //校验规则
        validators: {
          //非空校验
          notEmpty: {
            //配置提示信息
            message: "用户名不能为空",
            
          },
          //长度校验
          stringLength: {
            min:2,
            max:6,
            message:"用户名长度必须是2-6位"
          },
          callback : {
            message : "用户名不能为空"
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
          },
          callback : {
            message : "密码错误"
          }
        }
      }
    }
  });

  //2.实现登录功能
  //submit按钮 默认点击时会提交表单,插件会在表单提交之后进行验证
  //(1)如果校验成功页面会跳转,我们需要阻止这次跳转,通过ajax发送请求
  $('#form').on("success.form.bv",function(e){
    //阻止默认跳转,需要用ajax发送请求
    e.preventDefault();

    //用ajax发送请求
    $.ajax({
      type: "post",
      url: "/employee/employeeLogin",
      data : $('#form').serialize(),
      dataType:'json',
      success:function(info){
        console.log(info);
        //如果用户名和密码都输入正确,跳转到首页
        if(info.success){
          location.href = "index.html";
        }
        //如果用户名不对
        if(info.error === 1000){
          // alert('用户名不存在');
          // 这种弹框的方式用户体验不好,所以需要用到插件的方法
          //updateStatus
          //先要获取表单校验实例,通过实例去调用方法
          //updateStatus(field*, status*, validator)
          //INVALID失败的 or VALID成功的 NOT_VALIDATED未验证
          var validator = $('#form').data('bootstrapValidator');
          validator.updateStatus("username","INVALID","callback");
        }
        if(info.error === 1001) {
          // alert('密码错误');
          var validator = $('#form').data('bootstrapValidator');
          validator.updateStatus("password","INVALID","callback");
        }
      }
    });

  });

  //重置功能
  $('[type="reset"]').click(function(){
    //表单重置
    $('#form').data('bootstrapValidator').resetForm();
  })
});