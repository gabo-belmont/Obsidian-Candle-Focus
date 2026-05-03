# Candle Focus

Candle Focus is a high-performance [Obsidian](https://obsidian.md) plugin designed to enhance concentration by applying a dynamic CSS mask to your editor. This creates a "candlelight" effect where the text you are currently reading remains clear, while the surrounding content subtly fades away.

<video src="https://github.com/user-attachments/assets/983c25dd-9554-40fb-b356-f19d23cc1afd" autoplay loop muted playsinline width="100%"></video>


## Focus & Study Aid

Candle Focus is specifically designed for users who experience digital eye strain or find themselves easily distracted by large walls of text. By naturally guiding your eyes toward the "illuminated" paragraph, the plugin helps maintain a deep flow state during long reading or study sessions.

- **Selective Attention**: Naturally directs your focus to the active part of the document, reducing the cognitive load of ignoring surrounding text.
- **Adjustable Intensity**: Every parameter—from the height of the focus zone to the smoothness of the gradient—is fully customizable. This allows you to make the effect as subtle or as prominent as you need to match your personal concentration style.


## How it Works

Unlike traditional focus plugins that may impact performance through heavy DOM manipulation, Candle Focus leverages GPU-accelerated CSS masks. 

- **Hardware Acceleration**: The focus effect is rendered via `-webkit-mask-image`, offloading the visual processing to the GPU.
- **Scroll-Aware Dynamics**: A lightweight listener monitors the scroll position to adjust the top opacity, ensuring a natural transition when starting a new document.
- **Optimized Rendering**: Utilizing `requestAnimationFrame`, the plugin ensures that visual updates are synchronized with your monitor's refresh rate, eliminating jitter and minimizing CPU overhead.

## Features

- **Adjustable Focus Zone**: Customize the height and vertical position of the focus area.
- **Brightness Smoothness**: Fine-tune the gradient edges for a comfortable reading experience.
- **Ribbon Toggle**: Quickly enable or disable the effect with a single click.
- **Performance First**: Zero impact on typing latency or overall application speed.

## Installation

1. Create a folder named `candle-focus` in your vault's `.obsidian/plugins/` directory.
2. Copy `main.js`, `styles.css`, and `manifest.json` into that folder.
3. Reload Obsidian and enable the plugin in the **Community Plugins** settings.

## Credits and Inspiration

This project was inspired by the initial concept of [Ghost Fade Focus](https://github.com/skipadu/obsidian-ghost-fade-focus) by skipadu. 

The codebase was refined and optimized for modern Obsidian environments with the technical assistance of Google Gemini, focusing on performance standards and efficient resource management.

## Disclaimer

**Use at your own risk.** This software is provided "as is" without warranty of any kind. The author is not responsible for any data loss, performance issues, or unintended behavior within Obsidian resulting from the use of this plugin. By using this software, you acknowledge that any modification to your environment is done at your own discretion.
