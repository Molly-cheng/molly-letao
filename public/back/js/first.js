

$(function(){
  var currentPage = 1;//当前页
  var pageSize = 5;//一页代表多少条数据

  //1-发送ajax请求,渲染页面
  render();
  function render(){
    $.ajax({
      type : "get",
      url : "/category/queryTopCategoryPaging",
      data :{
        page :currentPage,
        pageSize : pageSize
      } ,
      dataType : "json",
      success : function(info){
        // console.log(info);
        //将模板和数据相结合
        var str = template('firstTmp',info);
        //渲染到页面上
        $('tbody').html(str);


        //发送ajax请求,不仅要渲染当前页面,也要返回分页数据,形成分页按钮
        //先引入分页插件
        //html页面中准备一个容器
        //初始化分页插件
        $('#paginator').bootstrapPaginator({
          //指定bootstrap使用的版本
          bootstrapMajorVersion:3,
          //指定当前页
          currentPage : info.page,
          //指定总页数
          totalPages:Math.ceil(info.total/info.size),
          //给页码注册点击事件
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

  //2-点击添加分类按钮,模态框出现
  $('.cateBtn').click(function(){
    //模态框出现
    $('#addModal').modal("show");
    // 给模态框里面的输入框用bootstarp-validator做简单的表单校验
    $('#form').bootstrapValidator({
      //需要有状态提示
      //小图标
      feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
      },
      //只需要做个非空校验(需要对应input的name属性的name值)
      fields : {
        categoryName : {
          validators : {
            notEmpty : {
              message : "请输入一级分类"
            }
          }
        }
      }
    });
    //在表单校验成功之后会自动提交表单,我们要阻止这么默认行为,然后通过ajax发送请求
    $('#form').on('success.form.bv',function(e){
      e.preventDefault();//阻止默认提交
      //通过ajax发送请求
      $.ajax({
        type : "post",
        url : "/category/addTopCategory",
        data :$('#form').serialize(),
        dataType : "json",
        success : function(info){
          // console.log(info);

          //如果发送成功的话就重新渲染
          if(info.success){
            // 模态框消失
            $('#addModal').modal("hide");
            //添加的话要让用户能看到自己添加的,需要每次渲染都渲染第一页
            currentPage = 1;
            render();
          }
        }
      });

    });
  });
});