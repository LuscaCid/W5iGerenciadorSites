import {useCallback} from "react";
import {StorageKeys} from "../constants/StorageKeys.ts";

export const appTheme = () => {
    const handleChangeTheme = useCallback(() => {
        const theme = localStorage.getItem(StorageKeys.theme);
        const html = document.querySelector("html")!;

        if (theme && theme == "dark")
        {
            localStorage.removeItem(StorageKeys.theme);
            html.classList.remove("dark");
            return;
        }
        html.classList.add("dark")
        localStorage.setItem(StorageKeys.theme, "dark");

    }, [])
    return {
        handleChangeTheme
    }
}
