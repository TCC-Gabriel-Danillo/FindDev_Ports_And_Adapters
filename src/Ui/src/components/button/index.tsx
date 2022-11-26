import { ReactNode } from 'react';
import { TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native';
import { Text } from "../text"
import { styles } from "./styles"

interface Props extends TouchableOpacityProps {
    children: ReactNode
    style?: ViewStyle
}

export const Button: React.FC<Props> = ({ children, style, ...rest }) => {
  return(
    <TouchableOpacity {...rest} style={[styles.button, style]}>
        <Text fontWeight='semibold' style={styles.buttonText}>
            {children}
        </Text>
    </TouchableOpacity>
  )
}

