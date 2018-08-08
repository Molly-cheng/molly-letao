

//6-需要给除了登录页外的每个页面实现登录拦截
if(location.href.indexOf('login.html') === -1){
  $.ajax({
    type : "get",
    url : "/employee/checkRootLogin",
    dataType : "json",
    success : function(info){
      console.log(info);
      if(info.success){
        console.log('正常输入密码登录')
      }
      if(info.error === 400) {
        //未登录过,拦截在登录页
        location.href = "login.html"
      }
    }
  })
}





//1-因为每个页面都需要进度条,所以进度条应该写在公共页面里面
$(document).ajaxStart(function(){
  //开启进度条
  NProgress.start();
});
$(document).ajaxStop(function(){
  //关闭进度条
  setTimeout(function(){
    NProgress.done();
  },500);
});

$(function(){
  //2-分类管理的下拉列表
  $('.category').click(function(){
    $('.child').stop().slideToggle();
  });

  //3-右边头部的菜单按钮
  $('.icon-menu').click(function(){
    $('.lt-aside').toggleClass('hidemenu');
    $('.lt-main .head').toggleClass('hidemenu');
    $('.lt-main').toggleClass('hidemenu');
  });

  //4-点击退出按钮,模态框出现
  $('.icon-logout').click(function(){
    $('#logoutModal').modal();
  });

  //5-点击模态框里的退出按钮,通过ajax向后台发送请求,退出
  $('.logoutBtn').click(function(){
    $.ajax({
      type : "get",
      url : "/employee/employeeLogout",
      dataType : "json",
      success : function(info){
        console.log(info);
        if(info.success){
          //退出成功,跳到登录页
          location.href = "login.html";
        }
        if(info.error){
          console.log('退出失败');
        }
      }
    });
  });
});
