
import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin';

export const kudosTheme: CustomThemeConfig = {
    name: 'kudos-theme',
    properties: {
		// =~= Theme Properties =~=
		"--theme-font-family-base": `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
		"--theme-font-family-heading": `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
		"--theme-font-color-base": "0 0 0",
		"--theme-font-color-dark": "255 255 255",
		"--theme-rounded-base": "9999px",
		"--theme-rounded-container": "16px",
		"--theme-border-base": "2px",
		// =~= Theme On-X Colors =~=
		"--on-primary": "0 0 0",
		"--on-secondary": "0 0 0",
		"--on-tertiary": "0 0 0",
		"--on-success": "0 0 0",
		"--on-warning": "0 0 0",
		"--on-error": "255 255 255",
		"--on-surface": "255 255 255",
		// =~= Theme Colors  =~=
		// primary | #04def6 
		"--color-primary-50": "217 250 254", // #d9fafe
		"--color-primary-100": "205 248 253", // #cdf8fd
		"--color-primary-200": "192 247 253", // #c0f7fd
		"--color-primary-300": "155 242 251", // #9bf2fb
		"--color-primary-400": "79 232 249", // #4fe8f9
		"--color-primary-500": "4 222 246", // #04def6
		"--color-primary-600": "4 200 221", // #04c8dd
		"--color-primary-700": "3 167 185", // #03a7b9
		"--color-primary-800": "2 133 148", // #028594
		"--color-primary-900": "2 109 121", // #026d79
		// secondary | #f604e1 
		"--color-secondary-50": "254 217 251", // #fed9fb
		"--color-secondary-100": "253 205 249", // #fdcdf9
		"--color-secondary-200": "253 192 248", // #fdc0f8
		"--color-secondary-300": "251 155 243", // #fb9bf3
		"--color-secondary-400": "249 79 234", // #f94fea
		"--color-secondary-500": "246 4 225", // #f604e1
		"--color-secondary-600": "221 4 203", // #dd04cb
		"--color-secondary-700": "185 3 169", // #b903a9
		"--color-secondary-800": "148 2 135", // #940287
		"--color-secondary-900": "121 2 110", // #79026e
		// tertiary | #6fe8b8 
		"--color-tertiary-50": "233 252 244", // #e9fcf4
		"--color-tertiary-100": "226 250 241", // #e2faf1
		"--color-tertiary-200": "219 249 237", // #dbf9ed
		"--color-tertiary-300": "197 246 227", // #c5f6e3
		"--color-tertiary-400": "154 239 205", // #9aefcd
		"--color-tertiary-500": "111 232 184", // #6fe8b8
		"--color-tertiary-600": "100 209 166", // #64d1a6
		"--color-tertiary-700": "83 174 138", // #53ae8a
		"--color-tertiary-800": "67 139 110", // #438b6e
		"--color-tertiary-900": "54 114 90", // #36725a
		// success | #28A745 
		"--color-success-50": "223 242 227", // #dff2e3
		"--color-success-100": "212 237 218", // #d4edda
		"--color-success-200": "201 233 209", // #c9e9d1
		"--color-success-300": "169 220 181", // #a9dcb5
		"--color-success-400": "105 193 125", // #69c17d
		"--color-success-500": "40 167 69", // #28A745
		"--color-success-600": "36 150 62", // #24963e
		"--color-success-700": "30 125 52", // #1e7d34
		"--color-success-800": "24 100 41", // #186429
		"--color-success-900": "20 82 34", // #145222
		// warning | #E3C143 
		"--color-warning-50": "251 246 227", // #fbf6e3
		"--color-warning-100": "249 243 217", // #f9f3d9
		"--color-warning-200": "248 240 208", // #f8f0d0
		"--color-warning-300": "244 230 180", // #f4e6b4
		"--color-warning-400": "235 212 123", // #ebd47b
		"--color-warning-500": "227 193 67", // #E3C143
		"--color-warning-600": "204 174 60", // #ccae3c
		"--color-warning-700": "170 145 50", // #aa9132
		"--color-warning-800": "136 116 40", // #887428
		"--color-warning-900": "111 95 33", // #6f5f21
		// error | #DC3545 
		"--color-error-50": "250 225 227", // #fae1e3
		"--color-error-100": "248 215 218", // #f8d7da
		"--color-error-200": "246 205 209", // #f6cdd1
		"--color-error-300": "241 174 181", // #f1aeb5
		"--color-error-400": "231 114 125", // #e7727d
		"--color-error-500": "220 53 69", // #DC3545
		"--color-error-600": "198 48 62", // #c6303e
		"--color-error-700": "165 40 52", // #a52834
		"--color-error-800": "132 32 41", // #842029
		"--color-error-900": "108 26 34", // #6c1a22
		// surface | #241f61 
		"--color-surface-50": "222 221 231", // #dedde7
		"--color-surface-100": "211 210 223", // #d3d2df
		"--color-surface-200": "200 199 216", // #c8c7d8
		"--color-surface-300": "167 165 192", // #a7a5c0
		"--color-surface-400": "102 98 144", // #666290
		"--color-surface-500": "36 31 97", // #241f61
		"--color-surface-600": "32 28 87", // #201c57
		"--color-surface-700": "27 23 73", // #1b1749
		"--color-surface-800": "22 19 58", // #16133a
		"--color-surface-900": "18 15 48", // #120f30
		
	}
}