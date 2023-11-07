<script lang="ts">
import {
    defineComponent,
    h as createElement,
    onMounted,
    onUnmounted,
    onUpdated,
    nextTick
} from 'vue'
import { useMasonry } from '~/composables/useMasonry'

const props = {
    tag: {
        type: [String],
        default: 'div'
    },
    cols: {
        type: [Object, Number, String],
        default: 2
    },
    gutter: {
        type: [Object, Number, String],
        default: 0
    },
    css: {
        type: [Boolean],
        default: true
    },
    columnTag: {
        type: [String],
        default: 'div'
    },
    columnClass: {
        type: [String, Array, Object],
        default: () => []
    },
    columnAttr: {
        type: [Object],
        default: () => {}
    }
}

export default defineComponent({
    props,
    setup(_, { slots }) {
        const { displayColumns, displayGutter, render } = useMasonry(_)
        onMounted(() => {
            window.addEventListener('resize', render)
            nextTick(render)
        })

        onUpdated(() => {
            nextTick(render)
        })

        onUnmounted(() => {
            window.removeEventListener('resize', render)
        })
        return {
            displayGutter,
            displayColumns
        }
    },

    methods: {
        getColumnsWithChildItems(displayColumns: number): [] {
            const columns: any = []
            const slot = this.$slots.default || []
            if (slot && slot.length > 0) {
                let children = []

                if (slot.length >= 1) {
                    children = slot
                } else {
                    children = slot[0]?.children || []

                    if (children.length === 1) {
                        children = children[0]?.children || []
                    }
                }

                if (children.length === 0) return []

                for (
                    let i = 0, visibleItemI = 0;
                    i < children.length;
                    // eslint-disable-next-line no-plusplus
                    i++, visibleItemI++
                ) {
                    // eslint-disable-next-line no-plusplus
                    if (!children[i].tag) visibleItemI--

                    const columnIndex = visibleItemI % displayColumns

                    if (!columns[columnIndex]) {
                        columns[columnIndex] = []
                    }

                    columns[columnIndex].push(children[i])
                }
            }
            return columns
        },

        render() {
            const { displayGutter } = this
            const columnsContainingChildren = this.getColumnsWithChildItems()
            const isGutterSizeUnitless =
                parseInt(displayGutter.toString(), 10) === displayGutter * 1
            const gutterSize = isGutterSizeUnitless
                ? `${displayGutter}px`
                : displayGutter

            const containerConfig = {
                style: {
                    display: ['-webkit-box', '-ms-flexbox', 'flex'],
                    marginLeft: `-${gutterSize}`
                }
            }
            const columnStyle = {
                boxSizing: 'border-box',
                backgroundClip: 'padding-box',
                width: `${100 / this.displayColumns}%`,
                border: '0px solid transparent',
                borderLeftWidth: gutterSize
            }
            const columns = columnsContainingChildren.map(
                (children: any, index: number) => {
                    const config = {
                        key: `${index}-${columnsContainingChildren.length}`,
                        style: this.css ? columnStyle : null,
                        class: this.columnClass,
                        attrs: this.columnAttr
                    } as any

                    // Create column element and inject the children
                    return createElement(this.columnTag, config, children)
                }
            )
            // Return wrapper with columns
            // @ts-ignore
            return createElement(this.tag, this.css && containerConfig, columns)
        }
    })
</script>

