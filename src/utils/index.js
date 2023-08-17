import { localCache, sessionCache } from './myCache';

export { localCache, sessionCache };

// 校验数据类型
export const typeOf = function (obj) {
  return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
};

//  防抖
export const debounce = (() => {
  let timer = null;
  return (callback, wait = 800) => {
    timer && clearTimeout(timer);
    timer = setTimeout(callback, wait);
  };
})();

// example for vue
// methods: {
//   loadList() {
//     debounce(() => {
//       console.log('加载数据')
//     }, 500)
//   }
// }

// 节流
export const throttle = (() => {
  let last = 0;
  return (callback, wait = 800) => {
    let now = +new Date();
    if (now - last > wait) {
      callback();
      last = now;
    }
  };
})();

// 手机号脱敏
export const hideMobile = (mobile) => {
  return mobile.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2');
};

// 开启全屏
export const launchFullscreen = (element) => {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullScreen();
  }
};

// 关闭全屏
export const exitFullscreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
};

/**
 * 大小写转换
 * @param {*} str
 * @param {*} type 1-全大写 2-全小写 3-首字母大写
 * @returns
 */
export const turnCase = (str, type) => {
  switch (type) {
    case 1:
      return str.toUpperCase();
    case 2:
      return str.toLowerCase();
    case 3:
      //return str[0].toUpperCase() + str.substr(1).toLowerCase() // substr 已不推荐使用
      return str[0].toUpperCase() + str.substring(1).toLowerCase();
    default:
      return str;
  }
};

// 解析URL参数
export const getSearchParams = () => {
  const searchPar = new URLSearchParams(window.location.search);
  const paramsObj = {};
  for (const [key, value] of searchPar.entries()) {
    paramsObj[key] = value;
  }
  return paramsObj;
};
// example
// 假设目前位于 https://****com/index?id=154513&age=18;
// getSearchParams(); // {id: "154513", age: "18"}

/**
 * url转对象
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url;
  const search = url.substring(url.lastIndexOf('?') + 1);
  const obj = {};
  const reg = /([^?&=]+)=([^?&=]*)/g;
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1);
    let val = decodeURIComponent($2);
    val = String(val);
    obj[name] = val;
    return rs;
  });
  return obj;
}

// 判断手机是Android还是IOS
/**
 * 1: ios
 * 2: android
 * 3: 其它
 */
export const getOSType = () => {
  let u = navigator.userAgent,
    app = navigator.appVersion;
  let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
  let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  if (isIOS) {
    return 1;
  }
  if (isAndroid) {
    return 2;
  }
  return 3;
};

/**
 * 数组对象根据字段去重
 * @param {*} arr 要去重的数组
 * @param {*} key 根据去重的字段名
 * @returns
 */
export const uniqueArrayObject = (arr = [], key = 'id') => {
  if (arr.length === 0) return;
  let list = [];
  const map = {};
  arr.forEach((item) => {
    if (!map[item[key]]) {
      map[item[key]] = item;
    }
  });
  list = Object.values(map);
  return list;
};

// 滚动到页面顶部
export const scrollToTop = () => {
  const height = document.documentElement.scrollTop || document.body.scrollTop;
  if (height > 0) {
    window.requestAnimationFrame(scrollToTop);
    window.scrollTo(0, height - height / 8);
  }
};

// 滚动到元素位置
export const smoothScroll = (element) => {
  document.querySelector(element).scrollIntoView({
    behavior: 'smooth',
  });
};

// example
// smoothScroll('#target'); // 平滑滚动到 ID 为 target 的元素

// uuid
export const uuid = () => {
  const temp_url = URL.createObjectURL(new Blob());
  const uuid = temp_url.toString();
  URL.revokeObjectURL(temp_url); //释放这个url
  return uuid.substring(uuid.lastIndexOf('/') + 1);
};

// example
// uuid() // a640be34-689f-4b98-be77-e3972f9bffdd

/**
 * 金额格式化
 * @param {*} number 要格式化的数字
 * @param {*} decimals 保留几位小数
 * @param {*} dec_point 小数点符号
 * @param {*} thousands_sep 千分位符号
 * @returns
 */
export const moneyFormat = (number, decimals, dec_point, thousands_sep) => {
  number = (number + '').replace(/[^0-9+-Ee.]/g, '');
  const n = !isFinite(+number) ? 0 : +number;
  const prec = !isFinite(+decimals) ? 2 : Math.abs(decimals);
  const sep = typeof thousands_sep === 'undefined' ? ',' : thousands_sep;
  const dec = typeof dec_point === 'undefined' ? '.' : dec_point;
  let s = '';
  const toFixedFix = function (n, prec) {
    const k = Math.pow(10, prec);
    return '' + Math.ceil(n * k) / k;
  };
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  const re = /(-?\d+)(\d{3})/;
  while (re.test(s[0])) {
    s[0] = s[0].replace(re, '$1' + sep + '$2');
  }

  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
};

// example
// moneyFormat(10000000) // 10,000,000.00
// moneyFormat(10000000, 3, '.', '-') // 10-000-000.000

/**
 * 模糊搜索
 * @param {*} list 原数组
 * @param {*} keyWord 查询的关键词
 * @param {*} attribute 数组需要检索属性
 * @returns
 */
export const fuzzyQuery = (list, keyWord, attribute = 'name') => {
  const reg = new RegExp(keyWord);
  const arr = [];
  for (let i = 0; i < list.length; i++) {
    if (reg.test(list[i][attribute])) {
      arr.push(list[i]);
    }
  }
  return arr;
};

// example
// const list = [
//   { id: 1, name: '树哥' },
//   { id: 2, name: '黄老爷' },
//   { id: 3, name: '张麻子' },
//   { id: 4, name: '汤师爷' },
//   { id: 5, name: '胡万' },
//   { id: 6, name: '花姐' },
//   { id: 7, name: '小梅' }
// ]
// fuzzyQuery(list, '树', 'name') // [{id: 1, name: '树哥'}]

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone');
  }
  const targetObj = source.constructor === Array ? [] : {};
  Object.keys(source).forEach((keys) => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys]);
    } else {
      targetObj[keys] = source[keys];
    }
  });
  return targetObj;
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000;
  } else {
    time = +time;
  }
  const d = new Date(time);
  const now = Date.now();

  const diff = (now - d) / 1000;

  if (diff < 30) {
    return '刚刚';
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前';
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前';
  } else if (diff < 3600 * 24 * 2) {
    return '1天前';
  }
  if (option) {
    return parseTime(time, option);
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    );
  }
}

/**
 * 数字运算（主要用于小数点精度问题）
 * [see](https://juejin.im/post/6844904066418491406#heading-12)
 * @param {number} a 前面的值
 * @param {"+"|"-"|"*"|"/"} type 计算方式
 * @param {number} b 后面的值
 * @example
 * ```js
 * // 可链式调用
 * const res = computeNumber(1.3, "-", 1.2).next("+", 1.5).next("*", 2.3).next("/", 0.2).result;
 * console.log(res);
 * ```
 */
export function computeNumber(a, type, b) {
  /**
   * 获取数字小数点的长度
   * @param {number} n 数字
   */
  function getDecimalLength(n) {
    const decimal = n.toString().split('.')[1];
    return decimal ? decimal.length : 0;
  }
  /**
   * 修正小数点
   * @description 防止出现 `33.33333*100000 = 3333332.9999999995` && `33.33*10 = 333.29999999999995` 这类情况做的处理
   * @param {number} n
   */
  const amend = (n, precision = 15) =>
    parseFloat(Number(n).toPrecision(precision));
  const power = Math.pow(
    10,
    Math.max(getDecimalLength(a), getDecimalLength(b))
  );
  let result = 0;

  a = amend(a * power);
  b = amend(b * power);

  switch (type) {
    case '+':
      result = (a + b) / power;
      break;
    case '-':
      result = (a - b) / power;
      break;
    case '*':
      result = (a * b) / (power * power);
      break;
    case '/':
      result = a / b;
      break;
  }

  result = amend(result);

  return {
    /** 计算结果 */
    result,
    /**
     * 继续计算
     * @param {"+"|"-"|"*"|"/"} nextType 继续计算方式
     * @param {number} nextValue 继续计算的值
     */
    next(nextType, nextValue) {
      return computeNumber(result, nextType, nextValue);
    },
  };
}

/**
 * 格式化代币价格
 * @param {*} val 
 * @returns 
 */
export function parsePrice(val) {
  try {
    if (String(val).indexOf('e') !== -1) {
      const str = String(val);
      const index = str.indexOf('e');
      if (str.charAt(index + 1) !== '-') {
        return val;
      }
      const zeroCount = Number(str.substring(index + 2)) - 1;
      const efficientNumbers = str
        .substring(0, index)
        .split('.')
        .join('')
        .substring(0, 3);
      return `0.0{${zeroCount}}${efficientNumbers}`;
    } else if (val >= 10) {
      return val.toFixed(2);
    } else if (val < 10 && val >= 1) {
      return val.toFixed(3);
    } else if (val > 0) {
      const arr = val.toString().split('');
      const pointIndex = arr.indexOf('.');
      if (pointIndex >= 0) {
        let firstEfficientIndex = pointIndex;
        for (let i = pointIndex + 1; i < arr.length; i++) {
          if (arr[i] !== '0') {
            firstEfficientIndex = i;
            break;
          }
        }
        if (val < 1 && val >= 0.0001) {
          return arr
            .slice(0, Math.min(firstEfficientIndex + 3, arr.length))
            .join('');
        } else {
          return `0.0{${firstEfficientIndex - pointIndex - 1}}${arr
            .slice(
              firstEfficientIndex,
              Math.min(firstEfficientIndex + 3, arr.length)
            )
            .join('')}`;
        }
      }
    } else {
      return val;
    }
  } catch (err) {
    console.log(err, val);
  }
}

/**
 * 格式化大数为 K M B T
 * @param {*} val 
 * @param {*} type 
 * @returns 
 */
export function parseWithUnit(val, type) {
  try {
    if (val >= 1000000000000) {
      return Math.round(val / 1000000000) / 1000 + 'T';
    } else if (val < 1000000000000 && val >= 1000000000) {
      return Math.round(val / 1000000) / 1000 + 'B';
    } else if (val < 1000000000 && val >= 1000000) {
      return Math.round(val / 10000) / 100 + 'M';
    } else if (val < 1000000 && val >= 10000) {
      return Math.round(val / 10) / 100 + 'K';
    } else if (val < 10000 && val >= 1) {
      return val.toFixed(1);
    } else if (val > 0) {
      if (type === 'tvl') {
        return 0;
      } else {
        const arr = val.toString().split('');
        const pointIndex = arr.indexOf('.');
        if (pointIndex >= 0) {
          let firstEfficientIndex = pointIndex;
          for (let i = pointIndex + 1; i < arr.length; i++) {
            if (arr[i] !== '0') {
              firstEfficientIndex = i;
              break;
            }
          }
          return arr
            .slice(0, Math.min(firstEfficientIndex + 3, arr.length))
            .join('');
        }
      }
    } else {
      return 0;
    }
  } catch (err) {
    console.log(err, val);
  }
}
