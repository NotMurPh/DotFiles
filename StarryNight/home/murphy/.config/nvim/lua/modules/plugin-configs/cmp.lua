-- Luasnip
require("luasnip.loaders.from_vscode").lazy_load()
require("luasnip").setup({
	history = true,
	updateevents = "TextChanged,TextChangedI",
	enable_autosnippets = true
})

-- CMP
local cmp = require("cmp")
cmp.setup {
    snippet = {
        expand = function(args)
			require("luasnip").lsp_expand(args.body)
        end
    },

	window = {
		completion = cmp.config.window.bordered({
			winhighlight = "Normal:Normal,FloatBorder:CmpWindowBorders,CursorLine:PmenuSel,Search:None",
		}),

      	documentation = cmp.config.window.bordered({
			winhighlight = "Normal:Normal,FloatBorder:CmpWindowBorders,CursorLine:PmenuSel,Search:None",
		}),
    },

    mapping = cmp.mapping.preset.insert({
		-- Hotkeys are in keymaps.lua
    }),

    sources = cmp.config.sources({
        {name = "nvim_lua"},
		{name = "luasnip"},
        {name = "nvim_lsp"},
        {name = "calc"},
        {name = "path"},
        {name = "buffer"}
    }),

	formatting = {
		format = require("lspkind").cmp_format({
			mode = "symbol_text",
			maxwidth = 50,
			ellipsis_char = "...",
			menu = {
				nvim_lua = "󰕷",
				nvim_lsp = "󰅡",
				luasnip = "󰝕",
				calc = "󰪚",
				path = "󰕙",
				buffer = "󰭷"
			}
		})
	},

	experimental = {
		ghost_text = true
	}
}

-- Change the border color manually because its white for some reason
vim.cmd "highlight! CmpWindowBorders guibg=None guifg=#589ed7"
