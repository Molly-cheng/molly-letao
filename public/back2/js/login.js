/**
 * Created by Jepson on 2018/8/7.
 */


$(function() {

  /*
   * 1. 进行表单校验配置
   *    校验要求:
   *        (1) 用户名不能为空, 长度为2-6位
   *        (2) 密码不能为空, 长度为6-12位
   * */

  // 检验插件初始化
  $('#form').bootstrapValidator({

    // 配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-heart',     // 校验成功
      invalid: 'glyphicon glyphicon-remove',  // 校验失败
      validating: 'glyphicon glyphicon-refresh'  // 校验中
    },


    // 配置字段 (不要忘记给input加name)
    fields: {
      username: {
        // 校验规则
        validators: {
          // 非空校验
          notEmpty: {
            // 配置提示信息
            message: "用户名不能为空"
          },
          // 长度校验
          stringLength: {
            min: 2,
            max: 6,
            message: "用户名长度必须是2-6位"
          }
        }
      },
      password: {
        validators: {
          // 非空校验
          notEmpty: {
            message: "密码不能为空"
          },
          // 长度校验
          stringLength: {
            min: 6,
            max: 12,
            message: "密码长度必须是6-12位"
          }
        }
      }
    }
  });




});
