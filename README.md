# delay-function
带取消功能的延迟方法

## 使用
### 1. 传递 value 参数作为结果

```js
(async() => {
	const result = await delayFuncion(100, {value: '🦄'});

	// 100ms后输出 🦄
	console.log(result);
})();
```

### 2. willResolve 参数决定成功还是失败

```js
(async() => {
	try{
		const result = await delayFuncion(1000, { value: '🦄', willResolve: false });
		console.log('永远不会输出这句');
	}
	catch(err){
		console.log('输出结果', err);
	}
})();
```

### 3. 一定时间范围内随机获得结果
```js
(async() => {
	try{
		const result = await delayFuncion.reject(1000, { value: '🦄', willResolve: false });
		console.log('永远不会输出这句');
	}
	catch(err){
		console.log('输出结果', err);
	}

	const result2 = await delayFuncion.range(10, 20000, { value: '🦄' });
	console.log('输出结果', result2);
})();
```

### 4. 提前结束延迟
```js
(async () => {
	const delayedPromise = delayFuncion(1000, {value: '🦄'});

	setTimeout(() => {
		delayedPromise.clear();
	}, 300);

	// 300ms后输出 🦄
	console.log(await delayedPromise);
})();
```

### 5. 取消功能
```js
(async () => {
	const abortController = new AbortController();

	setTimeout(() => {
		abortController.abort();
	}, 500);

	try {
		await delayFuncion(1000, {signal: abortController.signal});
	} catch (error) {
		// 500ms后 输出错误 AbortError
		console.log(error.name)
    }
})();
```

### 6. 自定义clearTimeout, setTimeout

```js
const customDelay = delayFuncion.createWithTimers({clearTimeout, setTimeout});

(async() => {
	const result = await customDelay(100, {value: '🦄'});

	// 100ms后输出 🦄
	console.log(result);
})();
```
