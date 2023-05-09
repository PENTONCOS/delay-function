// 一定时间范围内随机获得结果
const randomInteger = (minimum, maximum) => Math.floor((Math.random() * (maximum - minimum + 1)) + minimum);

const createAbortError = () => {
  const error = new Error('取消延迟！');
  error.name = 'AbortError';
  return error;
};


const createDelay = ({ clearTimeout: defaultClear, setTimeout: set, willResolve }) => (ms, { value, signal } = {}) => {
  if (signal && signal.aborted) {
    return Promise.reject(createAbortError());
  }

  let timeoutId;
  let settle;
  let rejectFn;
  // 自定义clearTimeout和setTimeout函数
  const clear = defaultClear || clearTimeout;

  const signalListener = () => {
    clear(timeoutId);
    rejectFn(createAbortError());
  }
  const cleanup = () => {
    if (signal) {
      signal.removeEventListener('abort', signalListener);
    }
  };
  // 用promise和setTimeout实现延迟函数
  const delayPromise = new Promise((resolve, reject) => {
    settle = () => {
      cleanup();
      // 加个 willResolve 参数决定成功还是失败
      if (willResolve) {
        resolve(value);
      } else {
        reject(value);
      }
    };

    rejectFn = reject;
    timeoutId = (set || setTimeout)(settle, ms);
  });

  // 使用 AbortController 实现取消功能
  if (signal) {
    signal.addEventListener('abort', signalListener, { once: true });
  }

  // 提前结束延迟，并清除定时器
  delayPromise.clear = () => {
    clear(timeoutId);
    timeoutId = null;
    settle();
  };

  return delayPromise;
}

// 把成功 delay 和失败 reject 封装成一个函数，随机 range 单独封装成一个函数。
const createWithTimers = clearAndSet => {
  const delay = createDelay({ ...clearAndSet, willResolve: true });
  delay.reject = createDelay({ ...clearAndSet, willResolve: false });
  delay.range = (minimum, maximum, options) => delay(randomInteger(minimum, maximum), options);
  return delay;
}
const delayFuncion = createWithTimers();
delayFuncion.createWithTimers = createWithTimers;