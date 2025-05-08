import { Theme } from '@mui/material/styles';

declare module '@mui/material/styles' {
    interface CustomTheme extends Theme {
        // カスタムテーマのプロパティがあれば追加
    }
    interface ThemeOptions extends CustomTheme {}
}
