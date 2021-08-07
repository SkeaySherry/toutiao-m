// 封装本地存储模块

// 存储数据
export const setItem = (key, value) => {
  // 判断要存储的数据是否是对象
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  localStorage.setItem(key, value)
}

// 获取数据
export const getItem = key => {
  const data = localStorage.getItem(key)
  // 判断获取到的数据是否是合法的 JSON 字符串
  try {
    return JSON.parse(data)
  } catch (e) {
    // 如果 json 解析错误，直接被 catch 捕获到这里，不会影响后面的逻辑
    return data
  }
}

// 删除数据
export const removeItem = key => {
  localStorage.removeItem(key)
}
