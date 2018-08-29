#!/usr/bin/env node

/**
 * Module dependencies.
 */

var program = require('commander')
var http = require('http')
var querystring = require('querystring')
var md5 = require('md5')

program
  .version('1.0.0')
  .description('🍻  欢迎使用 翻译小助手 🍻')
  .option('-e, --en', 'Add English word')
  .option('-z, --zh', 'Add Chinese word')
  .parse(process.argv)

console.log('=== 🍻  欢迎使用 翻译小助手 🍻  ===')

if (program.en || program.zh) {
  var timestamp = new Date().getTime()
  var appid = 20180829000200308
  var key = '3nF5vOV_THfna0CgGZo6'
  var sign = md5(appid + program.args[0] + timestamp + key)
  var params = {
    'q': program.args[0],
    'from': program.en ? 'en' : 'zh',
    'to': program.en ? 'zh' : 'en',
    'appid': appid,
    'salt': timestamp,
    'sign': sign
  }
  var content = querystring.stringify(params)
  var options = {
    hostname: 'api.fanyi.baidu.com',
    port: 80,
    path: '/api/trans/vip/translate?' + content,
    method: 'GET'
  }
  var req = http.request(options, function (res) {
    res.setEncoding('utf8')
    res.on('data', function (data) {
      console.log(program.args[0] + ' 的翻译结果为：')
      console.log(JSON.parse(data).trans_result[0].dst)
      console.log('=== 🍻  翻译成功 🍻  ===')
    })
  })

  req.on('error', function (e) {
    console.log('problem with request: ' + e.message)
  })

  req.end()
}
