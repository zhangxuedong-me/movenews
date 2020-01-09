import Vue from 'vue'

// 加载需要使用的验证组件
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate'

// 加载内置的验证规则
import * as rules from 'vee-validate/dist/rules'

// 加载中文语言包
// 官方文档：
// https://logaretm.github.io/vee-validate/guide/rules.html#importing-the-rules
import { messages } from 'vee-validate/dist/locale/zh_CN.json'

// 注册全局组件
Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)

// 配置验证规则和中文提示消息
Object.keys(rules).forEach(rule => {
  extend(rule, {
    ...rules[rule],
    message: messages[rule]
  })
})
/*
    自定义效验规则，验证规则是全局的
    第一个参数是自定义验证规则的名字，第二个参数是一个对象，第一个属性validate
    的值是一个函数返回验证为true的表达式，如果不为true的话就会返回message的内容
*/

extend('mobile', {
  validate: value => {
    return /^1(3|5|6|7|8|9)\d{9}$/.test(value)
  },
  // {_field_}表示在ValidationProvider上面定义的name属性的值，要验证的字段值
  message: '{_field_}格式有误'
})

// 验证码的验证规则
extend('code', {
  validate: value => {
    return /^\d{6}$/.test(value)
  },
  message: '{_field_}格式有误'
})

extend('odd', {
  validate: (value, args) => {
    return value === '18532620986'
  },

  // 如果用params接收参数的话，就是对象格式的，如果只是函数传参的话就是数组格式的
  // 并且每次输入内容都会执行message中的函数
  params: ['args'],
  message (fieldName, obj) {
    console.log(fieldName, obj)
    return fieldName
  }
})
