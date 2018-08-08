//1-用bootstrap-validator插件验证表单的基本功能
$('#form').bootstrapValidator({

  //2. 指定校验时的图标显示，默认是bootstrap风格
  feedbackIcons: {
    valid: 'glyphicon glyphicon-ok',
    invalid: 'glyphicon glyphicon-remove',
    validating: 'glyphicon glyphicon-refresh'
  },

  //指定校验字段(跟表单的name属性相对应)
  fields : {
    username : {
      validators : {
        //不为空验证
        notEmpty : {
          message: '用户名不能为空'
        },
        //长度校验
        stringLength: {
          min: 2,
          max: 6,
          message: '用户名长度必须在2到6之间'
        },
        callback : {
          message : '用户名不能为空'
        }
      }
    },
    password : {
      validators : {
        //不为空验证
        notEmpty : {
          message: '密码错误'
        },
        //长度校验
        stringLength: {
          min: 6,
          max: 12,
          message: '用户名长度必须在6到12之间'
        },
        callback : {
          message : '密码错误'
        }
      }
    }
  }
});

//2-用此插件,当表单校验成功的时候,会自动提交,我们需要禁止提交,通过ajax提交
$('#form').on('success.form.bv',function(e){
  e.preventDefault();//阻止自动提交
  //通过ajax发送请求进行提交
  $.ajax({
    type : "post",
    url : "/employee/employeeLogin",
    data : $('#form').serialize(),
    dataType : "json",
    success : function(info){
      console.log(info);
      if(info.success){
        //表示登录成功,跳转到首页
        location.href = "index.html";
      }
      if(info.error === 1000){
        //用户名错误
        //通过实例化对象去调用插件的方法
        $('#form').data('bootstrapValidator').updateStatus('username','INVALID','callback');
      }
      if(info.error === 1001){
        //密码错误
        $('#form').data('bootstrapValidator').updateStatus('password','INVALID','callback');
      }
    }
  });
});

//3-解决重置功能的bug,不仅需要重置文本还需要重置状态
$('[type="reset"]').click(function(){
  $('#form').data('bootstrapValidator').resetForm();
});