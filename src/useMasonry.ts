import { ref } from 'vue'

function breakpointValue(mixed: any, width: number): number {
    const valueAsNum = parseInt(mixed, 10)
    if (valueAsNum > -1) {
        return mixed
    }
    let matchedBreakpoint = Infinity
    let matchedValue = mixed.default || 0

    const entries = Object.entries(mixed)
    entries.forEach(([key, value]) => {
        const breakpoint = parseInt(key, 10)
        const breakpointValRaw = value
        // @ts-ignore
        const breakpointVal = parseInt(breakpointValRaw, 10)

        if (Number.isNaN(breakpoint) || Number.isNaN(breakpointVal)) {
            return
        }

        const isNewBreakpoint =
            width <= breakpoint && breakpoint < matchedBreakpoint

        if (isNewBreakpoint) {
            matchedBreakpoint = breakpoint
            matchedValue = breakpointValRaw
        }
    })

    return matchedValue
}

export function useMasonry(props: any) {
    const wrapperWidth = ref(0)
    const displayColumns = ref(2)
    const displayGutter = ref(0)

    const calculateGutterSize = (width: number): void => {
        displayGutter.value = breakpointValue(props.gutter, width) as number
    }

    const calculateColumnCount = (width: number): void => {
        let columnLength = breakpointValue(props.cols, width) as number
        columnLength = Math.max(1, Number(columnLength) || 0)
        displayColumns.value = columnLength
    }

    const render = (): void => {
        const windowWidth = window?.innerWidth || Infinity
        if (wrapperWidth.value !== windowWidth) {
            wrapperWidth.value = windowWidth
            calculateColumnCount(wrapperWidth.value)
            calculateGutterSize(wrapperWidth.value)
        }
    }

    return {
        displayColumns,
        displayGutter,
        render
    }
}
