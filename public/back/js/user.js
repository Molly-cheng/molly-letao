

$(function(){
  var currentPage = 1;//当前页
  var pageSize = 5;//每页多少条数据
  var currentId;//记录当前点击的id
  var isDelete;//记录状态

  render();
  //1-渲染页面的用函数,后面会反复用到
  function render(){
    //通过ajax向后台发送请求,渲染表格
    $.ajax({
      type: "get",
      url : "/user/queryUser",
      data : {
        page : currentPage,
        pageSize :pageSize
      },
      dataType : "json",
      success : function(info){
        console.log(info);
        //将数据和模板结合
        var str = template('tmp',info);
        //渲染
        $('tbody').html(str);

        //2-分页初始化
        $('#paginator').bootstrapPaginator({
          //配置bootstrapPaginator的版本
          bootstrapMajorVersion:3,//指定bootstrap的版本，如果是3，必须指定
          currentPage : currentPage,//指定当前页
          totalPages : Math.ceil(info.total / pageSize),//指定总页数
          onPageClicked:function (a,b,c, page) {
            //page指的是点击的页码,修改了当前页
            currentPage = page;
            //重新渲染
            render();
          }
        });
      }
    });
  }

  //3-点击禁用和启用的按钮,发送给后台,让后台更新数据库数据,返回给前端渲染
  $('tbody').on('click','.btn',function(){
    //因为这两个按钮都是动态渲染的所以需要用事件委托来注册
    //点击模态框出现
    $('#userModal').modal("show");
    currentId = $(this).parent().data('id');
    // 1 表示 已启用, 0 表示 已禁用, 传给后台 几, 后台就设置该用户状态为 几
    isDelete = $(this).hasClass('btn-danger') ? 0 : 1;
    
  });

  //4-需要点击模态框里面的按钮,才发送ajax请求,让后台修改,再返回前端渲染
  $('#submitBtn').click(function(){
    //发送ajax请求
    $.ajax({
      type : "post",
      url : "/user/updateUser",
      data : {
        id : currentId,
        isDelete : isDelete
      },
      dataType : "json",
      success : function(info){
        console.log(info);
        // 模态框消失
        $('#userModal').modal('hide');
        //重新渲染
        render();
      }
    });
  })

  
  

});