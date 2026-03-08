
import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin';

export const appTheme: CustomThemeConfig = {
    name: 'app-theme',
	properties: {
		// =~= Theme Properties =~=
		"--theme-font-family-base": `"Inter", sans-serif`,
		"--theme-font-family-heading": `"Plus Jakarta Sans", serif`,
		"--theme-font-color-base": "0 0 0",
		"--theme-font-color-dark": "255 255 255",
		"--theme-rounded-base": "8px",
		"--theme-rounded-container": "8px",
		"--theme-border-base": "1px",
		// =~= Theme On-X Colors =~=
		"--on-primary": "0 0 0",
		"--on-secondary": "255 255 255",
		"--on-tertiary": "0 0 0",
		"--on-success": "0 0 0",
		"--on-warning": "0 0 0",
		"--on-error": "0 0 0",
		"--on-surface": "255 255 255",
		// =~= Theme Colors  =~=
		// primary | #86709d 
		"--color-primary-50": "237 234 240", // #edeaf0
		"--color-primary-100": "231 226 235", // #e7e2eb
		"--color-primary-200": "225 219 231", // #e1dbe7
		"--color-primary-300": "207 198 216", // #cfc6d8
		"--color-primary-400": "170 155 186", // #aa9bba
		"--color-primary-500": "134 112 157", // #86709d
		"--color-primary-600": "121 101 141", // #79658d
		"--color-primary-700": "101 84 118", // #655476
		"--color-primary-800": "80 67 94", // #50435e
		"--color-primary-900": "66 55 77", // #42374d
		// secondary | #4b4564 
		"--color-secondary-50": "228 227 232", // #e4e3e8
		"--color-secondary-100": "219 218 224", // #dbdae0
		"--color-secondary-200": "210 209 216", // #d2d1d8
		"--color-secondary-300": "183 181 193", // #b7b5c1
		"--color-secondary-400": "129 125 147", // #817d93
		"--color-secondary-500": "75 69 100", // #4b4564
		"--color-secondary-600": "68 62 90", // #443e5a
		"--color-secondary-700": "56 52 75", // #38344b
		"--color-secondary-800": "45 41 60", // #2d293c
		"--color-secondary-900": "37 34 49", // #252231
		// tertiary | #acb7c5 
		"--color-tertiary-50": "243 244 246", // #f3f4f6
		"--color-tertiary-100": "238 241 243", // #eef1f3
		"--color-tertiary-200": "234 237 241", // #eaedf1
		"--color-tertiary-300": "222 226 232", // #dee2e8
		"--color-tertiary-400": "197 205 214", // #c5cdd6
		"--color-tertiary-500": "172 183 197", // #acb7c5
		"--color-tertiary-600": "155 165 177", // #9ba5b1
		"--color-tertiary-700": "129 137 148", // #818994
		"--color-tertiary-800": "103 110 118", // #676e76
		"--color-tertiary-900": "84 90 97", // #545a61
		// success | #01f349 
		"--color-success-50": "217 253 228", // #d9fde4
		"--color-success-100": "204 253 219", // #ccfddb
		"--color-success-200": "192 252 210", // #c0fcd2
		"--color-success-300": "153 250 182", // #99fab6
		"--color-success-400": "77 247 128", // #4df780
		"--color-success-500": "1 243 73", // #01f349
		"--color-success-600": "1 219 66", // #01db42
		"--color-success-700": "1 182 55", // #01b637
		"--color-success-800": "1 146 44", // #01922c
		"--color-success-900": "0 119 36", // #007724
		// warning | #ffe23e 
		"--color-warning-50": "255 251 226", // #fffbe2
		"--color-warning-100": "255 249 216", // #fff9d8
		"--color-warning-200": "255 248 207", // #fff8cf
		"--color-warning-300": "255 243 178", // #fff3b2
		"--color-warning-400": "255 235 120", // #ffeb78
		"--color-warning-500": "255 226 62", // #ffe23e
		"--color-warning-600": "230 203 56", // #e6cb38
		"--color-warning-700": "191 170 47", // #bfaa2f
		"--color-warning-800": "153 136 37", // #998825
		"--color-warning-900": "125 111 30", // #7d6f1e
		// error | #ff442f 
		"--color-error-50": "255 227 224", // #ffe3e0
		"--color-error-100": "255 218 213", // #ffdad5
		"--color-error-200": "255 208 203", // #ffd0cb
		"--color-error-300": "255 180 172", // #ffb4ac
		"--color-error-400": "255 124 109", // #ff7c6d
		"--color-error-500": "255 68 47", // #ff442f
		"--color-error-600": "230 61 42", // #e63d2a
		"--color-error-700": "191 51 35", // #bf3323
		"--color-error-800": "153 41 28", // #99291c
		"--color-error-900": "125 33 23", // #7d2117
		// surface | #060e1a 
		"--color-surface-50": "218 219 221", // #dadbdd
		"--color-surface-100": "205 207 209", // #cdcfd1
		"--color-surface-200": "193 195 198", // #c1c3c6
		"--color-surface-300": "155 159 163", // #9b9fa3
		"--color-surface-400": "81 86 95", // #51565f
		"--color-surface-500": "6 14 26", // #060e1a
		"--color-surface-600": "5 13 23", // #050d17
		"--color-surface-700": "5 11 20", // #050b14
		"--color-surface-800": "4 8 16", // #040810
		"--color-surface-900": "3 7 13", // #03070d
		
	}
}