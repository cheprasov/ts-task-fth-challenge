
export const replaceVars = (str: string, vars: Record<string, number | string> = {}): string => {
    return str.replace(/\{:(\w+):\}/g, (tpl, name) => {
        if (name in vars) {
            return `${vars[name]}`;
        }
        return '';
    });
};