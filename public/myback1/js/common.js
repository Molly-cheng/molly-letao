
//因为登录页本来就是用来登录的,所以不用验证拦截
if(location.href.indexOf('login.html') === -1){

  //6-需要做一个限制登录
  $.ajax({
    type : "get",
    url : "/employee/checkRootLogin",
    dataType : "json",
    success : function(info){
      if(info.success) {
        //成功说明之前登录过,正常登录
        console.log('登陆过');
      }
      if(info.error === 400){
        //未登录过,跳转到登录页
        location.href = "login.html";
      }
    }
  });
}


//1-每个页面都需要进度条,所以应该写在公共部分
//进度需要在开始发送ajax请求的时候就开启,在ajax最近一次请求返回的时候结束
//开始ajax的全局事件
$(document).ajaxStart(function() {
    //开启进度条
    NProgress.start();
});
$(document).ajaxStop(function() {
  setTimeout(function(){
    //关闭进度条
    NProgress.done();
  },500);
});

//2-侧边栏的分类管理下拉功能
$(function(){
  $('.category').click(function(){
    $('.child').stop().slideToggle();
  });
//3-点击右边主体头部菜单栏,会有滑动效果
  $('.icon-menu').click(function(){
    $('.lt-main').toggleClass('hidemenu');
    $('.lt-main .head').toggleClass('hidemenu');
    $('.lt-aside').toggleClass('hidemenu');
  })
//4-点击右边退出按钮,显示模态框
  $('.icon-logout').click(function(){
    $('#logoutModal').modal();
  });
//5-点击模态框里面的退出按钮
  $('.logoutBtn').click(function(){
    //需要通过ajax向后台发送请求,退出
    $.ajax({
      type : 'get',
      url : '/employee/employeeLogout',
      dataType : 'json',
      success : function(info){
        console.log(info);
        if(info.success){
          //退出成功,跳转到登录页
          location.href = "login.html"
        }
      }
    });
  })
});
