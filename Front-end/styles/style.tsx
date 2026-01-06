import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  // Common
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  userinfocontainer: {
    flex: 1,
  },
  maincontainer: {
    flex: 1,
  },

  // Login / Sign in styles
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
    fontWeight: "600",
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
    width: "90%",
    marginBottom: 10,
  },
  bottombuttoncontainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    bottom: Platform.OS === "ios" ? 40 : 20,
    alignSelf: "center",
    width: "85%",
  },
  iconcontainer: {
    width: 50,
    alignItems: "center",
    marginRight: 20,
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
  phoneInput: {
    flex: 1,
    color: "#000",
    paddingVertical: 10,
  },
  signintitle: {
    fontFamily: "Montserrat_600SemiBold",
    fontWeight: "800",
    fontSize: 24,
    marginBottom: 20,
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
  termtext: {
    fontFamily: "Montserrat_600SemiBold",
    fontWeight: "800",
    fontSize: 10,
    position: "absolute",
    bottom: Platform.OS === "ios" ? 170 : 150,
    alignSelf: "center",
    width: "85%",
  },

  // OTP
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "70%",
    marginBottom: 10,
    marginLeft: 10,
  },
  otpInput: {
    width: "20%",
    height: "100%",
    backgroundColor: "white",
    borderRadius: 5,
    textAlign: "center",
    fontSize: 24,
    marginHorizontal: 5,
  },
  otpsubtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 40,
    width: "70%",
    textAlign: "center",
  },
  otpbutton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 15,
    justifyContent: "center",
    width: "70%",
    marginBottom: 10,
  },

  // Radio / Option
  optionTypeContainer: {
    width: "50%",
    marginVertical: 5,
  },
  optionTypebutton: {
    backgroundColor: "#007BFF",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "85%",
    marginVertical: 10,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  radioActive: {
    borderColor: "#fff",
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  radioDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "white",
  },
  optionText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
    width: "100%",
  },

  // Playlist grid
  row: {
    justifyContent: "space-between",
    width: "90%",
    marginLeft: "5%",
  },
  headerWrap: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 12,
    marginBottom: 16,
    width: "90%",
    marginLeft: "5%",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  playlistItem: {
    width: "48%",
    marginBottom: 16,
    alignItems: "center",
  },
  playlistImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
  },
  playlistTitle: {
    fontSize: 14,
    color: "#fff",
    marginTop: 8,
    textAlign: "center",
  },
  listContent: {
    paddingBottom: 80,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  playlistinput: {
    borderBottomWidth: 2,
    borderBottomColor: "white",
    color: "white",
    paddingVertical: 8,
    marginBottom: 32,
    fontSize: 18,
    textAlign: "center",
    alignSelf: "center",
    width: "80%",
  },

  // Create Playlist / Modal
  backbutton: {
    fontSize: 40,
    color: "white",
    marginBottom: 30,
    marginLeft: 20,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    backgroundColor: "#333",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    width: 300,
  },
  popupIcon: {
    fontSize: 32,
    marginBottom: 16,
  },
  popupText: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 24,
    textAlign: "center",
  },
  popupButton: {
    marginVertical: 4,
  },
  popupButtonText: {
    fontSize: 16,
    color: "#fff",
  },

  // Playlist Song Screen
  artistHeader: {
    alignItems: "center",
    marginVertical: 16,
  },
  artistImage: {
    width: 132,
    height: 120,
    borderRadius: 20,
  },
  artistName: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 8,
  },
  songItem: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  songImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginRight: 12,
  },
  songTitle: {
    fontSize: 16,
    color: "#fff",
  },
  songArtist: {
    fontSize: 14,
    color: "#888",
  },

  // Login Screen (new)
  textinput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 15,
    fontSize: 16,
    width: "85%",
    color: "#333",
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  customCheckbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  checkedCheckbox: {
    backgroundColor: "#FFFFFF",
  },
  checkMark: {
    color: "#6A5ACD",
    fontSize: 14,
    fontWeight: "bold",
  },
  rememberText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: "#A9A9A9",
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  signupText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 14,
  },
  passwordContainer: {
    position: "relative",
    marginBottom: 15,
    width: "85%",
  },
  passwordInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
    color: "#333",
  },
  eyeButton: {
    position: "absolute",
    right: 15,
    top: "50%",
    transform: [{ translateY: -12 }],
    justifyContent: "center",
    alignItems: "center",
  },
});

export default styles;