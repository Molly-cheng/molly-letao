
  //6-判断用户是否登录,实现登录拦截
  //通过ajax发送请求,把前端获取到的用户名和密码,发送到后台核实
  //如果两者一致,则表示登陆过,反之没有登陆过,跳回登录页
  $.ajax({
    type : "get",
    url : "/employee/checkRootLogin",
    dataType : "json",
    success : function(info){
      console.log(info);
    }
  });

  //1-因为每个页面都有进度条功能,所以应该放在公共部分里面
  $(document).ajaxStart(function(){
    //开启进度条
    NProgress.start();
  });

  $(document).ajaxStop(function(){
    //关闭进度条
    setTimeout(function(){
      NProgress.done();
    },10000);
  });




  $(function(){

    //2-分类管理里面的二级菜单需要实现
    $('.lt-aside .category').click(function(){
      $('.lt-aside .child').stop().slideToggle();
    })
  
    //3-主体里面的菜单图标,点击隐藏侧边栏
    $('.icon-menu').click(function(){
      // alert('1');
      $('.lt-aside').toggleClass('hidemenu');
      $('.lt-main').toggleClass('hidemenu');
      $('.header').toggleClass('hidemenu');
    })
    //4-点击退出菜单,模态框出现
    $('.icon-logout').click(function(){
      // alert(1);
      $('#loginoutModal').modal();

    });
    //5-点击退出按钮,发送ajax请求,跳转到登录页
    $('#logoutBtn').click(function(){
      //退出登录,需要发送ajax请求, 让服务器端退出, 销毁该用户的登陆状态
      $.ajax({
        type : "get",
        url : "/employee/employeeLogout",
        success : function(info){
          console.log(info);
          if(info.success) {
            location.href = "login.html";
          }
        }
      });
    });
  });