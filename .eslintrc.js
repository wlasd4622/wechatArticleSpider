module.exports = {
    root: true,
    globals: {
        $: true
    },
    parserOptions: {
        parser: 'babel-eslint'
    },
    env: {
        browser: true,
    },
    extends: [
        'standard'
    ],
    rules: {
        //不能有未定义的变量
        "no-undef": 0,
        //生成器函数*的前后空格
        // 'generator-star-spacing': 'off',
        //禁止使用debugger
        // 'no-debugger': 'error',
        //不能有声明后未被使用的变量或参数
        "no-unused-vars": 0,
        //强制驼峰法命名
        "camelcase": 0,
        //禁止不必要的call和apply
        "no-useless-call": 0,
        //禁止使用eval
        "no-eval": 0,
        //注释风格要不要有空格什么的
        // 'spaced-comment':0,
        //禁止在使用new构造一个实例后不赋值
        "no-new": 0,
        //不能有无法执行的代码
        "no-unreachable": 0,
        //禁止扩展native对象
        "no-extend-native": 0,
        //禁止在条件表达式中使用赋值语句
        "no-cond-assign": 0,

        "indent": ['error', 4],
        "one-var": 0,
        "handle-callback-err": 0,
        "no-unused-expressions": 0,
        "no-use-before-define": 0,
        "space-before-function-paren": 0,
        "semi":0,
        "eqeqeq":0
    }
};