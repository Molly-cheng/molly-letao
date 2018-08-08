/**
 * Created by Jepson on 2018/8/7.
 */

// 5. 判断用户是否登陆, 实现登陆拦截
//    前端不知道当前用户是否登录, 但是后台知道, 需要访问后台接口, 获取该用户登陆状态
//    (1) 用户已登陆, 让其继续访问
//    (2) 如果用户没登陆, 拦截到登陆页

// 一进入页面, 发送 ajax 请求, 获取当前用户登陆状态
// 如果是登陆页, 不需要登陆, 就可以访问, 不需要判断登陆状态

if ( location.href.indexOf("login.html") === -1 ) {
  // 不是 login.html, 进行登陆拦截判断
  $.ajax({
    type: "get",
    url: "/employee/checkRootLogin",
    dataType: "json",
    success: function( info ) {
      console.log( info )
      if ( info.success ) {
        console.log( "已登陆" );
      }

      if ( info.error === 400 ) {
        // 未登录, 拦截到登陆页
        location.href = "login.html";
      }
    }
  })
}









// 实现进度条功能测试
//// 开启进度条
//NProgress.start();
//
//setTimeout(function() {
//  // 关闭进度条
//  NProgress.done();
//}, 1000)


// ajax全局事件
// 1. ajaxComplete() 每个ajax请求完成时调用 (不管成功还是失败都会调用)
// 2. ajaxError()   每个ajax失败时调用
// 3. ajaxSend()    每个ajax发送前调用
// 4. ajaxStart()   第一个ajax请求被发送时调用
// 5. ajaxStop()    全部的ajax请求完成时调用
// 6. ajaxSuccess() 每个ajax成功时调用

// 在发送第一个ajax请求时, ajaxStart,  开启进度条,
$(document).ajaxStart(function() {
  // 开启进度条
  NProgress.start();
})

// 在最后一个ajax请求回来时, 关闭进度条
$(document).ajaxStop(function() {

  // 模拟网络延迟
  setTimeout(function() {
    // 关闭进度条
    NProgress.done();
  }, 500);

});



$(function() {

  // 公共的功能实现
  // 1. 左侧二级菜单切换
  $('.lt_aside .category').click(function() {
    $('.lt_aside .child').stop().slideToggle();
  })


  // 2. 点击切换侧边栏
  $('.icon_menu').click(function() {
    $('.lt_aside').toggleClass("hidemenu");
    $('.lt_topbar').toggleClass("hidemenu");
    $('.lt_main').toggleClass("hidemenu");
  })


  // 3. 点击退出菜单, 显示退出模态框
  $('.icon_logout').click(function() {
    // 显示模态框
    $('#logoutModal').modal("show");
  });

  // 4. 点击退出按钮, 实现用户退出
  $('#logoutBtn').click(function() {
    // 退出需要发送ajax请求, 让服务器端退出, 销毁该用户的登陆状态
    $.ajax({
      type: "get",
      url: "/employee/employeeLogout",
      dataType: "json",
      success: function( info ) {
        if ( info.success ) {
          // 退出成功, 跳转到登陆页
          location.href = "login.html";
        }
      }
    })
  })


})


