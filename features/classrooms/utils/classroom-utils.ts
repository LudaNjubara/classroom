
// generate { dark, darker, light, lighter } colors from a seed color
export const generateAccentColorsFromSeed = (seed: string) => {
    const seedColor = seed.replace("#", "");
    const seedColorNumber = parseInt(seedColor, 16);

    const red = (seedColorNumber >> 16) & 0xFF;
    const green = (seedColorNumber >> 8) & 0xFF;
    const blue = seedColorNumber & 0xFF;

    const dark = `#${((Math.max(red - 0x33, 0) << 16) | (Math.max(green - 0x33, 0) << 8) | Math.max(blue - 0x33, 0)).toString(16).padStart(6, '0')}`;
    const darker = `#${((Math.max(red - 0x66, 0) << 16) | (Math.max(green - 0x66, 0) << 8) | Math.max(blue - 0x66, 0)).toString(16).padStart(6, '0')}`;
    const light = `#${((Math.min(red + 0x33, 0xFF) << 16) | (Math.min(green + 0x33, 0xFF) << 8) | Math.min(blue + 0x33, 0xFF)).toString(16).padStart(6, '0')}`;
    const lighter = `#${((Math.min(red + 0x66, 0xFF) << 16) | (Math.min(green + 0x66, 0xFF) << 8) | Math.min(blue + 0x66, 0xFF)).toString(16).padStart(6, '0')}`;

    return {
        dark,
        darker,
        light,
        lighter,
    };
}

export const hexToRGBA = (hex: string, opacity: number) => {
    if (!hex) return

    let r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}