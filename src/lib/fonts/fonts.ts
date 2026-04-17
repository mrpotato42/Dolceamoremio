import localFont from 'next/font/local'

export const fontTitle = localFont({
    src: '../../assets/fonts/title.ttf',
    variable: '--font-title',
    display: 'swap',
    preload: true,
})

export const fontSubtitle = localFont({
    src: '../../assets/fonts/subtitle.otf',
    variable: '--font-subtitle',
    display: 'swap',
    preload: true,
})

export const fontBody = localFont({
    src: '../../assets/fonts/body.ttf',
    variable: '--font-body',
    display: 'swap',
    preload: true,
})

export const fontNumber = localFont({
    src: '../../assets/fonts/numbers.ttf',
    variable: '--font-number',
    display: 'swap',
    preload: true,
})