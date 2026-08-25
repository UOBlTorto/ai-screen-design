import Mock from 'mockjs'
Mock.mock('/api/data','get',()=>{
    const data = Mock.mock({
            'list|10':[
                {
                    'label|+1':['一月','二月','三月','四月','五月','六月'],
                    'value|100-1000':0
                }
            ]
        })
    return data.list
})