-- UI
vim.o.number = true
vim.o.relativenumber = true
vim.o.termguicolors = true
vim.o.signcolumn = "yes"

-- Rounded borders for floating winodows
local orig_util_open_floating_preview = vim.lsp.util.open_floating_preview
function vim.lsp.util.open_floating_preview(contents, syntax, opts, ...)
    opts = opts or {}
    opts.border = "rounded"
    return orig_util_open_floating_preview(contents, syntax, opts, ...)
end

-- Window highlights
vim.cmd("autocmd ColorScheme * hi NormalSB guibg=None")
vim.cmd("autocmd ColorScheme * hi SignColumnSB guibg=None")
vim.cmd("autocmd ColorScheme * hi StatusLine guibg=None")
vim.cmd("autocmd ColorScheme * hi WinSeparator guifg=#589ed7")

-- Nvimtree highlights
vim.cmd("autocmd ColorScheme * hi NvimTreeNormal guibg=None")
vim.cmd("autocmd ColorScheme * hi NvimTreeNormalNC guibg=None")
vim.cmd("autocmd ColorScheme * hi NvimTreeWinSeparator guifg=#589ed7")

-- This function is called at the end of BufferLine.lua
local table = {}
function table.BufferLineHighlights()

	-- BufferLine highlights
	vim.cmd("hi BufferLineOffsetSeparator guifg=#589ed7 guibg=None")
	vim.cmd("hi BufferLineFill guifg=Red guibg=None")
	vim.cmd("hi BufferLineSeparator guifg=#1E1E2E guibg=None")

	-- BufferLine selected buffer highlights
	vim.cmd("hi BufferLineBufferSelected gui=None guibg=#27273a")
	vim.cmd("hi BufferlineCloseButtonSelected guibg=#27273a")
	vim.cmd("hi BufferLineIndicatorSelected guifg=#80a0ff guibg=#27273a")
	vim.cmd("hi BufferLineModifiedSelected guifg=#c8d3f5 guibg=#27273a")

	-- Not Focused
	vim.cmd("hi BufferLineBufferVisible guifg=#c8d3f5 guibg=#27273a")
	vim.cmd("hi BufferLineCloseButtonVisible guifg=#c8d3f5 guibg=#27273a")
	vim.cmd("hi BufferLineSeparatorVisible guifg=#27273a guibg=None")
	vim.cmd("hi BufferLineIndicatorVisible guifg=#80a0ff guibg=#27273a")
	vim.cmd("hi BufferLineModifiedVisible guifg=#c8d3f5 guibg=#27273a")

	-- BufferLine not selected buffer highlights
	vim.cmd("hi BufferLineBackground guifg=#636da6 guibg=None")
	vim.cmd("hi BufferlineCloseButton guifg=#636da6 guibg=None")
	vim.cmd("hi BufferLineModified guifg=#636da6 guibg=None")

end

-- UX
vim.o.autoindent = true
vim.o.wrap = false
vim.o.tabstop = 4
vim.o.shiftwidth = 4
vim.o.shiftround = true
vim.opt.iskeyword:remove({'-','_'})

-- Disable mouse
vim.o.mouse = ""

-- Makes neovim and host OS clipboard play nicely with each other
vim.o.clipboard = "unnamedplus"

-- Case insensitive searching UNLESS /C or capital in search
vim.o.ignorecase = true
vim.o.smartcase = true

-- Undo and backup options
vim.o.backup = false
vim.o.undofile = true
vim.o.swapfile = false

-- Better buffer splitting
vim.o.splitright = true
vim.o.splitbelow = true

-- Preserve view while jumping
vim.o.jumpoptions = 'view'

return table
