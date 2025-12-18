export function handleBulletAwareEnter(params: {
    event: React.KeyboardEvent<HTMLTextAreaElement>
    value: string
    setValue: (v: string) => void
    textarea: HTMLTextAreaElement | null
    onSubmit: () => void
    isMobile: boolean
}) {
    const { event, value, setValue, textarea, onSubmit, isMobile } = params

    if (event.key !== 'Enter' || event.shiftKey || isMobile) return

    if (!textarea) return

    const { selectionStart } = textarea
    const textBefore = value.slice(0, selectionStart)
    const currentLine = textBefore.split('\n').pop() || ''

    // 🔥 Bullet continuation
    if (currentLine.startsWith('- ')) {
        event.preventDefault()

        const insert = '\n- '
        const newValue =
            value.slice(0, selectionStart) +
            insert +
            value.slice(selectionStart)

        setValue(newValue)

        requestAnimationFrame(() => {
            textarea.selectionStart = textarea.selectionEnd =
                selectionStart + insert.length
        })

        return
    }

    // Normal submit
    event.preventDefault()
    onSubmit()
}
