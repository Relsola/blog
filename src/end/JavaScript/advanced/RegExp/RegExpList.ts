export default {
  tableColumn: Object.freeze([
    { label: '正则表达式', prop: 'regexp', minWidth: '200', align: 'center' },
    { label: '描述', prop: 'description', minWidth: '150', align: 'center' },
    { label: '示例', prop: 'example', minWidth: '120', align: 'center' }
  ]),
  static: Object.freeze({
    RS_DF: '<span style="color: #a8abb2"> 测试结果 </span>'
  }),
  RegExpDate: Object.freeze([
    {
      regexp: /[\u4e00-\u9fa5]/.toString(),
      description: '中文字符',
      example: '汉字'
    },
    {
      regexp:
        /^(?:(?:\+|00)86)?1(?:(?:3\d)|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8\d)|(?:9[189]))\d{8}$/.toString(),
      description: '中国大陆电话号码',
      example: '+8617888829981'
    },
    {
      regexp: /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.toString(),
      description: '24小时制时间',
      example: '23:34:55'
    },
    {
      regexp: /^(?:1[0-2]|0?[1-9]):[0-5]\d:[0-5]\d$/.toString(),
      description: '12小时制时间',
      example: '11:34:55'
    },
    {
      regexp: /^\d{1,4}([-\.\/])(1[0-2]|0?[1-9])\1(0?[1-9]|[1-2]\d|30|31)$/.toString(),
      description: '日期',
      example: '2023-12-12'
    },
    {
      regexp: /(.)\1+/.toString(),
      description: '匹配连续重复的字符',
      example: '12234'
    },
    {
      regexp: /^[a-zA-Z][-\w]{5,19}$/.toString(),
      description: '微信号(wx),6至20位,以字母开头,字母,数字,减号,下划线',
      example: 'Relsola'
    },
    {
      regexp:
        /^(0[1-7]|1[0-356]|2[0-7]|3[0-6]|4[0-7]|5[1-7]|6[1-7]|7[0-5]|8[013-6])\d{4}$/.toString(),
      description: '中国邮政编码',
      example: '100101'
    },
    {
      regexp: /^[GCDZTSPKXLY1-9]\d{1,4}$/.toString(),
      description: '火车车次',
      example: 'G1868'
    }
  ])
};
