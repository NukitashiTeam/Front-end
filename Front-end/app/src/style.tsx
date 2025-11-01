import { StyleSheet } from "react-native";
import { Platform} from "react-native";
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  signinlogo: {
    fontSize: 48,
    fontWeight: "400",
    position: "absolute",
    color: "rgba(255, 255, 255, 0.72)",
    top: 80,
    fontFamily: "IrishGrover_400Regular",
  },
  signinsubtitle: {
    color: "white",
    fontSize: 16,
    fontWeight:"600",
    marginBottom: 40,
  },
  signinbuttonContainer: {
    width: "85%",
  },
  signinbutton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    justifyContent: "flex-start",
  },
  nextbutton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 15,
    justifyContent: "center",
    width:"90%",
    marginBottom:10,
  },
  bottombuttoncontainer:{
    flexDirection: "column",
    justifyContent: "space-between", // Để hai nút cách đều nhau
    alignItems: "center",
    position: "absolute",
    bottom: Platform.OS === "ios" ? 40 : 20, // Giữ nguyên để tránh home indicator trên iOS
    alignSelf: "center",
    width: "85%", // Giữ width tổng như cũ
  },
  iconcontainer :{
    width: 50, // giúp icon của các button thẳng hàng nhau
    alignItems: "center",
    marginRight:20,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  buttonText: {
    color: "#000",
    fontSize: 15,
    fontWeight: "500",
    justifyContent: "center",
  },
  phoneInput:{
    flex: 1,
    color: "#000",
    paddingVertical: 10,
  },
  signintitle:{
    fontFamily: "Montserrat_600SemiBold",
    fontWeight: "800",
    fontSize: 24,
    marginBottom:20
  },
  phoneinputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    width: "85%",
    paddingHorizontal: 10,
    paddingVertical: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  termtext:{
    fontFamily: "Montserrat_600SemiBold",
    fontWeight: "800",
    fontSize: 10,
    alignItems: "center",
    position: "absolute",
    bottom: Platform.OS === "ios" ? 170 : 150, // Giữ nguyên để tránh home indicator trên iOS
    alignSelf: "center",
    justifyContent: "flex-end",
    width: "85%",
  },
  otpContainer:{
    flexDirection: "row",
    justifyContent: "space-between",
    width: "70%",
    marginBottom:10,
    marginLeft: 10
  },
  otpInput: {
    width: "20%",
    height: "100%",
    backgroundColor: 'white',
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 24,
    marginHorizontal: 5,
  },
})
export default styles;