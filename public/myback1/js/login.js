//1-利用bootstrap-validator 插件做基础的表单验证
$('#form').bootstrapValidator({

  //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
  // excluded: [':disabled', ':hidden', ':not(:visible)'],

  //2. 指定校验时的图标显示，默认是bootstrap风格
  feedbackIcons: {
    valid: 'glyphicon glyphicon-ok',
    invalid: 'glyphicon glyphicon-remove',
    validating: 'glyphicon glyphicon-refresh'
  },

  //3. 指定校验字段
  fields: {
    //校验用户名，对应name表单的name属性
    username: {
      validators: {
        //不能为空
        notEmpty: {
          message: '用户名不能为空'
        },
        //长度校验
        stringLength: {
          min: 2,
          max: 6,
          message: '用户名长度必须在2到6之间'
        },
        callback : {
          message : "用户名不能为空"
        }
      
      }
    },
    password : {
     validators : {
        //不能为空
      notEmpty: {
        message: '密码不能为空'
      },
      //长度校验
      stringLength: {
        min: 6,
        max: 12,
        message: '密码长度必须在6到12之间'
      },
      callback : {
        message : '密码错误'
      }
     }
    }
  }
});

//2-当通过bootstrap-validator 插件通过基础的表单验证成功之后,会提交表单
//此时我们需要禁止表单的自动提交,使用ajax进行表单的提交
$('#form').on('success.form.bv',function(e){
  //禁止插件提供的表单自动提交
  e.preventDefault();
  //通过ajax进行表单提交
  $.ajax({
    type : "post",
    url : "/employee/employeeLogin",
    data : $('#form').serialize(),
    dataType : "json",
    success : function(info){
      console.log(info);
      if(info.success) {
        //跳到首页
        location.href = "index.html";
      }
      if(info.error === 1000){
        // console.log('用户名错误');
        //表单下面显示用户名错误字样
        //用validator的实例对象去调用方法修改更新自动的状态
        $('#form').data('bootstrapValidator').updateStatus('username','INVALID','callback');
      }
      if(info.error === 1001){
        // console.log('密码错误');
        $('#form').data('bootstrapValidator').updateStatus('password','INVALID','callback');
      }
    }
  });
});

//3-重置按钮的bug需要解决一下(只能重置输入框里面的文本内容,但是后面的状态无法重置,这个问题需要解决)
$('[type="reset"]').click(function(){
  $('#form').data('bootstrapValidator').resetForm();//重置表单并且会隐藏所有的错误提示和图标
});
