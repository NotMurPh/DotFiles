-- Comment
require("Comment").setup()

-- Auto pairs
require("nvim-autopairs").setup()

-- Detect indent
vim.api.nvim_create_autocmd("BufReadPost" , { -- Overriding hardcoded default indent 
    callback = function()
        vim.bo.shiftwidth = 4
        vim.bo.tabstop = 4
    end
})

require("ibl").setup({
	exclude = {
		filetypes = { "lspinfo" , "packer" , "checkhealth" , "help" , "man" , "" , "dashboard" }
	}
})

-- Git signs
vim.cmd("set fillchars+=diff:/") -- Diffview.nvim diagonal lines
require("gitsigns").setup({
    signs = {
        delete = { text = "┃" },
        topdelete = { text = "┃" },
        changedelete = { text = "┆" }
    }
})

-- Toggle terminal
require("toggleterm").setup({
    size = 15,

	float_opts = {
		border = "rounded",
	},

	highlights = {
		FloatBorder = {
			guifg = "#589ed7",
		},
	},
})

-- Colorizer
require("colorizer").setup( {"*"} , {mode = "foreground"} )

-- Glow hover
require("glow-hover").setup({
    border = "rounded",
})

-- Telescope
require("telescope").setup({
    defaults = {
        prompt_prefix = "   ",
        selection_caret = "  ",
        entry_prefix = "  ",
        sorting_strategy = "ascending",
        layout_config = {
            horizontal = {
                prompt_position = "top",
                preview_width = 0.55,
                results_width = 0.8,
            },
            vertical = {
                mirror = false,
            },
            width = 0.87,
            height = 0.80,
            preview_cutoff = 120,
        },
    },
})
require("telescope").load_extension("fzf")

-- Dashboard
function SetupDashboard()
	require("dashboard").setup {

		theme = "doom",

		config = {

			header = {
				"",
				"",
				"",
				"",
				"",
				"",
				"",
				"",
				"",
				"",
				"                                        ▟▙            ",
				"                           ▝▘",
				"██▃▅▇█▆▖  ▗▟████▙▖   ▄████▄   ██▄  ▄██  ██  ▗▟█▆▄▄▆█▙▖",
				"██▛▔ ▝██  ██▄▄▄▄██  ██▛▔▔▜██  ▝██  ██▘  ██  ██▛▜██▛▜██",
				"██    ██  ██▀▀▀▀▀▘  ██▖  ▗██   ▜█▙▟█▛   ██  ██  ██  ██",
				"██    ██  ▜█▙▄▄▄▟▊  ▀██▙▟██▀   ▝████▘   ██  ██  ██  ██",
				"▀▀    ▀▀   ▝▀▀▀▀▀     ▀▀▀▀       ▀▀     ▀▀  ▀▀  ▀▀  ▀▀",
				"",
				""
			},

			center = {
				{
					icon = "  ",
					icon_hl = "Title",
					desc = "New file                                            ",
					desc_hl = "Title",
					key = " <Leader> n   ",
					key_hl = "Number"
				},
				{
					icon = "󰑓  ",
					icon_hl = "Title",
					desc = "Load last session",
					desc_hl = "Title",
					key = " <Leader> l s ",
					key_hl = "Number",
				},
				{
					icon = "  ",
					icon_hl = "Title",
					desc = "Recent files",
					desc_hl = "Title",
					key = " <Leader> f o ",
					key_hl = "Number",
				},
				{
					icon = "  ",
					icon_hl = "Title",
					desc = "Find files",
					desc_hl = "Title",
					key = " <Leader> f f ",
					key_hl = "Number",
				},
				{
					icon = "  ",
					icon_hl = "Title",
					desc = "Nvim configs",
					desc_hl = "Title",
					key = " <Leader> l n ",
					key_hl = "Number",
				}
			},

			footer = {}
		},

		hide = {
			statusline = false,
			tabline = false
		},

    }
end

vim.cmd([[
  augroup MyAutocmds
    autocmd!
    autocmd VimEnter * lua SetupDashboard()
  augroup END
]])

vim.cmd("autocmd VimLeave * mksession! ~/.config/nvim/LastSession.vim")
