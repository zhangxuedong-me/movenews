// 本地存储的方法

// 设置本地存储
export const setItem = (key, value) => {
  /*
     判断本地存储的值是否是对象，如果是对象的话，就把对象转成字符串
     因为如果不把对象转成字符串存储的话，就把把对象存储成[object objrct]，是
     无法获取对象里面的数据的，如果不是对象的话直接存储
  */
  if ((typeof value) === 'object') {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(key, value)
}
// 本地获取
export const getItem = (key) => {
  const userValue = window.localStorage.getItem(key)
  try {
    // 如果转成功的话说明是json对象，否则就会进入catch，说明不是对象不需要转换
    // 直接获取
    return JSON.parse(userValue)
  } catch (err) {
    return userValue
  }
}
// 本地删除
export const removeItem = (key) => {
  window.localStorage.removeItem(key)
}
