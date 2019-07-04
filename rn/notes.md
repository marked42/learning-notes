# RN

Invariant Violation: Text strings must be rendered within a <Text> component

```jsx
// text是文字当做真假值使用会报错
{text && (
  <Component/>
)}
```

Modal状态栏问题

border style solid之外，不能单独设置top/bottom/left/right的width和color


```jsx
// disabled 不起作用
<TouchableWithoutFeedback
  onPress={onPress}
  disabled={true}
>
  <Text></Text>
</TouchableWithoutFeedback>

// disabled 不起作用
<TouchableWithoutFeedback
  onPress={onPress}
>
  <Text
    disabled={true}
  ></Text>
</TouchableWithoutFeedback>

// View上没有color属性
<TouchableWithoutFeedback
  onPress={onPress}
  disabled={true}
>
  <View>
    <Text></Text>
  </View>
</TouchableWithoutFeedback>
```

```jsx
<View
  style={[
    // conditional style不要使用null，在native debugger里面手动改变style时会报错。
    condition1 ? style1 : null,

    // use empty object {}
    condition2 ? style1 : {},
  ]}
>
</View>
```

```jsx
<View>
  <Text>Text自动占据Parent View的全部宽度</Text>
</View>
```

边框宽度等长度可以使用小数(0.5)
