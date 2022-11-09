import { StyleSheet } from "react-native"
import { CONST } from "dev-ui"

export const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: CONST.LIGHT, 
        paddingHorizontal: 20
    }, 
    button: {
        marginTop: 10
    }, 
    subtitle: { textAlign: "center", marginTop: 10 }
})