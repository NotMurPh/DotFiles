require("nvim-treesitter.configs").setup({
	highlight = {
		enable = true,
		additional_vim_regex_highlighting = false,
	}
})

require("tokyonight").setup({
	on_colors = function(colors)
		colors.bg = "#1E1E2E"
	end
})

vim.cmd("colorscheme tokyonight-moon")
