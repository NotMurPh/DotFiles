-- Keymap made simpler
local keymap = vim.keymap.set

-- Global keybind optins
local options = { noremap = true , silent = true }

-- General Keymaps
vim.g.mapleader = ";"
keymap( "n" , "<Leader>o" , "o<Esc>" , options )
keymap( "n" , "<Leader>O" , "O<Esc>" , options )
keymap( "n" , "<Leader>c" , ":noh<CR>" , options )

-- Gitsings
local gs = require("gitsigns")
keymap( { "n" , "v" } , "<leader>ha" , ":Gitsigns stage_hunk<CR>" , options )
keymap( { "n" , "v" } , "<leader>hr" , ":Gitsigns reset_hunk<CR>" , options )
keymap( "n" , "<leader>hu" , gs.undo_stage_hunk , options )
keymap( "n" , "<leader>hp" , gs.preview_hunk , options )
keymap( "n" , "<leader>hb" , function() gs.blame_line({full = false}) end , options )
keymap( "n" , "<leader>hd" , gs.diffthis , options )

-- Terminal
keymap( "t" , "<C-n>" , "<C-\\><C-n>" )
keymap( { "n" , "t" } , "<C-t>" , "<cmd>ToggleTerm direction=float<CR>" , options )

-- Nvim cheat
keymap( "n" , "<leader>s" , "<cmd>Cheat<CR>" , options )

-- Telescope
local builtin = require("telescope.builtin")
keymap( "n" , "<leader>ff" , function() builtin.find_files({hidden=true}) end , options )
keymap( "n" , "<leader>fo" , builtin.oldfiles , options )
keymap( "n" , "<leader>fw" , builtin.live_grep , options )
keymap( "n" , "<leader>fb" , builtin.buffers , options )
keymap( "n" , "<leader>fr" , builtin.lsp_references , options )
keymap( "n" , "<leader>fi" , builtin.lsp_implementations , options )
keymap( "n" , "<leader>fg" , builtin.git_status , options )
keymap( "n" , "<leader>fs" , builtin.spell_suggest , options )
keymap( "n" , "<leader>fh" , builtin.highlights	, options )

-- Dashboard
keymap( "n" , "<leader>ls" , "<cmd>source ~/.config/nvim/LastSession.vim<CR>" , options )
keymap( "n" , "<leader>ln" , "<cmd>cd ~/DotFiles/StarryNight/home/murphy/.config/nvim<CR><cmd>Telescope find_files hidden=true<CR>" , options )
keymap( "n" , "<leader>n" , "<cmd>e Unknown<CR>" , options )

-- Lsp related keymaps wont work without an active lsp
keymap( "n" , "gd" , vim.lsp.buf.definition , options )
keymap( "n" , "gD" , vim.lsp.buf.declaration , options )
keymap( "n" , "gi" , vim.lsp.buf.implementation , options )
keymap( "n" , "gr" , vim.lsp.buf.references , options )
keymap( "n" , "K" , vim.lsp.buf.hover , options )
keymap( "n" , "<leader>rn" , vim.lsp.buf.rename , options )
keymap( "n" , "<leader>a" , vim.lsp.buf.code_action , options )
keymap( "n" , "<leader>lf" , function() vim.lsp.buf.format{async = true} end , options )
keymap( "n" , "<leader>le" , vim.diagnostic.open_float , options )
keymap( "n" , "<leader>d" , "<cmd>lua vim.diagnostic.goto_next()<CR>" , options )

-- CMP
local cmp = require("cmp")
keymap( "i" , "<C-b>" , function() cmp.scroll_docs(-4) end , options )
keymap( "i" , "<C-f>" , function() cmp.scroll_docs(4) end , options )
keymap( "i" , "<CR>" ,  function() cmp.confirm({select = true}) end , options )
keymap( "i" , "<C-e>" , cmp.abort , options )

-- Luasnip
local ls = require("luasnip")

keymap( { "n" , "i" , "s" } , "<C-k>" , function()
	if ls.expand_or_jumpable() then
		ls.expand_or_jump()
	end
end , options )

keymap( { "n" , "i" , "s" } , "<C-j>" , function()
	if ls.jumpable(-1) then
		ls.jump(-1)
	end
end , options )

-- Filetree
keymap( "n" , "<C-n>" , "<cmd>NvimTreeToggle<CR>" , options )
keymap( "n" , "<leader>e" , "<cmd>NvimTreeFocus<CR>" , options )

-- BufferLine
keymap( "n" , "<leader>x" , "<cmd>Bdelete<enter>" , options )
keymap( "n" , "<C-l>" , "<cmd>BufferLineCycleNext<enter>" , options )
keymap( "n" , "<C-h>" , "<cmd>BufferLineCyclePrev<enter>" , options )
keymap( "n" , "<leader>gx" , function() -- Delete other buffers
    for _, bufnr in ipairs(vim.api.nvim_list_bufs()) do
        local info = vim.fn.getbufinfo(bufnr)[1]
        local is_term = string.find(info.name, "term://")
        if info.hidden == 1 and not is_term then
            require("bufdelete").bufdelete(bufnr)
        end
    end
end , options )
