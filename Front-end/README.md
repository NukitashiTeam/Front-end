# Hướng dẫn import Header và BottomBar

1. Thực hiện import như sau:
```import Header from "./components/Header";
import BottomBar from "./components/BottomBar";```

2. Đặt cái code này vào phần code typescript:
```const [isModEnabled, setIsModEnabled] = useState(true);```

3. Chọn chỗ đặt Header rồi chèn code sau:
```<Header isModEnabled={isModEnabled} onToggleMod={setIsModEnabled} />```

3. Chọn chỗ đặt BottomBar rồi chèn code sau:
```<BottomBar
   active="home"
   onPress={(k) => {
         console.log("press:", k);
   }}
/>```